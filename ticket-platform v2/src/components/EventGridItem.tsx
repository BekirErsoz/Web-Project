import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Event } from '../types/supabase';

interface EventGridItemProps {
  event: Event;
  onClick: (event: Event) => void;
  onFavoriteClick?: (event: Event) => void;
}

const EventGridItem: React.FC<EventGridItemProps> = ({ event, onClick, onFavoriteClick }) => (
  <div 
    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border border-transparent hover:border-[#d4ff00] cursor-pointer"
    onClick={() => onClick(event)}
  >
    <div className="relative overflow-hidden">
      <img
        src={event.image_url}
        alt={event.title}
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
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
          <span className="truncate max-w-[120px]">{event.location}</span>
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

export default EventGridItem; 