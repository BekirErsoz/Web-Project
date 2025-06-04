import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, ArrowLeft, 
  Filter, ChevronDown, GridIcon, List, 
  ArrowUpDown, Tag, Clock, 
  AlertCircle
} from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import EventDetailModal from '../components/ui/EventDetailModal';
import { Event } from '../types/supabase';
import { searchEvents } from '../api/events';

interface LocationState {
  results?: Event[];
  searchTerm?: string;
}

// Filtre seçenekleri için tip tanımları
type SortOption = 'latest' | 'oldest' | 'price_low' | 'price_high' | 'name_asc' | 'name_desc';
type ViewMode = 'grid' | 'list';
type PriceRange = 'all' | 'free' | 'paid' | 'below_100' | 'above_100';
type EventDate = 'all' | 'today' | 'tomorrow' | 'this_week' | 'this_weekend' | 'next_week' | 'next_month';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [filteredResults, setFilteredResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Filtre durumları
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [eventDate, setEventDate] = useState<EventDate>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // URL'den sorgu parametresini al
  const queryParams = new URLSearchParams(location.search);
  const searchTermFromUrl = queryParams.get('q') || '';
  const [currentSearchTerm, setCurrentSearchTerm] = useState(
    searchTermFromUrl || (state?.searchTerm || '')
  );

  // Sayfalama için
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Eğer state ile sonuçlar geldiyse, onları göster
    if (state?.results && state.results.length > 0) {
      setSearchResults(state.results);
      applyFilters(state.results);
      return;
    }

    // URL'den gelen arama terimini kullan
    if (searchTermFromUrl) {
      performSearch(searchTermFromUrl);
    }
  }, [state, searchTermFromUrl]);

  // Filtreleri uygula
  useEffect(() => {
    applyFilters(searchResults);
  }, [sortBy, priceRange, eventDate, selectedCategories]);

  // Sayfalama hesaplamaları
  useEffect(() => {
    setTotalPages(Math.ceil(filteredResults.length / itemsPerPage));
    setCurrentPage(1); // Filtreler değiştiğinde ilk sayfaya dön
  }, [filteredResults]);

  // Filtreleri uygula
  const applyFilters = (results: Event[]) => {
    let filtered = [...results];

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

    // Kategoriye göre filtreleme
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(event => selectedCategories.includes(event.category_id));
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

    setFilteredResults(filtered);
  };

  // Arama işlemini gerçekleştir
  const performSearch = async (term: string) => {
    if (!term.trim()) return;

    try {
      setLoading(true);
      const results = await searchEvents(term);
      setSearchResults(results);
      applyFilters(results);
      
      // URL'yi güncelle (sayfa yenilemeden)
      navigate(`/search?q=${encodeURIComponent(term)}`, { 
        replace: true,
        state: { results, searchTerm: term }
      });
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Yeni arama
  const handleSearch = (results: Event[]) => {
    setSearchResults(results);
    applyFilters(results);
    
    // URL'yi güncelle
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    const term = searchInput?.value || '';
    setCurrentSearchTerm(term);
    navigate(`/search?q=${encodeURIComponent(term)}`, { 
      replace: true,
      state: { results, searchTerm: term }
    });
  };

  // Etkinlik detayını gösterme
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Mevcut sayfadaki sonuçları göster
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredResults.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Arama Çubuğu */}
      <SearchBar onSearchResults={handleSearch} />

      {/* Ana İçerik */}
      <div className="mb-14">
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
              {currentSearchTerm ? `"${currentSearchTerm}" için Arama Sonuçları` : 'Arama Sonuçları'}
            </h2>
            <span className="ml-3 bg-[#d4ff00]/20 px-3 py-1 rounded-full text-sm">
              {filteredResults.length} sonuç
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
          <div className="bg-white p-4 rounded-lg border mb-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Fiyat Filtresi */}
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Fiyat
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      value="all" 
                      checked={priceRange === 'all'} 
                      onChange={() => setPriceRange('all')} 
                      className="mr-2"
                    />
                    Tümü
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      value="free" 
                      checked={priceRange === 'free'} 
                      onChange={() => setPriceRange('free')} 
                      className="mr-2"
                    />
                    Ücretsiz
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      value="below_100" 
                      checked={priceRange === 'below_100'} 
                      onChange={() => setPriceRange('below_100')} 
                      className="mr-2"
                    />
                    100 TL altı
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="price" 
                      value="above_100" 
                      checked={priceRange === 'above_100'} 
                      onChange={() => setPriceRange('above_100')} 
                      className="mr-2"
                    />
                    100 TL ve üzeri
                  </label>
                </div>
              </div>

              {/* Tarih Filtresi */}
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Tarih
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="date" 
                      value="all" 
                      checked={eventDate === 'all'} 
                      onChange={() => setEventDate('all')} 
                      className="mr-2"
                    />
                    Tümü
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="date" 
                      value="today" 
                      checked={eventDate === 'today'} 
                      onChange={() => setEventDate('today')} 
                      className="mr-2"
                    />
                    Bugün
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="date" 
                      value="tomorrow" 
                      checked={eventDate === 'tomorrow'} 
                      onChange={() => setEventDate('tomorrow')} 
                      className="mr-2"
                    />
                    Yarın
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="date" 
                      value="this_week" 
                      checked={eventDate === 'this_week'} 
                      onChange={() => setEventDate('this_week')} 
                      className="mr-2"
                    />
                    Bu Hafta
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="date" 
                      value="next_week" 
                      checked={eventDate === 'next_week'} 
                      onChange={() => setEventDate('next_week')} 
                      className="mr-2"
                    />
                    Gelecek Hafta
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl h-72 animate-pulse"></div>
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <>
            {/* Grid veya Liste Görünümü */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {getCurrentPageItems().map((event) => (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border border-transparent hover:border-[#d4ff00] cursor-pointer"
                    onClick={() => handleEventClick(event)}
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
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {getCurrentPageItems().map((event) => (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[#d4ff00] cursor-pointer flex flex-col md:flex-row gap-4"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="w-full md:w-48 h-48 md:h-32 relative rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
                ))}
              </div>
            )}

            {/* Sayfalama */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button 
                    className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border hover:border-[#d4ff00]'}`}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Önceki
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // 5'ten fazla sayfa varsa, mevcut sayfayı ortada göster
                    let pageNum = currentPage;
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <button 
                          key={i} 
                          className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-[#d4ff00] text-gray-900 font-bold' : 'bg-white border hover:border-[#d4ff00]'}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button 
                    className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border hover:border-[#d4ff00]'}`}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center">
            <div className="mb-6">
              <AlertCircle className="mx-auto w-16 h-16 text-[#d4ff00]" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Arama sonucu bulunamadı</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              "{currentSearchTerm}" için arama sonucu bulunamadı. Farklı anahtar kelimeler kullanarak tekrar deneyebilir veya filtreleri temizleyebilirsiniz.
            </p>
            <button 
              onClick={() => {
                setPriceRange('all');
                setEventDate('all');
                setSelectedCategories([]);
                setSortBy('latest');
                // Aramayı yeniden çalıştır
                if (searchResults.length > 0) {
                  applyFilters(searchResults);
                }
              }}
              className="bg-[#d4ff00] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#c4ef00] transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
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

export default SearchResultsPage; 