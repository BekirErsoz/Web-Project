import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, X, ChevronDown, 
  Filter, Sparkles, Clock, LayoutGrid, MapPin
} from 'lucide-react';
import { searchPlaceholders } from '../../constants/data';
import { searchEvents, getUniqueEventCities } from '../../api/events';
import { Event } from '../../types/supabase';

interface SearchBarProps {
  onSearchResults?: (results: Event[]) => void;
  initialSearchTerm?: string;
  initialCityFilter?: string;
  initialDateFilter?: string;
}

// Sabit veriler - önceden tanımlanmış şehirler silinecek ve dinamik olarak yüklenecek
const DATE_FILTERS = [
  { label: 'Tüm Tarihler', value: 'all', icon: <Calendar className="w-4 h-4 mr-2" /> },
  { label: 'Bugün', value: 'today', icon: <Sparkles className="w-4 h-4 mr-2" /> },
  { label: 'Yarın', value: 'tomorrow', icon: <Clock className="w-4 h-4 mr-2" /> },
  { label: 'Bu Hafta', value: 'thisWeek', icon: <LayoutGrid className="w-4 h-4 mr-2" /> },
  { label: 'Bu Ay', value: 'thisMonth', icon: <Calendar className="w-4 h-4 mr-2" /> },
  { label: 'Önümüzdeki 3 Ay', value: 'next3Months', icon: <Calendar className="w-4 h-4 mr-2" /> }
];

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearchResults,
  initialSearchTerm = '',
  initialCityFilter = 'Tüm Şehirler',
  initialDateFilter = 'all'
}) => {
  const navigate = useNavigate();
  const [searchPlaceholderIndex, setSearchPlaceholderIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isSearching, setIsSearching] = useState(false);
  const [autoCompleteResults, setAutoCompleteResults] = useState<Event[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  
  // Filtre durumları
  const [selectedCity, setSelectedCity] = useState(initialCityFilter);
  const initialDateObj = DATE_FILTERS.find(d => d.value === initialDateFilter) || DATE_FILTERS[0];
  const [selectedDate, setSelectedDate] = useState(initialDateObj);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [anyFilterActive, setAnyFilterActive] = useState(false);
  
  // Şehir listesi
  const [cities, setCities] = useState<string[]>(['Tüm Şehirler']);
  const [loadingCities, setLoadingCities] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoCompleteRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  
  // Veritabanından şehir listesini yükle
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);
        const uniqueCities = await getUniqueEventCities();
        setCities(uniqueCities);
      } catch (error) {
        console.error('Şehirler yüklenirken hata:', error);
      } finally {
        setLoadingCities(false);
      }
    };
    
    loadCities();
  }, []);
  
  // Filtrelerin aktif olup olmadığını kontrol et
  useEffect(() => {
    setAnyFilterActive(
      selectedCity !== 'Tüm Şehirler' || 
      selectedDate.value !== 'all'
    );
  }, [selectedCity, selectedDate]);

  // Arama çubuğu placeholder değişimi için effect (2 saniyede bir)
  useEffect(() => {
    const searchIntervalRef = window.setInterval(() => {
      setSearchPlaceholderIndex(prev => 
        prev === searchPlaceholders.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    
    return () => {
      if (searchIntervalRef) {
        clearInterval(searchIntervalRef);
      }
    };
  }, []);

  // Tıklama dışında dropdown'ları kapatmak için event listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Otomatik tamamlama dropdown'ı
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target as Node)) {
        setShowAutoComplete(false);
      }
      
      // Şehir dropdown'ı
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      
      // Tarih dropdown'ı
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setShowDateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Her yazı değişikliğinde otomatik sonuçları ara
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce - yazma durduktan 300ms sonra aramayı yap
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSearching(true);
          // Şehir ve tarih filtrelerini gönder
          const cityFilter = selectedCity !== 'Tüm Şehirler' ? selectedCity : undefined;
          const results = await searchEvents(
            value, 
            cityFilter, 
            selectedDate.value === 'all' ? undefined : selectedDate.value
          );
          setAutoCompleteResults(results.slice(0, 5)); // İlk 5 sonucu göster
          setShowAutoComplete(true);
        } catch (error) {
          console.error('Otomatik tamamlama hatası:', error);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setAutoCompleteResults([]);
      setShowAutoComplete(false);
    }
  };

  // Ana arama işlemi - yeni sayfaya yönlendirir
  const handleMainSearch = async () => {
    try {
      setIsSearching(true);
      // Şehir ve tarih filtrelerini gönder
      const cityFilter = selectedCity !== 'Tüm Şehirler' ? selectedCity : undefined;
      const dateFilter = selectedDate.value === 'all' ? undefined : selectedDate.value;
      
      // Arama terimini URL'de göstermek için kullanıyoruz, boşsa * olarak ayarlıyoruz
      const searchTermForUrl = searchTerm.trim() || '*';
      
      // En az bir filtre seçili olmalı, hepsi boşsa tüm etkinlikleri getir
      const results = await searchEvents(
        searchTerm, 
        cityFilter,
        dateFilter
      );
      
      if (onSearchResults) {
        // Component prop olarak gelen callback'i kullan
        onSearchResults(results);
        setShowAutoComplete(false);
      } else {
        // Veya search sayfasına yönlendir
        const queryParams = new URLSearchParams();
        if (searchTerm.trim()) queryParams.append('q', searchTerm);
        if (cityFilter) queryParams.append('city', cityFilter);
        if (dateFilter) queryParams.append('date', dateFilter);
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        
        navigate(`/search${queryString}`, {
          state: { 
            results, 
            searchTerm,
            cityFilter,
            dateFilter: selectedDate.value
          }
        });
        setShowAutoComplete(false);
      }
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMainSearch();
    }
  };

  // Anlık sonuçlardan bir etkinliğe tıklandığında detay modalını aç
  const handleResultClick = (event: Event) => {
    window.dispatchEvent(new CustomEvent('openEventModal', { detail: event }));
    setShowAutoComplete(false);
  };

  // Arama alanını temizle
  const clearSearch = () => {
    setSearchTerm('');
    setAutoCompleteResults([]);
    setShowAutoComplete(false);
  };

  // Tüm filtreleri temizle
  const clearAllFilters = () => {
    setSelectedCity('Tüm Şehirler');
    setSelectedDate(DATE_FILTERS[0]);
  };

  // Şehir filtresini değiştir
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
    
    // Filtreler değiştiğinde otomatik olarak arama yap
    if (searchTerm.trim() || city !== 'Tüm Şehirler' || selectedDate.value !== 'all') {
      setTimeout(() => {
        handleMainSearch();
      }, 100);
    }
  };

  // Tarih filtresini değiştir
  const handleDateChange = (date: typeof selectedDate) => {
    setSelectedDate(date);
    setShowDateDropdown(false);
    
    // Filtreler değiştiğinde otomatik olarak arama yap
    if (searchTerm.trim() || selectedCity !== 'Tüm Şehirler' || date.value !== 'all') {
      setTimeout(() => {
        handleMainSearch();
      }, 100);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Ana Arama Alanı */}
        <div className="flex w-full items-center rounded-xl">
          <div className="flex-grow relative">
            <input
              type="text"
              className="w-full py-3 px-6 text-lg bg-transparent outline-none text-white placeholder-white/80 font-medium"
              placeholder={searchPlaceholders[searchPlaceholderIndex] || "Etkinlik ara..."}
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
            />
            
            {/* Arama Temizleme Butonu */}
            {searchTerm && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                onClick={clearSearch}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Filtreler */}
          <div className="flex items-center border-l border-white/20 pl-4">
            {/* Şehir Filtresi */}
            <div ref={cityDropdownRef} className="relative">
              <button
                className="flex items-center py-3 px-4 text-white/90 hover:text-white transition-colors"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
              >
                <MapPin className="w-5 h-5 mr-2" />
                <span className={`mr-1 ${selectedCity !== 'Tüm Şehirler' ? 'text-[#d4ff00] font-medium' : ''}`}>
                  {selectedCity}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Şehir Dropdown */}
              {showCityDropdown && (
                <div className="absolute z-30 top-full mt-1 right-0 w-56 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="max-h-80 overflow-y-auto py-2">
                    {loadingCities ? (
                      <div className="flex justify-center items-center p-4">
                        <div className="w-5 h-5 border-2 border-[#d4ff00] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      cities.map((city, index) => (
                        <button
                          key={index}
                          className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors ${
                            selectedCity === city
                              ? 'bg-[#d4ff00]/20 text-gray-900 font-medium'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                          onClick={() => handleCityChange(city)}
                        >
                          {city}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Tarih Filtresi */}
            <div ref={dateDropdownRef} className="relative">
              <button
                className="flex items-center py-3 px-4 text-white/90 hover:text-white transition-colors"
                onClick={() => setShowDateDropdown(!showDateDropdown)}
              >
                <Calendar className="w-5 h-5 mr-2" />
                <span className={`mr-1 ${selectedDate.value !== 'all' ? 'text-[#d4ff00] font-medium' : ''}`}>
                  {selectedDate.label}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Tarih Dropdown */}
              {showDateDropdown && (
                <div className="absolute z-30 top-full mt-1 right-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="py-2">
                    {DATE_FILTERS.map((date, index) => (
                      <button
                        key={index}
                        className={`flex w-full items-center px-4 py-2.5 text-sm text-left transition-colors ${
                          selectedDate.value === date.value
                            ? 'bg-[#d4ff00]/20 text-gray-900 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => handleDateChange(date)}
                      >
                        {date.icon}
                        {date.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Ara Butonu */}
            <button
              className="bg-[#d4ff00] hover:bg-[#c5f000] text-gray-900 font-medium py-3 px-8 rounded-r-xl transition-colors flex items-center"
              onClick={handleMainSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Ara"
              )}
            </button>
          </div>
        </div>
        
        {/* Filtre Temizleme */}
        {anyFilterActive && (
          <div className="absolute -bottom-8 right-4">
            <button
              className="text-xs text-white/80 hover:text-white underline flex items-center"
              onClick={clearAllFilters}
            >
              <X className="w-3 h-3 mr-1" />
              Filtreleri Temizle
            </button>
          </div>
        )}
        
        {/* Otomatik Tamamlama Sonuçları */}
        {showAutoComplete && (
          <div
            ref={autoCompleteRef}
            className="absolute z-40 left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {isSearching ? (
              <div className="flex justify-center items-center p-6">
                <div className="w-6 h-6 border-2 border-[#d4ff00] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : autoCompleteResults.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Sonuç bulunamadı
              </div>
            ) : (
              <div>
                <div className="max-h-96 overflow-y-auto">
                  {autoCompleteResults.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleResultClick(event)}
                    >
                      <div className="flex items-start">
                        <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 mr-3">
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{new Date(event.start_date).toLocaleDateString('tr-TR')}</span>
                            <span className="mx-2">•</span>
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
                  <button
                    className="text-sm text-[#d4ff00] hover:underline font-medium"
                    onClick={handleMainSearch}
                  >
                    Tüm sonuçları göster
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 