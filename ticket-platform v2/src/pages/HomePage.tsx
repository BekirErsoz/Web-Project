import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySidebar from '../components/layout/CategorySidebar';
import SearchBar from '../components/ui/SearchBar';
import FeaturedSlider from '../components/ui/FeaturedSlider';
import PopularEvents from '../components/ui/PopularEvents';
import PopularVenues from '../components/ui/PopularVenues';
import EventDetailModal from '../components/ui/EventDetailModal';
import { Event } from '../types/supabase';
import { ArrowRight, Search } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // Etkinlik detay modalını açmak için event listener
  useEffect(() => {
    const handleOpenEventModal = (e: CustomEvent) => {
      setSelectedEvent(e.detail);
      setShowEventModal(true);
    };

    window.addEventListener('openEventModal', handleOpenEventModal as EventListener);

    return () => {
      window.removeEventListener('openEventModal', handleOpenEventModal as EventListener);
    };
  }, []);

  // Arama sonuçlarını işleme
  const handleSearchResults = (results: Event[]) => {
    // Arama sonuçlarıyla arama sayfasına yönlendir
    navigate('/search', { state: { results, searchTerm: '' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="w-full bg-gray-900 relative">
        <div className="absolute inset-0 bg-[url('/hero-background.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-center">
              <span className="text-[#d4ff00]">Eventify</span> ile hayatınıza renk katın
            </h1>
            <p className="text-xl text-white/90 mb-8 text-center max-w-3xl mx-auto">
              Size en uygun etkinlikleri keşfedin, biletlerinizi kolayca alın ve unutulmaz anlar yaşayın.
            </p>
            
            {/* Modern ve Genişletilmiş Arama Çubuğu */}
            <div className="w-full bg-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center">
                <div className="bg-[#d4ff00] p-3 rounded-full mr-4">
                  <Search className="w-6 h-6 text-gray-900" />
                </div>
                <div className="flex-grow">
                  <SearchBar onSearchResults={handleSearchResults} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Categories Sidebar */}
          <CategorySidebar />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Öne Çıkan Etkinlikler Başlığı */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Öne Çıkan Etkinlikler</h2>
              <button 
                onClick={() => navigate('/events')}
                className="flex items-center text-sm font-medium text-[#d4ff00] hover:underline"
              >
                Tümünü Gör <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Featured Events Slider */}
            <FeaturedSlider />

            {/* Popular Events */}
            <PopularEvents />

            {/* Popular Venues */}
            <PopularVenues />
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        event={selectedEvent}
      />
    </div>
  );
};

export default HomePage; 