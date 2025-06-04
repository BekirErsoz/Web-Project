import React, { useState, useEffect } from 'react';
import EventCalendar from '../components/ui/EventCalendar';
import EventDetailModal from '../components/ui/EventDetailModal';
import SearchBar from '../components/ui/SearchBar';
import { Event } from '../types/supabase';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Filter, MapPin, Tag, ChevronDown, Clock, Grid, List, Info, ChevronRight, Clock3, Calendar, Users, Pin, CalendarDays, Star, Heart } from 'lucide-react';
import { getEvents } from '../api/events';

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTimeFilter, setActiveTimeFilter] = useState<'all' | 'today' | 'week' | 'month' | 'past'>('all');
  
  // Etkinlikleri getir
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Etkinlikleri getirme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  
  // Etkinliğe tıklama işlemi
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  // Arama sonuçlarını işleme
  const handleSearchResults = (results: Event[]) => {
    navigate('/search', { state: { results, searchTerm: '' } });
  };
  
  // Örnek kategoriler
  useEffect(() => {
    // Gerçek projede bu veri API'den gelebilir
    setCategories([
      'Tüm Kategoriler',
      'Konser',
      'Festival',
      'Tiyatro',
      'Stand-up',
      'Sergi',
      'Atölye',
      'Spor'
    ]);
  }, []);
  
  // Filtrelenmiş etkinlikleri al
  const getFilteredEvents = () => {
    let filtered = [...events];
    
    // Kategori filtrelemesi
    if (selectedCategory) {
      // Gerçek uygulamada category_id'ye göre filtrelenecek
      // Şimdilik kategori bilgisi olmadığı için tüm etkinlikleri gösteriyoruz
    }
    
    // Zaman filtrelemesi
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    if (activeTimeFilter === 'today') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate.getDate() === today.getDate() && 
               eventDate.getMonth() === today.getMonth() && 
               eventDate.getFullYear() === today.getFullYear();
      });
    } else if (activeTimeFilter === 'week') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= today && eventDate <= endOfWeek;
      });
    } else if (activeTimeFilter === 'month') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
      });
    } else if (activeTimeFilter === 'past') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate < today;
      });
    }
    
    // Tarihe göre sıralama
    filtered.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    
    return filtered;
  };
  
  // Etkinlikleri tarihe göre grupla
  const groupEventsByDate = (events: Event[]) => {
    const grouped: { [key: string]: Event[] } = {};
    
    events.forEach(event => {
      const date = new Date(event.start_date);
      const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      
      grouped[dateStr].push(event);
    });
    
    return grouped;
  };
  
  // Filtrelenmiş ve gruplandırılmış etkinlikler
  const filteredEvents = getFilteredEvents();
  const groupedEvents = groupEventsByDate(filteredEvents);
  
  // Tarih formatlama
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('tr-TR', options);
  };
  
  // İki tarihin aynı gün olup olmadığını kontrol et
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-10 h-10 text-[#d4ff00] mr-3" />
              <h1 className="text-4xl font-bold">Etkinlik Takvimi</h1>
            </div>
            <p className="text-gray-300 ml-14 mb-8">
              Tüm etkinlikleri tarih bazlı olarak görüntüleyin ve kaçırmak istemediklerinizi takviminize ekleyin.
            </p>

      {/* Arama Çubuğu */}
            <div className="ml-14 max-w-2xl">
      <SearchBar onSearchResults={handleSearchResults} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Ana İçerik */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
            {/* Sol: Görünüm Seçenekleri */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setView('calendar')}
                className={`px-3 py-2 rounded-lg flex items-center text-sm font-medium ${
                  view === 'calendar' 
                    ? 'bg-[#d4ff00] text-gray-900' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4 mr-2" />
                Takvim Görünümü
              </button>
              
              <button 
                onClick={() => setView('list')}
                className={`px-3 py-2 rounded-lg flex items-center text-sm font-medium ${
                  view === 'list' 
                    ? 'bg-[#d4ff00] text-gray-900' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                Liste Görünümü
              </button>
            </div>
            
            {/* Sağ: Filtreler */}
            <div className="flex items-center space-x-3 w-full lg:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center text-sm font-medium"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtreler
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <div className="relative flex-grow lg:max-w-xs">
                <select 
                  className="w-full bg-gray-100 border-none rounded-lg py-2 px-3 appearance-none text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d4ff00]"
                  value={selectedCategory || 'Tüm Kategoriler'}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCategory(value === 'Tüm Kategoriler' ? null : value);
                  }}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Tag className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Filtreler Alanı */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Şehir</label>
                <div className="relative">
                  <select className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-3 appearance-none text-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent">
                    <option>Tüm Şehirler</option>
                    <option>İstanbul</option>
                    <option>Ankara</option>
                    <option>İzmir</option>
                    <option>Antalya</option>
                  </select>
                  <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Ücret</label>
                <div className="flex space-x-2">
                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300 text-[#d4ff00] focus:ring-[#d4ff00]" />
                    <span>Ücretsiz</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300 text-[#d4ff00] focus:ring-[#d4ff00]" />
                    <span>Ücretli</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Zaman</label>
                <div className="relative">
                  <select className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-3 appearance-none text-sm focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent">
                    <option>Herhangi bir zaman</option>
                    <option>Bugün</option>
                    <option>Bu hafta</option>
                    <option>Bu ay</option>
                    <option>Gelecek ay</option>
                  </select>
                  <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </div>
          )}
          
          {/* Bilgi Notu */}
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 flex items-start">
            <Info className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Nasıl Kullanılır?</p>
              <p>{view === 'calendar' 
                ? 'Etkinlikleri görmek için takvim üzerindeki günlere tıklayabilir, etkinlik detaylarını görmek için ise doğrudan etkinlik kartına tıklayabilirsiniz.' 
                : 'Etkinlikleri tarih sırasına göre görüntüleyebilir ve filtreleyebilirsiniz. Etkinlik detaylarını görmek için etkinlik kartına tıklayabilirsiniz.'}</p>
            </div>
          </div>
                    
          {/* Takvim veya Liste Görünümü */}
          {view === 'calendar' ? (
        <EventCalendar onEventClick={handleEventClick} />
          ) : (
            <div className="bg-white rounded-xl overflow-hidden">
              {/* Liste Görünümü Filtreler */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => setActiveTimeFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTimeFilter === 'all' 
                        ? 'bg-[#d4ff00] text-gray-900' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tüm Etkinlikler
                  </button>
                  <button 
                    onClick={() => setActiveTimeFilter('today')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTimeFilter === 'today' 
                        ? 'bg-[#d4ff00] text-gray-900' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Bugün
                  </button>
                  <button 
                    onClick={() => setActiveTimeFilter('week')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTimeFilter === 'week' 
                        ? 'bg-[#d4ff00] text-gray-900' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Bu Hafta
                  </button>
                  <button 
                    onClick={() => setActiveTimeFilter('month')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTimeFilter === 'month' 
                        ? 'bg-[#d4ff00] text-gray-900' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Bu Ay
                  </button>
                  <button 
                    onClick={() => setActiveTimeFilter('past')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeTimeFilter === 'past' 
                        ? 'bg-[#d4ff00] text-gray-900' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Geçmiş Etkinlikler
                  </button>
                </div>
              </div>
              
              {/* Liste İçeriği */}
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-[#d4ff00] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Etkinlik Bulunamadı</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-4">
                      Seçili filtrelere uygun etkinlik bulunamadı. Lütfen farklı bir filtre seçin veya tüm etkinlikleri görüntüleyin.
                    </p>
                    <button 
                      onClick={() => {
                        setActiveTimeFilter('all');
                        setSelectedCategory(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Tüm Etkinlikleri Göster
                    </button>
                  </div>
                ) : (
                  <div className="p-4">
                    {Object.keys(groupedEvents).map((dateStr, index) => {
                      const dateObj = new Date(`${dateStr.split('-')[0]}-${dateStr.split('-')[1]}-${dateStr.split('-')[2]}`);
                      const events = groupedEvents[dateStr];
                      
                      return (
                        <div key={index} className="mb-8 last:mb-0">
                          {/* Tarih Başlığı */}
                          <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center mr-4 ${
                              isToday(dateObj) ? 'bg-[#d4ff00]' : 'bg-gray-100'
                            }`}>
                              <span className="text-lg font-bold">{dateObj.getDate()}</span>
                              <span className="text-xs uppercase">{
                                dateObj.toLocaleDateString('tr-TR', { month: 'short' })
                              }</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {formatDate(dateStr)}
                                {isToday(dateObj) && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-[#d4ff00] text-gray-900 rounded-full font-medium">
                                    Bugün
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-500">{events.length} etkinlik</p>
                            </div>
                          </div>
                          
                          {/* Etkinlik Listesi */}
                          <div className="space-y-3 pl-16">
                            {events.map((event, eventIndex) => (
                              <div 
                                key={eventIndex}
                                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                                onClick={() => handleEventClick(event)}
                              >
                                <div className="flex flex-col md:flex-row md:items-center">
                                  {/* Sol: Etkinlik Resmi */}
                                  <div className="w-full md:w-32 h-24 md:h-20 overflow-hidden rounded-lg mb-4 md:mb-0 mr-4 relative flex-shrink-0">
                                    <img 
                                      src={event.image_url} 
                                      alt={event.title} 
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center">
                                      <span className="text-white text-xs font-medium mb-2">Detaylar</span>
                                    </div>
                                  </div>
                                  
                                  {/* Orta: Etkinlik Bilgileri */}
                                  <div className="flex-grow">
                                    <h4 className="font-semibold text-gray-900 group-hover:text-[#d4ff00] transition-colors mb-1 line-clamp-1">
                                      {event.title}
                                    </h4>
                                    <div className="text-sm text-gray-500 mb-2 line-clamp-1">{event.description}</div>
                                    <div className="flex flex-wrap gap-3 text-xs">
                                      <div className="flex items-center text-gray-500">
                                        <Clock3 className="w-3.5 h-3.5 mr-1" />
                                        <span>
                                          {new Date(event.start_date).toLocaleTimeString('tr-TR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                      <div className="flex items-center text-gray-500">
                                        <MapPin className="w-3.5 h-3.5 mr-1" />
                                        <span className="line-clamp-1">{event.location}</span>
                                      </div>
                                      <div className="flex items-center text-gray-500">
                                        <Tag className="w-3.5 h-3.5 mr-1" />
                                        <span>{event.category_id}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Sağ: Fiyat ve Butonlar */}
                                  <div className="flex flex-col items-end mt-3 md:mt-0 space-y-2 ml-4">
                                    <span className="font-bold text-[#d4ff00] text-lg">
                                      {Number(event.price) === 0 ? 'Ücretsiz' : `${event.price} TL`}
                                    </span>
                                    <div className="flex space-x-2">
                                      <button className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                                        <CalendarDays className="w-4 h-4 text-gray-600" />
                                      </button>
                                      <button className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                                        <Heart className="w-4 h-4 text-gray-600" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Etkinlik Detay Modalı */}
      <EventDetailModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        event={selectedEvent}
      />
    </div>
  );
};

export default CalendarPage; 