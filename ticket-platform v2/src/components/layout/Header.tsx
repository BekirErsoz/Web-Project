import React, { useState } from 'react';
import { Music, Heart, Calendar, LogOut, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onRegister }) => {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Aktif linki belirle
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      if (loading) {
        console.log('İşlem devam ediyor, lütfen bekleyin...');
        return;
      }
      
      console.log('Çıkış yapılıyor...');
      await signOut();
    } catch (error) {
      console.error('Çıkış yaparken hata oluştu:', error);
      window.location.href = '/';
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="bg-white text-gray-800 py-5 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Desktop Navbar */}
        <div className="hidden md:flex justify-between items-center">
          {/* Logo ve Slogan */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Music className="w-9 h-9 text-[#d4ff00]" />
              <span className="text-2xl font-bold ml-2 text-[#d4ff00]">eventify</span>
              <span className="text-gray-400 mx-3 text-xl">|</span>
              <span className="text-sm text-gray-500 font-medium hidden lg:inline-block">Yeni Nesil Etkinlik Platformu</span>
            </Link>
          </div>
          
          {/* Navigasyon Linkleri */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/events" 
              className={`text-base font-medium transition-all hover:scale-105 ${
                isActive('/events') ? 'text-[#d4ff00]' : 'text-gray-600 hover:text-[#d4ff00]'
              }`}
            >
              Etkinlikler
            </Link>
            
            <Link 
              to="/calendar" 
              className={`text-base font-medium transition-all hover:scale-105 ${
                isActive('/calendar') ? 'text-[#d4ff00]' : 'text-gray-600 hover:text-[#d4ff00]'
              }`}
            >
              Takvim
            </Link>
            
            <Link 
              to="/about-us" 
              className={`text-base font-medium transition-all hover:scale-105 ${
                isActive('/about-us') ? 'text-[#d4ff00]' : 'text-gray-600 hover:text-[#d4ff00]'
              }`}
            >
              Hakkımızda
            </Link>
            
            <Link 
              to="/contact" 
              className={`text-base font-medium transition-all hover:scale-105 ${
                isActive('/contact') ? 'text-[#d4ff00]' : 'text-gray-600 hover:text-[#d4ff00]'
              }`}
            >
              İletişim
            </Link>
            
            <Link 
              to="/faq" 
              className={`text-base font-medium transition-all hover:scale-105 ${
                isActive('/faq') ? 'text-[#d4ff00]' : 'text-gray-600 hover:text-[#d4ff00]'
              }`}
            >
              SSS
            </Link>
            
            {user && (
              <Link 
                to="/favorites" 
                className={`text-base font-medium transition-all hover:scale-105 flex items-center ${
                  isActive('/favorites') ? 'text-[#d4ff00]' : 'text-gray-600 hover:text-[#d4ff00]'
                }`}
              >
                <Heart className="w-5 h-5 mr-1.5" />
                Favorilerim
              </Link>
            )}
          </div>
          
          {/* Kullanıcı İşlemleri */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/profile"
                  className={`flex items-center space-x-2 ${
                    isActive('/profile') ? 'text-[#d4ff00]' : 'text-gray-600 hover:text-[#d4ff00]'
                  } transition-colors`}
                >
                  <div className="bg-[#d4ff00] w-9 h-9 rounded-full flex items-center justify-center text-gray-900">
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt={user.user_metadata?.full_name || 'Kullanıcı'} 
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-medium">{user.user_metadata?.full_name || 'Profil'}</span>
                </Link>
                
                <button 
                  className="border-2 border-[#d4ff00] bg-white text-[#d4ff00] px-4 py-2 rounded-lg font-medium hover:bg-[#d4ff00]/10 transition-colors flex items-center space-x-1"
                  onClick={handleSignOut}
                  disabled={loading}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{loading ? 'İşlem Yapılıyor...' : 'Çıkış'}</span>
                </button>
              </div>
            ) : (
              <button 
                className="bg-[#d4ff00] text-gray-900 px-5 py-2.5 rounded-lg font-medium hover:bg-[#c4ef00] transition-colors"
                onClick={onLogin}
              >
                Giriş Yap
              </button>
            )}
          </div>
        </div>
        
        {/* Mobil Navbar */}
        <div className="flex md:hidden justify-between items-center">
          <Link to="/" className="flex items-center">
            <Music className="w-8 h-8 text-[#d4ff00]" />
            <span className="text-xl font-bold ml-2 text-[#d4ff00]">eventify</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-xs text-gray-500 font-medium">Yeni Nesil Etkinlik</span>
          </Link>
          
          <button onClick={toggleMobileMenu} className="text-[#d4ff00]">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobil Menü */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white mt-3 rounded-lg p-4 shadow-lg animate-fadeIn border border-gray-100">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/events" 
                className={`text-sm py-2 px-3 rounded-md ${isActive('/events') ? 'bg-[#d4ff00]/20 text-[#d4ff00]' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Etkinlikler
              </Link>
              
              <Link 
                to="/calendar" 
                className={`text-sm py-2 px-3 rounded-md ${isActive('/calendar') ? 'bg-[#d4ff00]/20 text-[#d4ff00]' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Takvim
              </Link>
              
              <Link 
                to="/about-us" 
                className={`text-sm py-2 px-3 rounded-md ${isActive('/about-us') ? 'bg-[#d4ff00]/20 text-[#d4ff00]' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              
              <Link 
                to="/contact" 
                className={`text-sm py-2 px-3 rounded-md ${isActive('/contact') ? 'bg-[#d4ff00]/20 text-[#d4ff00]' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                İletişim
              </Link>
              
              <Link 
                to="/faq" 
                className={`text-sm py-2 px-3 rounded-md ${isActive('/faq') ? 'bg-[#d4ff00]/20 text-[#d4ff00]' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sık Sorulan Sorular
              </Link>
              
              {user && (
                <Link 
                  to="/favorites" 
                  className={`text-sm py-2 px-3 rounded-md flex items-center ${isActive('/favorites') ? 'bg-[#d4ff00]/20 text-[#d4ff00]' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorilerim
                </Link>
              )}
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`text-sm py-2 px-3 rounded-md flex items-center ${isActive('/profile') ? 'bg-[#d4ff00]/20 text-[#d4ff00]' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </Link>
                  
                  <button 
                    className="text-sm py-2 px-3 rounded-md bg-[#d4ff00]/20 text-[#d4ff00] flex items-center font-medium"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    disabled={loading}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {loading ? 'İşlem Yapılıyor...' : 'Çıkış Yap'}
                  </button>
                </>
              ) : (
                <button 
                  className="text-sm py-2 px-3 rounded-md bg-[#d4ff00] text-gray-900 font-medium flex justify-center"
                  onClick={() => {
                    onLogin();
                    setMobileMenuOpen(false);
                  }}
                >
                  Giriş Yap
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 