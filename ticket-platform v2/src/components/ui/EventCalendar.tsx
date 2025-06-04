import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowRight, MapPin, Clock } from 'lucide-react';
import { Event } from '../../types/supabase';
import { getEvents } from '../../api/events';

interface EventCalendarProps {
  onEventClick?: (event: Event) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  // Takvim görünümü için gerekli değişkenler
  const [calendarDays, setCalendarDays] = useState<Array<Date | null>>([]);
  
  // Günlerin Türkçe adları
  const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  
  // Ayların Türkçe adları
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // Etkinlikleri getir
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        setError('Etkinlikler yüklenirken bir hata oluştu');
        console.error('Etkinlikleri getirme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Takvim günlerini oluştur
  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // Ayın ilk günü
      const firstDayOfMonth = new Date(year, month, 1);
      
      // Haftanın hangi günü olduğu (0-6, 0 = Pazar)
      let dayOfWeek = firstDayOfMonth.getDay();
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0-6 yerine 1-7 (Pazartesi başlangıç)
      
      // Önceki ayın son günleri
      const daysFromPrevMonth = dayOfWeek;
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      
      // Mevcut ayın toplam gün sayısı
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Sonraki ayın ilk günleri (6 satırlık takvim için)
      const requiredDays = 6 * 7; // 6 satır x 7 gün
      const daysFromNextMonth = requiredDays - daysInMonth - daysFromPrevMonth;
      
      const days: Array<Date | null> = [];
      
      // Önceki ayın günleri
      for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, prevMonthLastDay - i));
      }
      
      // Mevcut ayın günleri
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
      
      // Sonraki ayın günleri
      for (let i = 1; i <= daysFromNextMonth; i++) {
        days.push(new Date(year, month + 1, i));
      }
      
      setCalendarDays(days);
    };
    
    generateCalendarDays();
  }, [currentDate]);

  // Önceki aya geç
  const goToPrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  // Sonraki aya geç
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  // Bugüne git
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  // Belirli bir günün etkinliklerini bul
  const getEventsForDay = (day: Date): Event[] => {
    if (!events.length) return [];

    // Gün başlangıç ve bitiş zamanları
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);
    
    // O günün etkinliklerini filtrele
    return events.filter(event => {
      const eventDate = new Date(event.start_date);
      return eventDate >= startOfDay && eventDate <= endOfDay;
    });
  };

  // Takvim günü render fonksiyonu
  const renderDay = (day: Date | null, index: number) => {
    if (!day) return <div key={index} className="h-28 md:h-36 border border-gray-200 bg-gray-50 opacity-50"></div>;
    
    const dayEvents = getEventsForDay(day);
    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
    const isToday = isSameDay(day, new Date());
    const isSelected = selectedDay && isSameDay(day, selectedDay);
    const hasEvents = dayEvents.length > 0;
    
    // Günün hafta sonu olup olmadığını kontrol et
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    
    return (
      <div 
        key={index} 
        onClick={() => setSelectedDay(day)}
        className={`h-28 md:h-36 border transition-all duration-200 relative cursor-pointer 
          ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'} 
          ${isToday ? 'shadow-[inset_0_0_0_2px_#d4ff00]' : 'border-gray-200'} 
          ${isSelected ? 'shadow-[inset_0_0_0_2px_#d4ff00] bg-[#d4ff00]/5' : ''}
          ${isWeekend && isCurrentMonth ? 'bg-gray-50/50' : ''}
          ${hasEvents ? 'hover:shadow-md' : 'hover:bg-gray-50'}`}
      >
        <div className={`flex justify-between items-center p-2 ${isWeekend && isCurrentMonth ? 'bg-gray-50/80' : ''}`}>
          <span className={`text-sm flex items-center justify-center w-7 h-7 rounded-full font-medium
            ${isToday ? 'bg-[#d4ff00] text-gray-900' : ''}
            ${isSelected && !isToday ? 'bg-gray-800 text-white' : ''}`}
          >
            {day.getDate()}
          </span>
          
          {hasEvents && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              {dayEvents.length}
            </span>
          )}
        </div>
        
        <div className="overflow-y-auto scrollbar-thin h-[calc(100%-32px)] p-1">
          {dayEvents.slice(0, 3).map((event, eventIndex) => (
            <div 
              key={eventIndex}
              className="text-xs p-1.5 mb-1 rounded-md shadow-sm border-l-2 border-[#d4ff00] hover:bg-white cursor-pointer transition-all group flex flex-col"
              style={{ backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.8)' : 'rgba(212, 255, 0, 0.05)' }}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick && onEventClick(event);
              }}
            >
              <span className="font-medium text-gray-900 truncate mb-0.5 group-hover:text-[#d4ff00] transition-colors">{event.title}</span>
              <div className="flex items-center text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                <span>
                  {new Date(event.start_date).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {dayEvents.length > 3 && (
            <button 
              className="text-xs w-full text-center py-1 text-[#d4ff00] hover:underline font-medium flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                // Daha fazla etkinlik için yapılabilecek bir işlem burada olabilir
                // Şu an için sadece ilk etkinliği gösteriyoruz
                onEventClick && onEventClick(dayEvents[3]);
              }}
            >
              <span>+{dayEvents.length - 3} daha</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // İki tarihin aynı gün olup olmadığını kontrol et
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Seçilen günün etkinlikleri
  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border-b border-gray-200">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-[#d4ff00]/20 p-2 rounded-lg mr-3">
            <CalendarIcon className="w-5 h-5 text-gray-700" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <button 
            onClick={goToToday}
            className="px-3 py-1.5 flex items-center space-x-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            <span>Bugün</span>
          </button>
          
          <div className="flex border rounded-lg overflow-hidden">
            <button 
              onClick={goToPrevMonth}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-[#d4ff00] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          {error}
        </div>
      ) : (
        <div>
          {/* Takvim Bölümü */}
          <div className="p-2 md:p-4">
            {/* Haftanın günleri */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`text-center py-2 text-sm font-medium text-gray-500 ${
                    index >= 5 ? 'text-gray-400' : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Takvim günleri */}
            <div className="grid grid-cols-7 border-t border-l border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {calendarDays.map((day, index) => renderDay(day, index))}
            </div>
          </div>
          
          {/* Seçilen gün için etkinlik listesi (optiyonel) */}
          {selectedDay && selectedDayEvents.length > 0 && (
            <div className="border-t border-gray-200 mt-4 p-4">
              <div className="flex items-center mb-4">
                <div className="w-2 h-10 bg-[#d4ff00] rounded-full mr-3"></div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedDay.getDate()} {monthNames[selectedDay.getMonth()]} {selectedDay.getFullYear()} ({weekDays[selectedDay.getDay() === 0 ? 6 : selectedDay.getDay() - 1]})
                  </h3>
                  <p className="text-sm text-gray-500">{selectedDayEvents.length} etkinlik</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {selectedDayEvents.map((event, index) => (
                  <div 
                    key={index}
                    onClick={() => onEventClick && onEventClick(event)}
                    className="bg-gray-50 hover:bg-white border border-gray-200 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md group"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 group-hover:text-[#d4ff00] transition-colors">{event.title}</h4>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {new Date(event.start_date).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCalendar; 