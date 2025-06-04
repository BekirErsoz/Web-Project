import React, { useState, useEffect } from 'react';
import { getUserFavoriteEvents, getUserFavoriteVenues, removeEventFromFavorites, removeVenueFromFavorites } from '../api/favorites';
import { useAuth } from '../contexts/AuthContext';
import { Event, Venue } from '../types/supabase';
import { Heart, AlertCircle, ChevronLeft, ChevronRight, MapPin, X, Calendar, Tag, ArrowRight, Search, Trash2 } from 'lucide-react';
import EventCard from '../components/ui/EventCard';
import EventDetailModal from '../components/ui/EventDetailModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const FavoritesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [favoriteVenues, setFavoriteVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sayfalama değişkenleri
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Bir sayfada gösterilecek etkinlik sayısı
  const [activeTab, setActiveTab] = useState<'events' | 'venues'>('events');

  // Favorileri getirme fonksiyonu
  const fetchFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Etkinlikleri ve mekanları paralel olarak çek
      const [events, venues] = await Promise.all([
        getUserFavoriteEvents(user.id),
        getUserFavoriteVenues(user.id)
      ]);
      
      setFavoriteEvents(events);
      setFavoriteVenues(venues);
    } catch (err: any) {
      console.error('Favorileri getirirken hata:', err);
      setError('Favori etkinlikleriniz yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Auth durumu değiştiğinde favorileri getir
  useEffect(() => {
    // Auth yüklemesi tamamlandıysa ve kullanıcı varsa favorileri getir
    if (!authLoading && user) {
      fetchFavorites();
    } else if (!authLoading && !user) {
      // Auth yüklemesi tamamlandı ve kullanıcı yoksa loading durumunu kapat
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };
  
  const handleVenueClick = (venueId: string) => {
    navigate(`/venue/${venueId}`);
  };
  
  // Favorilerden etkinlik çıkarma fonksiyonu
  const handleRemoveFromFavorites = async (itemId: string, type: 'events' | 'venues') => {
    if (!user) return;
    
    try {
      let success = false;
      
      if (type === 'events') {
        success = await removeEventFromFavorites(user.id, itemId);
        if (success) {
          // State'i güncelle - etkinliği listeden kaldır
          setFavoriteEvents(prevEvents => prevEvents.filter(event => event.id !== itemId));
          toast.success('Etkinlik favorilerden kaldırıldı', { position: 'bottom-right' });
        }
      } else {
        success = await removeVenueFromFavorites(user.id, itemId);
        if (success) {
          // State'i güncelle - mekanı listeden kaldır
          setFavoriteVenues(prevVenues => prevVenues.filter(venue => venue.id !== itemId));
          toast.success('Mekan favorilerden kaldırıldı', { position: 'bottom-right' });
        }
      }
      
      if (!success) {
        toast.error('Favorilerden kaldırılırken bir hata oluştu', { position: 'bottom-right' });
      }
    } catch (error) {
      console.error('Favorilerden kaldırırken hata:', error);
      toast.error('Bir sorun oluştu', { position: 'bottom-right' });
    }
  };

  // Tab değiştiğinde sayfayı sıfırla
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm('');
  }, [activeTab]);
  
  // Arama fonksiyonu
  const filterItems = (items: Event[] | Venue[]) => {
    if (!searchTerm) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter((item) => {
      if (activeTab === 'events') {
        const event = item as Event;
        return event.title.toLowerCase().includes(term) || 
               event.category.toLowerCase().includes(term) ||
               event.venue_name.toLowerCase().includes(term);
      } else {
        const venue = item as Venue;
        return venue.name.toLowerCase().includes(term) || 
               venue.city.toLowerCase().includes(term) ||
               (venue.description && venue.description.toLowerCase().includes(term));
      }
    });
  };
  
  // Filtrelenmiş öğeleri al
  const filteredItems = activeTab === 'events' 
    ? filterItems(favoriteEvents) as Event[]
    : filterItems(favoriteVenues) as Venue[];
  
  // Sayfalama için gerekli hesaplamalar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Sayfa değiştirme fonksiyonları
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Sayfalama bileşeni
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-10 space-x-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`w-10 h-10 rounded-lg ${
              currentPage === page
                ? 'bg-[#d4ff00] text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };
  
  // Özel EventCard bileşeni - Favorilerden çıkarma butonu ile
  const FavoriteEventCard = ({ event }: { event: Event }) => {
    return (
      <div className="relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-[#d4ff00]">
        <div 
          className="cursor-pointer"
          onClick={() => handleEventClick(event)}
        >
          <div className="relative">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4 w-full">
                <span className="text-white text-sm font-medium backdrop-blur-sm bg-white/20 rounded-full px-3 py-1 inline-block">
                  İncele
                </span>
              </div>
            </div>
            <div className="absolute top-0 left-0 p-2">
              <span className="bg-[#d4ff00] text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                {event.category}
              </span>
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-[#d4ff00] transition-colors">
              {event.title}
            </h3>
            
            <div className="flex flex-col space-y-2 mb-3 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>{new Date(event.start_date).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="line-clamp-1">{event.venue_name}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <span className="font-semibold text-[#d4ff00]">
                {Number(event.price) === 0 ? 'Ücretsiz' : `${event.price} TL`}
              </span>
              <button 
                className="text-red-500 flex items-center text-xs hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromFavorites(event.id, 'events');
                }}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Kaldır
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Mekan kartı bileşeni - Favorilerden çıkarma butonu ile
  const VenueCard = ({ venue }: { venue: Venue }) => {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-[#d4ff00] group">
        <div 
          className="cursor-pointer"
          onClick={() => handleVenueClick(venue.id)}
        >
          <div className="relative">
            <img
              src={venue.image_url}
              alt={venue.name}
              className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4 w-full">
                <span className="text-white text-sm font-medium backdrop-blur-sm bg-white/20 rounded-full px-3 py-1 inline-block">
                  Keşfet
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-[#d4ff00] transition-colors">
                {venue.name}
              </h3>
              <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                Mekan
              </span>
            </div>
            
            <div className="flex items-center text-gray-600 space-x-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{venue.city}</span>
            </div>
            
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
              {venue.description}
            </p>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <button className="flex items-center text-xs text-[#d4ff00] font-medium group-hover:underline">
                <ArrowRight className="w-3.5 h-3.5 mr-1" />
                Mekanı İncele
              </button>
              <button 
                className="text-red-500 flex items-center text-xs hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromFavorites(venue.id, 'venues');
                }}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Kaldır
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Yükleme durumu
  if (authLoading || loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center mb-8">
              <Heart className="w-8 h-8 text-[#d4ff00] mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Favorilerim</h1>
            </div>
            
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-[#d4ff00] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Giriş Yapmanız Gerekiyor</h2>
            <p className="text-gray-600 mb-8">Favori etkinlik ve mekanlarınızı görmek için lütfen giriş yapın veya bir hesap oluşturun.</p>
            <div className="flex space-x-4 justify-center">
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ana Sayfaya Dön
              </button>
              <button 
                onClick={onLogin}
                className="px-6 py-3 bg-[#d4ff00] text-gray-900 rounded-lg font-medium hover:bg-[#c4ef00] transition-colors"
              >
                Giriş Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasNoContent = favoriteEvents.length === 0 && favoriteVenues.length === 0;
  const hasNoCurrentTabContent = activeTab === 'events' ? favoriteEvents.length === 0 : favoriteVenues.length === 0;
  const hasNoFilteredContent = filteredItems.length === 0 && searchTerm !== '';

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Heart className="w-10 h-10 text-[#d4ff00] mr-3" />
            <h1 className="text-4xl font-bold">Favorilerim</h1>
          </div>
          <p className="text-gray-300 ml-14">Kaydettiğiniz tüm etkinlik ve mekanları burada bulabilirsiniz.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          ) : hasNoContent ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Henüz Favoriniz Yok</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Etkinlikleri ve mekanları favorilere ekleyerek burada görebilirsiniz.</p>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#d4ff00] text-gray-900 rounded-lg font-medium hover:bg-[#c4ef00] transition-colors"
              >
                Etkinliklere Göz At
              </button>
            </div>
          ) : (
            <>
              {/* Tab Başlıkları ve Arama */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <div className="flex border-b mb-2 md:mb-0 w-full md:w-auto">
                  <button
                    className={`py-3 px-6 font-medium relative ${
                      activeTab === 'events' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('events')}
                  >
                    Etkinlikler ({favoriteEvents.length})
                    {activeTab === 'events' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4ff00]"></span>
                    )}
                  </button>
                  <button
                    className={`py-3 px-6 font-medium relative ${
                      activeTab === 'venues' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('venues')}
                  >
                    Mekanlar ({favoriteVenues.length})
                    {activeTab === 'venues' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4ff00]"></span>
                    )}
                  </button>
                </div>
                
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder={activeTab === 'events' ? 'Etkinlik ara...' : 'Mekan ara...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4ff00] focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* İçerik yoksa mesaj göster */}
              {hasNoCurrentTabContent ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-gray-300" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    {activeTab === 'events' ? 'Favori Etkinliğiniz' : 'Favori Mekanınız'} Yok
                  </h2>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {activeTab === 'events' 
                      ? 'Etkinlikleri favorilere ekleyerek burada görebilirsiniz.'
                      : 'Mekanları favorilere ekleyerek burada görebilirsiniz.'
                    }
                  </p>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-[#d4ff00] text-gray-900 rounded-lg font-medium hover:bg-[#c4ef00] transition-colors"
                  >
                    Ana Sayfaya Dön
                  </button>
                </div>
              ) : hasNoFilteredContent ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Arama Sonucu Bulunamadı
                  </h2>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    "{searchTerm}" için hiçbir sonuç bulunamadı. Lütfen farklı bir arama terimi deneyin.
                  </p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Aramayı Temizle
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeTab === 'events' 
                      ? currentPageItems.map((event) => (
                          <FavoriteEventCard 
                            key={event.id}
                            event={event as Event}
                          />
                        ))
                      : currentPageItems.map((venue) => (
                          <VenueCard 
                            key={venue.id}
                            venue={venue as Venue}
                          />
                        ))
                    }
                  </div>
                  
                  {/* Sayfalama */}
                  {renderPagination()}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Etkinlik Detay Modalı */}
      <EventDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        event={selectedEvent}
      />
    </div>
  );
};

export default FavoritesPage; 