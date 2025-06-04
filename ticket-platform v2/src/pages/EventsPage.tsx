import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, ArrowLeft, 
  Filter, ChevronDown, GridIcon, List, 
  ArrowUpDown, Tag, Clock, 
  AlertCircle
} from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import EventDetailModal from '../components/ui/EventDetailModal';
import { Event } from '../types/supabase';
import { getEvents } from '../api/events';
import FilterSection from '../components/FilterSection';
import EventGridItem from '../components/EventGridItem';
import EventListItem from '../components/EventListItem';
import Pagination from '../components/Pagination';
import CategorySidebar from '../components/layout/CategorySidebar';

// Filtre seçenekleri için tip tanımları
type SortOption = 'latest' | 'oldest' | 'price_low' | 'price_high' | 'name_asc' | 'name_desc';
type ViewMode = 'grid' | 'list';
type PriceRange = 'all' | 'free' | 'paid' | 'below_100' | 'above_100';
type EventDate = 'all' | 'today' | 'tomorrow' | 'this_week' | 'this_weekend' | 'next_week' | 'next_month';

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Filtre durumları
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [eventDate, setEventDate] = useState<EventDate>('all');

  // Sayfalama için
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      try {
        // Tüm etkinlikleri al
        const allEvents = await getEvents();
        setEvents(allEvents);
        applyFilters(allEvents);
      } catch (error) {
        console.error('Etkinlikleri alma hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  // Filtreleri uygula
  useEffect(() => {
    applyFilters(events);
  }, [sortBy, priceRange, eventDate, events]);

  // Sayfalama hesaplamaları
  useEffect(() => {
    setTotalPages(Math.ceil(filteredEvents.length / itemsPerPage));
    setCurrentPage(1); // Filtreler değiştiğinde ilk sayfaya dön
  }, [filteredEvents]);

  // Filtreleri uygula
  const applyFilters = (eventList: Event[]) => {
    let filtered = [...eventList];

    // Fiyat filtresi
    switch (priceRange) {
      case 'free':
        filtered = filtered.filter(event => event.price === 0);
        break;
      case 'paid':
        filtered = filtered.filter(event => event.price > 0);
        break;
      case 'below_100':
        filtered = filtered.filter(event => event.price > 0 && event.price < 100);
        break;
      case 'above_100':
        filtered = filtered.filter(event => event.price >= 100);
        break;
    }

    // Tarih filtresi
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const weekend = new Date(today);
    const daysUntilWeekend = 6 - today.getDay(); // Cumartesi günü için
    weekend.setDate(weekend.getDate() + daysUntilWeekend);

    switch (eventDate) {
      case 'today':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate >= today && eventDate < tomorrow;
        });
        break;
      case 'tomorrow':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 86400000);
        });
        break;
      case 'this_week':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate >= today && eventDate < nextWeek;
        });
        break;
      case 'this_weekend':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_date);
          const weekendEnd = new Date(weekend);
          weekendEnd.setDate(weekendEnd.getDate() + 1);
          return eventDate >= weekend && eventDate < weekendEnd;
        });
        break;
      case 'next_week':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_date);
          const weekAfterNext = new Date(nextWeek);
          weekAfterNext.setDate(weekAfterNext.getDate() + 7);
          return eventDate >= nextWeek && eventDate < weekAfterNext;
        });
        break;
      case 'next_month':
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate >= today && eventDate < nextMonth;
        });
        break;
    }

    // Sıralama
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredEvents(filtered);
  };

  // Etkinlik detayını gösterme
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Arama sonuçlarını işle
  const handleSearch = (results: Event[]) => {
    // Arama yapıldığında SearchResultsPage'e yönlendir
    navigate('/search', { 
      state: { results, searchTerm: '' }
    });
  };

  // Mevcut sayfadaki sonuçları göster
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Arama Çubuğu */}
      <SearchBar onSearchResults={handleSearch} />

      {/* Ana İçerik - Kategori Sidebar ve İçerik yan yana */}
      <div className="flex flex-col lg:flex-row gap-8 mb-14">
        {/* Sol Kategori Sidebar */}
        <div className="lg:w-1/4">
          <CategorySidebar />
        </div>

        {/* Sağ İçerik Alanı */}
        <div className="lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Ana sayfaya dön"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-semibold">
                Tüm Etkinlikler
              </h2>
              <span className="ml-3 bg-[#d4ff00]/20 px-3 py-1 rounded-full text-sm">
                {filteredEvents.length} etkinlik
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Görünüm Seçenekleri */}
              <div className="flex border rounded-lg overflow-hidden">
                <button 
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid görünümü"
                >
                  <GridIcon className="w-5 h-5" />
                </button>
                <button 
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="Liste görünümü"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              {/* Sıralama Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 border rounded-lg px-3 py-2 bg-white"
                  onClick={() => document.getElementById('sort-dropdown')?.classList.toggle('hidden')}
                >
                  <ArrowUpDown className="w-4 h-4 mr-1" />
                  <span>Sırala</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div id="sort-dropdown" className="hidden absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 w-48">
                  <div className="p-2">
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-md ${sortBy === 'latest' ? 'bg-[#d4ff00]/20' : 'hover:bg-gray-100'}`}
                      onClick={() => {setSortBy('latest'); document.getElementById('sort-dropdown')?.classList.add('hidden');}}
                    >
                      En Yeni Etkinlikler
                    </button>
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-md ${sortBy === 'oldest' ? 'bg-[#d4ff00]/20' : 'hover:bg-gray-100'}`}
                      onClick={() => {setSortBy('oldest'); document.getElementById('sort-dropdown')?.classList.add('hidden');}}
                    >
                      En Eski Etkinlikler
                    </button>
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-md ${sortBy === 'price_low' ? 'bg-[#d4ff00]/20' : 'hover:bg-gray-100'}`}
                      onClick={() => {setSortBy('price_low'); document.getElementById('sort-dropdown')?.classList.add('hidden');}}
                    >
                      Fiyat (Artan)
                    </button>
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-md ${sortBy === 'price_high' ? 'bg-[#d4ff00]/20' : 'hover:bg-gray-100'}`}
                      onClick={() => {setSortBy('price_high'); document.getElementById('sort-dropdown')?.classList.add('hidden');}}
                    >
                      Fiyat (Azalan)
                    </button>
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-md ${sortBy === 'name_asc' ? 'bg-[#d4ff00]/20' : 'hover:bg-gray-100'}`}
                      onClick={() => {setSortBy('name_asc'); document.getElementById('sort-dropdown')?.classList.add('hidden');}}
                    >
                      İsim (A-Z)
                    </button>
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-md ${sortBy === 'name_desc' ? 'bg-[#d4ff00]/20' : 'hover:bg-gray-100'}`}
                      onClick={() => {setSortBy('name_desc'); document.getElementById('sort-dropdown')?.classList.add('hidden');}}
                    >
                      İsim (Z-A)
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Filtre Butonu */}
              <button 
                className="flex items-center space-x-1 border rounded-lg px-3 py-2 bg-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-1" />
                <span>Filtrele</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Filtre Paneli */}
          {showFilters && (
            <FilterSection
              priceRange={priceRange}
              setPriceRange={(val: string) => setPriceRange(val as PriceRange)}
              eventDate={eventDate}
              setEventDate={(val: string) => setEventDate(val as EventDate)}
            />
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl h-72 animate-pulse"></div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              {/* Grid veya Liste Görünümü */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {getCurrentPageItems().map((event) => (
                    <EventGridItem
                      key={event.id}
                      event={event}
                      onClick={handleEventClick}
                      onFavoriteClick={() => {/* Favori fonksiyonu buraya */}}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {getCurrentPageItems().map((event) => (
                    <EventListItem
                      key={event.id}
                      event={event}
                      onClick={handleEventClick}
                      onFavoriteClick={() => {/* Favori fonksiyonu buraya */}}
                    />
                  ))}
                </div>
              )}

              {/* Sayfalama */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="bg-white p-10 rounded-xl shadow-sm text-center">
              <div className="mb-6">
                <AlertCircle className="mx-auto w-16 h-16 text-[#d4ff00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Etkinlik bulunamadı</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Gösterilecek etkinlik bulunmamaktadır. Filtreleri temizleyerek tekrar deneyebilirsiniz.
              </p>
              <button 
                onClick={() => {
                  setPriceRange('all');
                  setEventDate('all');
                  setSortBy('latest');
                  // Filtreleri sıfırla
                  applyFilters(events);
                }}
                className="bg-[#d4ff00] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#c4ef00] transition-colors"
              >
                Filtreleri Temizle
              </button>
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

export default EventsPage; 