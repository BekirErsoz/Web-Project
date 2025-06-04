import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Lock, X, Music, Calendar, Heart, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { signUp, signInWithGoogle, loading, clearError, user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Kullanıcı durumu değiştiğinde kontrol et
  useEffect(() => {
    // Eğer kayıt başarılı olmuşsa ve kullanıcı oluşturulmuşsa
    if (user && registrationSuccess && isOpen) {
      // Kısa bir süre sonra modalı kapat ve giriş modalına yönlendir
      const timer = setTimeout(() => {
        onClose();
        onLogin();
        // Sayfayı yenile
        window.location.href = '/';
      }, 2000); // 2 saniye bekle
      
      return () => clearTimeout(timer);
    }
  }, [user, registrationSuccess, isOpen, onClose, onLogin]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    // En az 6 karakter, en az 1 büyük harf, 1 küçük harf ve 1 sayı
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasMinLength) return 'Şifre en az 6 karakter olmalıdır';
    if (!hasUpperCase) return 'Şifre en az 1 büyük harf içermelidir';
    if (!hasLowerCase) return 'Şifre en az 1 küçük harf içermelidir';
    if (!hasNumber) return 'Şifre en az 1 sayı içermelidir';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    // Form doğrulama
    if (!fullName || fullName.trim().length < 3) {
      setFormError('Lütfen geçerli bir ad soyad girin (en az 3 karakter)');
      return;
    }

    if (!validateEmail(email)) {
      setFormError('Lütfen geçerli bir e-posta adresi girin');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setFormError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Girdiğiniz şifreler eşleşmiyor');
      return;
    }

    if (!acceptTerms) {
      setFormError('Devam etmek için kullanım koşullarını kabul etmelisiniz');
      return;
    }

    try {
      await signUp(email, password, fullName);
      setRegistrationSuccess(true);
      
      // useEffect içinde yönlendirme yapılacak
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      if (err.message?.includes('email already')) {
        setFormError('Bu e-posta adresi zaten kullanılmaktadır');
      } else {
        setFormError(err.message || 'Kayıt olurken bir hata oluştu');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      setFormError(null);
      await signInWithGoogle();
      // Yönlendirme olacağı için kapatmaya gerek yok
    } catch (err: any) {
      setFormError('Google ile kayıt olurken bir hata oluştu');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl overflow-hidden w-full max-w-4xl flex shadow-xl">
        {/* Sol taraf - bilgi ve görsel */}
        <div className="w-2/5 bg-gradient-to-br from-[#d4ff00] to-[#8faf00] p-8 text-gray-900 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-3">eventify</h2>
            <p className="text-xl font-medium mb-6">Yeni Nesil Etkinlik Platformu</p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Neler Sunuyoruz?</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Music className="w-5 h-5" />
                </div>
                <span>Tüm etkinlikler tek platformda</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Calendar className="w-5 h-5" />
                </div>
                <span>Özel indirimler ve kampanyalar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Heart className="w-5 h-5" />
                </div>
                <span>Favori etkinliklerinizi kaydedin</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                <span>Mobil biletiniz her an yanınızda</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="italic text-gray-800">
              "Etkinlik dünyasına katılmak artık çok kolay!"
            </p>
            <p className="text-right mt-2">- Mehmet K.</p>
          </div>
        </div>

        {/* Sağ taraf - form */}
        <div className="w-3/5 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Üye Ol</h2>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {!registrationSuccess && (
          <p className="text-gray-600 mb-6">Etkinlikleri kaçırmamak için üye olun!</p>
          )}
          
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {formError}
            </div>
          )}

          {registrationSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
              Kaydınız başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...
            </div>
          )}
          
          {!registrationSuccess ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  id="name" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent"
                  placeholder="Adınız ve soyadınız"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefon (İsteğe bağlı)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent"
                  placeholder="+905xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  id="email" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent"
                  placeholder="örnek@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  id="password" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Şifreniz en az 6 karakter, 1 büyük harf, 1 küçük harf ve 1 sayı içermelidir.
              </p>
            </div>

            <div>
              <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700 mb-1">Şifre Tekrar</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  id="password-confirm" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center mt-2">
              <input 
                id="terms" 
                type="checkbox" 
                className="h-4 w-4 border-gray-300 rounded text-[#d4ff00] focus:ring-[#d4ff00]" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={loading}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                <span>Kullanım koşullarını ve </span>
                <a href="#" className="text-[#d4ff00] hover:underline">gizlilik sözleşmesini</a>
                <span> kabul ediyorum</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#d4ff00] text-gray-900 font-medium py-3 rounded-lg hover:bg-[#c4ef00] transition-colors flex items-center justify-center"
              disabled={loading || registrationSuccess}
            >
              {loading ? 'Kayıt Yapılıyor...' : 'Üye Ol'}
            </button>
          </form>
          ) : (
            <div className="flex justify-center items-center py-5">
              <div className="w-12 h-12 border-4 border-[#d4ff00] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}

          {!registrationSuccess && (
            <>
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative z-10 bg-white px-4 text-sm text-gray-500">
              veya şununla devam et
            </div>
          </div>

              <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
                  className="flex items-center justify-center py-2.5 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google ile devam et
            </button>
          </div>

          <p className="text-center mt-6 text-gray-600">
            Zaten üye misiniz? 
            <button 
              className="text-[#d4ff00] font-medium ml-1 hover:underline"
              onClick={onLogin}
              type="button"
                  disabled={loading}
            >
              Giriş Yap
            </button>
          </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal; 