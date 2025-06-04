import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Event } from '../types/supabase';

interface EventListItemProps {
  event: Event;
  onClick: (event: Event) => void;
  onFavoriteClick?: (event: Event) => void;
}

const EventListItem: React.FC<EventListItemProps> = ({ event, onClick, onFavoriteClick }) => (
  <div 
    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#d4ff00] cursor-pointer flex flex-col md:flex-row gap-4"
    onClick={() => onClick(event)}
  >
    <div className="w-full md:w-48 h-48 md:h-32 relative rounded-lg overflow-hidden flex-shrink-0">
      <img
        src={event.image_url}
        alt={event.title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-semibold mb-2 hover:text-[#d4ff00] transition-colors line-clamp-1">{event.title}</h3>
      <p className="text-gray-600 line-clamp-2 mb-3">{event.description}</p>
      <div className="flex flex-wrap items-center text-gray-600 gap-4">
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(event.start_date).toLocaleDateString('tr-TR')}
        </span>
        <span className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {event.location}
        </span>
      </div>
    </div>
    <div className="flex-shrink-0 flex items-center justify-end">
      <span className="bg-[#d4ff00] text-gray-900 font-medium px-3 py-1 rounded-full">
        {event.price === 0 ? 'ÜCRETSİZ' : `${event.price} TL`}
      </span>
    </div>
  </div>
);

export default EventListItem; 