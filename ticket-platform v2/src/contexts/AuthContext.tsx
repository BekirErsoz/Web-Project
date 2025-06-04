import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getCurrentUser, getSession, signIn, signOut, signUp, signInWithGoogle, signInWithApple, resetPassword } from '../api/auth';
import supabase from '../utils/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Oturum bilgisini yerel depolamada saklamak için anahtarlar
const AUTH_STORAGE_KEY = 'eventify_auth_data';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Oturum bilgisini yerel depolamaya kaydetme
  const saveAuthToStorage = (userInfo: User | null) => {
    if (userInfo) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userId: userInfo.id }));
      } catch (e) {
        console.error('Oturum bilgisi saklanamadı:', e);
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  // Sayfa yüklendiğinde oturumu kontrol et
  useEffect(() => {
    let mounted = true;

    const fetchSessionData = async () => {
      try {
        setLoading(true);
        console.log('Oturum bilgisi alınıyor...');
        
        // Önce yerel depolamayı kontrol et
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        
        // Oturum bilgisini al
        const currentSession = await getSession();
        if (!mounted) return;

        if (currentSession) {
          console.log('Aktif oturum bulundu');
          setSession(currentSession);
          
          // Kullanıcı bilgilerini al
          const currentUser = await getCurrentUser();
          if (!mounted) return;
          
          if (currentUser) {
            console.log('Kullanıcı bilgisi alındı:', currentUser.email);
            setUser(currentUser);
            saveAuthToStorage(currentUser);
          }
        } else if (storedAuth) {
          // Oturum bulunamadı ama yerel depolama var, mevcut oturumu yeniden kontrol et
          console.log('Yerel depolamada oturum bilgisi bulundu, yeniden kontrol ediliyor...');
          const refreshedSession = await getSession();
          if (!mounted) return;
          
          if (refreshedSession) {
            console.log('Yenilenen oturum bulundu');
            setSession(refreshedSession);
            const refreshedUser = await getCurrentUser();
            if (refreshedUser) {
              setUser(refreshedUser);
              saveAuthToStorage(refreshedUser);
            }
          } else {
            // Yerel depolamadaki bilgi artık geçerli değil
            console.log('Yerel depolamadaki oturum bilgisi geçersiz, temizleniyor');
            localStorage.removeItem(AUTH_STORAGE_KEY);
            setUser(null);
            setSession(null);
          }
        } else {
          // Oturum yok
          console.log('Aktif oturum bulunamadı');
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error("Oturum yüklenirken hata:", error);
        if (mounted) {
          setError(error as Error);
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSessionData();

    // Supabase Auth değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sessionData) => {
        console.log('Auth durumu değişti:', event, sessionData?.user?.email);
        
        if (!mounted) return;
        
        try {
          if (sessionData?.user) {
            // Oturum açık
            setSession(sessionData);
            const currentUser = await getCurrentUser();
            if (!mounted) return;
            
            if (currentUser) {
              setUser(currentUser);
              saveAuthToStorage(currentUser);
              console.log('Kullanıcı oturumu güncellendi');
            }
          } else {
            // Oturum kapalı
            setUser(null);
            setSession(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
            console.log('Kullanıcı oturumu kapatıldı');
          }
        } catch (error) {
          console.error('Auth durumu değişikliğinde hata:', error);
          if (mounted) {
            setUser(null);
            setSession(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const clearError = () => setError(null);

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      clearError();
      await signUp(email, password, fullName);
    } catch (error) {
      console.error("Kayıt olurken hata:", error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      const { session: newSession, user: newUser } = await signIn(email, password);
      
      if (newSession && newUser) {
        setSession(newSession);
        setUser(newUser);
        saveAuthToStorage(newUser);
        console.log('Kullanıcı başarıyla giriş yaptı:', newUser.email);
        
        // Sayfa yenileme - ana sayfaya yönlendirme
        window.location.href = '/';
      } else {
        console.error('Giriş başarılı oldu ancak oturum veya kullanıcı bilgisi eksik');
        throw new Error('Giriş sırasında bir sorun oluştu');
      }
    } catch (error) {
      console.error("Giriş yaparken hata:", error);
      setError(error as Error);
      setSession(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      clearError();
      await signInWithGoogle();
      // Not: Yönlendirme sonrası oturum onAuthStateChange ile güncellenecek
    } catch (error) {
      console.error("Google ile giriş yaparken hata:", error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      clearError();
      await signInWithApple();
      // Not: Yönlendirme sonrası oturum onAuthStateChange ile güncellenecek
    } catch (error) {
      console.error("Apple ile giriş yaparken hata:", error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      clearError();
      await signOut();
      setSession(null);
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      console.log('Kullanıcı başarıyla çıkış yaptı');
      
      // Sayfa yenileme - ana sayfaya yönlendirme
      window.location.href = '/';
    } catch (error) {
      console.error("Çıkış yaparken hata:", error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setLoading(true);
      clearError();
      await resetPassword(email);
    } catch (error) {
      console.error("Şifre sıfırlama işlemi sırasında hata:", error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    session,
    user,
    loading,
    error,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signInWithGoogle: handleGoogleSignIn,
    signInWithApple: handleAppleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth hook must be used within an AuthProvider');
  }
  return context;
}; 