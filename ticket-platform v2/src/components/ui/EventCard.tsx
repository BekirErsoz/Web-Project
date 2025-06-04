import React, { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Event } from '../../types/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { isEventFavorited } from '../../api/favorites';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  viewMode?: 'grid' | 'list';
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, viewMode = 'grid' }) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Favorileri kontrol et - sadece bilgi amaçlı tutuyoruz
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const favorited = await isEventFavorited(user.id, event.id);
          setIsFavorited(favorited);
        } catch (error) {
          console.error('Favori durumu kontrol edilirken hata:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, event.id]);

  // Liste görünümü
  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#d4ff00] cursor-pointer flex"
        onClick={onClick}
      >
        <div className="relative h-auto w-48 min-w-48 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-[#d4ff00] transition-colors">{event.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{event.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(event.start_date).toLocaleDateString('tr-TR')}
              </span>
              <span className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {event.location}
              </span>
            </div>
            
            <div className="text-right">
              <span className="bg-[#d4ff00] text-gray-900 font-medium px-3 py-1 rounded-full">
                {event.price === 0 ? 'ÜCRETSİZ' : `${event.price} TL`}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Izgara görünümü (varsayılan)
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border border-transparent hover:border-[#d4ff00] cursor-pointer"
      onClick={onClick}
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
        <h3 className="text-xl font-semibold mb-2 group-hover:text-[#d4ff00] transition-colors line-clamp-1">{event.title}</h3>
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
  );
};

export default EventCard; 