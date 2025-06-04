import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../../types/supabase';
import { getPopularEvents } from '../../api/events';

const PopularEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const eventsPerPage = 6; // 3 yerine 6 etkinlik gösterilecek (2x3 grid)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getPopularEvents(18); // Daha fazla etkinlik yükleyelim
        setAllEvents(eventsData);
        setEvents(eventsData.slice(0, eventsPerPage));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Etkinlikler yüklenirken bir hata oluştu');
        console.error('Popüler etkinlikler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleNextPage = () => {
    const totalPages = Math.ceil(allEvents.length / eventsPerPage);
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setEvents(allEvents.slice(newPage * eventsPerPage, (newPage + 1) * eventsPerPage));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setEvents(allEvents.slice(newPage * eventsPerPage, (newPage + 1) * eventsPerPage));
    }
  };

  if (loading) {
    return (
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-8">Popüler Etkinlikler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-xl h-72 animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div key={index + 3} className="bg-gray-100 rounded-xl h-72 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-8">Popüler Etkinlikler</h2>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-8">Popüler Etkinlikler</h2>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500">Henüz etkinlik bulunmuyor</p>
        </div>
      </div>
    );
  }

  // İlk üç etkinlik ve son üç etkinlik olarak ayır
  const firstRowEvents = events.slice(0, 3);
  const secondRowEvents = events.slice(3, 6);

  return (
    <div className="mb-14">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Popüler Etkinlikler</h2>
        <div className="flex space-x-2">
          <button 
            className={`p-2 rounded-full border ${currentPage === 0 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'hover:border-[#d4ff00] hover:bg-[#d4ff00]/10 cursor-pointer'} transition-colors`}
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            aria-label="Önceki etkinlikler"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            className={`p-2 rounded-full border ${(currentPage + 1) * eventsPerPage >= allEvents.length ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'hover:border-[#d4ff00] hover:bg-[#d4ff00]/10 cursor-pointer'} transition-colors`}
            onClick={handleNextPage}
            disabled={(currentPage + 1) * eventsPerPage >= allEvents.length}
            aria-label="Sonraki etkinlikler"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* İlk satır (ilk 3 etkinlik) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {firstRowEvents.map((event) => (
          <div 
            key={event.id} 
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border border-transparent hover:border-[#d4ff00] cursor-pointer"
            onClick={() => window.dispatchEvent(new CustomEvent('openEventModal', { detail: event }))}
          >
            <div className="relative overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="text-white p-4">
                  <span className="text-[#d4ff00] font-medium">İncele</span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[#d4ff00] transition-colors">{event.title}</h3>
              <div className="flex items-center text-gray-600 space-x-4 mb-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(event.start_date).toLocaleDateString('tr-TR')}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {event.location}
                </span>
              </div>
              <div className="flex justify-center items-center">
                <span className="bg-[#d4ff00] text-gray-900 font-medium px-3 py-1 rounded-full">
                  {event.price === 0 ? 'ÜCRETSİZ' : `${event.price} TL`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* İkinci satır (son 3 etkinlik) - Eğer ikinci satırda etkinlik varsa göster */}
      {secondRowEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {secondRowEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border border-transparent hover:border-[#d4ff00] cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('openEventModal', { detail: event }))}
            >
              <div className="relative overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="text-white p-4">
                    <span className="text-[#d4ff00] font-medium">İncele</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#d4ff00] transition-colors">{event.title}</h3>
                <div className="flex items-center text-gray-600 space-x-4 mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(event.start_date).toLocaleDateString('tr-TR')}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {event.location}
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <span className="bg-[#d4ff00] text-gray-900 font-medium px-3 py-1 rounded-full">
                    {event.price === 0 ? 'ÜCRETSİZ' : `${event.price} TL`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularEvents; 