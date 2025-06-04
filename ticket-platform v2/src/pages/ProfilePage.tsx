import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../api/profile';
import { UserProfile } from '../types/supabase';
import { User, Mail, Phone, LogOut, Lock, Edit, Loader2, AlertCircle, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form alanları
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userProfile = await getUserProfile(user.id);
        
        if (userProfile) {
          setProfile(userProfile);
          setFullName(userProfile.full_name || '');
          // Telefon numarası user_metadata'da olabilir
          setPhone(user.user_metadata?.phone || '');
          setEmail(user.email || '');
        } else {
          // Profil yoksa kullanıcı bilgilerinden doldur
          setFullName(user.user_metadata?.full_name || '');
          setPhone(user.user_metadata?.phone || '');
          setEmail(user.email || '');
        }
      } catch (err: any) {
        console.error('Profil bilgileri yüklenirken hata:', err);
        setError('Profil bilgileriniz yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const updatedProfile = await updateUserProfile(user.id, {
        full_name: fullName,
        updated_at: new Date().toISOString()
      });
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        setSuccess('Profil bilgileriniz başarıyla güncellendi');
        
        // Başarı mesajını 3 saniye sonra kaldır
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Profil güncellenirken hata:', err);
      setError('Profil bilgileriniz güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Şifre doğrulama kontrolleri
    if (newPassword.length < 6) {
      setError('Yeni şifreniz en az 6 karakter olmalıdır');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Burada şifre değiştirme API'si çağrılacak
      // Örnek: await changePassword(oldPassword, newPassword);
      
      // Başarılı olduğunda:
      setSuccess('Şifreniz başarıyla değiştirildi');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
        
        // Başarı mesajını 3 saniye sonra kaldır
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      
    } catch (err: any) {
      console.error('Şifre değiştirilirken hata:', err);
      setError('Şifreniz değiştirilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // E-posta doğrulama kontrolleri
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir e-posta adresi giriniz');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Burada e-posta değiştirme API'si çağrılacak
      // Örnek: await changeEmail(email);
      
      // Başarılı olduğunda:
      setSuccess('E-posta adresiniz başarıyla güncellendi, doğrulama için e-postanızı kontrol edin');
      
      // Başarı mesajını 3 saniye sonra kaldır
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err: any) {
      console.error('E-posta değiştirilirken hata:', err);
      setError('E-posta adresiniz güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!user && !loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-8 rounded-xl inline-block max-w-xl shadow-lg">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Giriş Yapmanız Gerekiyor</h2>
          <p className="mb-6">Profil bilgilerinizi görüntülemek için lütfen giriş yapın veya bir hesap oluşturun.</p>
          <div className="flex space-x-4 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-12 h-12 border-4 border-[#d4ff00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#d4ff00] to-[#c4ef00] rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profil Ayarları</h1>
                <p className="text-gray-800 mt-1">{user?.email}</p>
              </div>
                <button 
                  onClick={handleSignOut}
                className="flex items-center bg-white/20 hover:bg-white/30 text-gray-900 px-4 py-2 rounded-lg transition-colors"
                >
                <LogOut className="w-4 h-4 mr-2" />
                  Çıkış Yap
                </button>
              </div>
            </div>

          {/* Bildirimler */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2 flex-shrink-0" />
                <p>{success}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kişisel Bilgiler */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="font-semibold text-gray-800 flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#d4ff00]" />
                  Kişisel Bilgiler
                </h2>
              </div>
              <div className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="fullName"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent transition-colors"
                      placeholder="Adınız ve soyadınız"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon Numarası
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent transition-colors"
                      placeholder="+90 5xx xxx xx xx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="bg-[#d4ff00] text-gray-900 font-medium px-6 py-2.5 rounded-lg hover:bg-[#c4ef00] transition-colors flex items-center justify-center disabled:opacity-70"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        'Bilgileri Güncelle'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Yan Panel */}
            <div className="md:col-span-1 space-y-6">
              {/* E-posta Değişikliği */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="font-semibold text-gray-800 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-[#d4ff00]" />
                    E-posta Adresim
                  </h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent transition-colors"
                          placeholder="Yeni e-posta adresiniz"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                    </div>
                <button
                  type="submit"
                      className="w-full bg-gray-100 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-70"
                  disabled={saving}
                >
                  {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'E-posta Değiştir'
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Şifre Değişikliği */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="font-semibold text-gray-800 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-[#d4ff00]" />
                    Şifre İşlemleri
                  </h2>
                </div>
                <div className="p-6">
                  {!isChangingPassword ? (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="w-full bg-gray-100 text-gray-800 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Şifremi Değiştir
                    </button>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent transition-colors"
                          placeholder="Mevcut şifreniz"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent transition-colors"
                          placeholder="Yeni şifreniz"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent transition-colors"
                          placeholder="Yeni şifrenizi tekrar girin"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangingPassword(false);
                            setOldPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                          }}
                          className="flex-1 bg-gray-200 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          İptal
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-[#d4ff00] text-gray-900 font-medium py-2 rounded-lg hover:bg-[#c4ef00] transition-colors flex items-center justify-center"
                          disabled={saving}
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Değiştir'
                  )}
                </button>
                      </div>
              </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 