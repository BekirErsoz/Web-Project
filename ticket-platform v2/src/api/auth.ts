import supabase from '../utils/supabase';
import { User } from '../types/supabase';

export const signUp = async (email: string, password: string, fullName: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) {
      console.error('Kayıt olurken hata oluştu:', error);
      throw error;
    }

    // Kullanıcı profili oluştur
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          full_name: fullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profil oluşturulurken hata oluştu:', profileError);
      }
    }

    return data.user as unknown as User;
  } catch (error) {
    console.error('Kayıt işlemi sırasında beklenmeyen hata:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Giriş yaparken hata oluştu:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Giriş işlemi sırasında beklenmeyen hata:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('Google ile giriş yaparken hata oluştu:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Google ile giriş işlemi sırasında beklenmeyen hata:', error);
    throw error;
  }
};

export const signInWithApple = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('Apple ile giriş yaparken hata oluştu:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Apple ile giriş işlemi sırasında beklenmeyen hata:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Çıkış yaparken hata oluştu:', error);
      throw error;
    }
  } catch (error) {
    console.error('Çıkış işlemi sırasında beklenmeyen hata:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Kullanıcı bilgisi alınırken hata oluştu:', error);
      throw error;
    }
    
    return data.user;
  } catch (error) {
    console.error('Kullanıcı bilgisi alınırken beklenmeyen hata:', error);
    return null;
  }
};

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Oturum bilgisi alınırken hata oluştu:', error);
      throw error;
    }
    
    return data.session;
  } catch (error) {
    console.error('Oturum bilgisi alınırken beklenmeyen hata:', error);
    return null;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Şifre sıfırlama isteği gönderilirken hata oluştu:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Şifre sıfırlama işlemi sırasında beklenmeyen hata:', error);
    throw error;
  }
};
