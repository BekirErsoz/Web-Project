import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL'deki hash parametrelerini işle
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Ana sayfaya yönlendir - sayfa yenileme kullanarak
        // Bu şekilde tam bir yenileme olacak ve oturum durumu taze bir şekilde yüklenecek
        window.location.href = '/';
      } catch (err: any) {
        console.error('Auth callback hatası:', err);
        setError(err.message || 'Kimlik doğrulama işlemi sırasında bir hata oluştu');
      }
    };

    // Sayfa yüklendikten 1 saniye sonra kimlik doğrulama işlemini başlat
    // Bu kısa gecikme Supabase'in oturumu doğru şekilde tanıması için zaman tanır
    const timer = setTimeout(() => {
    handleAuthCallback();
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg inline-block">
          <h2 className="text-xl font-bold mb-2">Giriş Hatası</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="mt-4 bg-[#d4ff00] text-gray-900 px-4 py-2 rounded-lg font-medium"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="inline-block">
        <div className="w-16 h-16 border-4 border-[#d4ff00] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg">Giriş işleminiz tamamlanıyor...</p>
        <p className="mt-2 text-gray-500">Ana sayfaya yönlendiriliyorsunuz...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 