import React, { useState } from 'react';
import { Music, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import HelpModal from '../ui/HelpModal';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  // Modal durumlarını yönetmek için state'ler
  const [modalType, setModalType] = useState<'faq' | 'terms' | 'privacy' | 'cookie' | 'kvkk' | null>(null);
  
  // Modal açma fonksiyonu
  const openModal = (type: 'faq' | 'terms' | 'privacy' | 'cookie' | 'kvkk') => {
    setModalType(type);
  };
  
  // Modal kapatma fonksiyonu
  const closeModal = () => {
    setModalType(null);
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Music className="w-8 h-8 text-[#d4ff00]" />
              <span className="text-2xl font-bold">eventify</span>
            </div>
            <p className="text-gray-400 mb-4">
              Türkiye'nin en büyük etkinlik biletleme platformu. Konser, tiyatro, festival ve çok daha fazlası...
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#d4ff00] transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#d4ff00] transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#d4ff00] transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#d4ff00] transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="text-gray-400 hover:text-[#d4ff00] transition-colors">Hakkımızda</Link>
              </li>
              <li>
                <Link to="/career" className="text-gray-400 hover:text-[#d4ff00] transition-colors">Kariyer</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#d4ff00] transition-colors">İletişim</Link>
              </li>
              <li>
                <button 
                  onClick={() => openModal('kvkk')}
                  className="text-gray-400 hover:text-[#d4ff00] transition-colors text-left w-full"
                >
                  KVKK
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Yardım</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-[#d4ff00] transition-colors">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => openModal('terms')}
                  className="text-gray-400 hover:text-[#d4ff00] transition-colors text-left w-full"
                >
                  Kullanım Koşulları
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('privacy')}
                  className="text-gray-400 hover:text-[#d4ff00] transition-colors text-left w-full"
                >
                  Gizlilik Politikası
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('cookie')}
                  className="text-gray-400 hover:text-[#d4ff00] transition-colors text-left w-full"
                >
                  Çerez Politikası
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex justify-center">
          <p className="text-gray-400 text-sm text-center">© 2024 Eventify. Tüm hakları saklıdır.</p>
        </div>
      </div>
      
      {/* Help Modal */}
      {modalType && (
        <HelpModal 
          isOpen={!!modalType}
          onClose={closeModal}
          type={modalType}
        />
      )}
    </footer>
  );
};

export default Footer; 