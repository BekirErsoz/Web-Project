import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Ticket, Info, Share, Heart, ArrowUpRight, ChevronRight, Users, Star, AlertCircle } from 'lucide-react';
import { Event, Venue } from '../../types/supabase';
import supabase from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { addToFavorites, removeFromFavorites, isEventFavorited } from '../../api/favorites';
import { toast } from 'react-hot-toast';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ isOpen, onClose, event }) => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (event?.venue_id) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('id', event.venue_id)
            .single();
          
          if (error) throw error;
          
          setVenue(data);
        } catch (error) {
          console.error('Mekan bilgileri alınırken hata:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen && event) {
      fetchVenueDetails();
    }
  }, [isOpen, event]);

  useEffect(() => {
    // Kullanıcı giriş yapmış ve etkinlik var ise, favori durumunu kontrol et
    const checkFavoriteStatus = async () => {
      if (user && event) {
        try {
          setFavoritesLoading(true);
          const favorited = await isEventFavorited(user.id, event.id);
          setIsFavorited(favorited);
        } catch (error) {
          console.error('Favori durumu kontrol edilirken hata:', error);
        } finally {
          setFavoritesLoading(false);
        }
      }
    };

    if (isOpen && event) {
      checkFavoriteStatus();
    }
  }, [isOpen, event, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error('Favorilere eklemek için giriş yapmalısınız');
      return;
    }

    if (!event) return;

    try {
      setFavoritesLoading(true);
      
      if (isFavorited) {
        // Favorilerden kaldır
        console.log('Etkinlik favorilerden kaldırılıyor:', event.id);
        const success = await removeFromFavorites(user.id, event.id);
        if (success) {
          setIsFavorited(false);
          toast.success('Etkinlik favorilerden kaldırıldı');
        } else {
          toast.error('Etkinlik favorilerden kaldırılamadı. Lütfen daha sonra tekrar deneyin.');
          console.error('Etkinlik favorilerden kaldırılamadı:', event.id);
        }
      } else {
        // Favorilere ekle
        console.log('Etkinlik favorilere ekleniyor:', event.id);
        const success = await addToFavorites(user.id, event.id);
        if (success) {
          setIsFavorited(true);
          toast.success('Etkinlik favorilere eklendi');
        } else {
          toast.error('Etkinlik favorilere eklenemedi. Lütfen daha sonra tekrar deneyin.');
          console.error('Etkinlik favorilere eklenemedi:', event.id);
        }
      }
    } catch (error) {
      console.error('Favori durumu değiştirilirken beklenmeyen hata:', error);
      toast.error('Bir hata oluştu, lütfen tekrar deneyin');
    } finally {
      setFavoritesLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString('tr-TR', options);
  };

  // Satın alma sayfasına yönlendirme
  const navigateToPurchase = () => {
    // Burada dış siteye yönlendirme yapılabilir
    window.open(event.ticket_url || 'https://www.example.com/tickets', '_blank');
    toast.success('Bilet satış sayfasına yönlendiriliyorsunuz');
  };

  // Paylaş fonksiyonu
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: `https://eventify.com/event/${event.id}`,
      })
      .then(() => toast.success('Etkinlik paylaşıldı'))
      .catch((error) => console.error('Paylaşım hatası:', error));
    } else {
      // Web Share API desteklenmiyorsa
      navigator.clipboard.writeText(`https://eventify.com/event/${event.id}`)
        .then(() => toast.success('Etkinlik bağlantısı kopyalandı'))
        .catch(() => toast.error('Kopyalama başarısız oldu'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto">
      <div 
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-auto animate-fadeIn shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-80">
          <img 
            src={event.image_url} 
            alt={event.title} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Kapat Butonu */}
          <button 
            className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full hover:bg-white transition-colors shadow-md z-10"
            onClick={onClose}
          >
            <X size={20} className="text-gray-800" />
          </button>
          
          {/* Etkinlik Kategorisi Badge */}
          <div className="absolute top-4 left-4 bg-[#d4ff00] text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
            {event.category_id || 'Etkinlik'}
          </div>
          
          {/* İçerik */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{event.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-1.5" />
                {formatDate(event.start_date)}
              </span>
              <span className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1.5" />
                {formatTime(event.start_date)}
              </span>
              <span className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-1.5" />
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sol Kolon - Etkinlik Detayları */}
            <div className="md:w-7/12 space-y-8">
              {/* Fiyat ve Bilet Alma */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Bilet Fiyatı</p>
                  <p className="text-3xl font-bold text-[#d4ff00]">
                    {Number(event.price) === 0 ? 'Ücretsiz' : `${event.price} TL`}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={handleShare}
                    aria-label="Etkinliği paylaş"
                  >
                    <Share className="w-5 h-5 text-gray-700" />
                  </button>
                  
                  <button 
                    className={`p-2.5 rounded-full transition-all ${
                      isFavorited 
                        ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-red-500'
                    } ${favoritesLoading ? 'opacity-50 cursor-wait' : ''}`}
                    onClick={handleFavoriteToggle}
                    disabled={favoritesLoading}
                    aria-label={isFavorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500' : ''}`} />
                  </button>
                  
                  <button 
                    className="bg-[#d4ff00] hover:bg-[#c4ef00] text-gray-900 py-2 px-4 rounded-xl font-medium transition-colors flex items-center gap-1.5"
                    onClick={navigateToPurchase}
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Bilet Al</span>
                  </button>
                </div>
              </div>
              
              {/* Etkinlik Açıklaması */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-[#d4ff00]" />
                  Etkinlik Açıklaması
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {event.description ? (
                    <p>{event.description}</p>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-500 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Bu etkinlik için henüz açıklama eklenmemiştir.</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mekan Bilgileri */}
              {venue && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#d4ff00]" />
                    Mekan Bilgileri
                  </h3>
                  <div className="bg-[#d4ff00]/5 p-5 rounded-xl border border-[#d4ff00]/20 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      {venue.image_url && (
                        <img 
                          src={venue.image_url} 
                          alt={venue.name} 
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1 text-gray-800">{venue.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{venue.address}, {venue.city}</p>
                        
                        {venue.capacity && (
                          <div className="flex items-center text-gray-500 text-sm">
                            <Users className="w-4 h-4 mr-1.5" />
                            <span>Kapasite: {venue.capacity} kişi</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sağ Kolon - Yan Bilgiler */}
            <div className="md:w-5/12">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#d4ff00]" />
                  Etkinlik Detayları
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-[#d4ff00]/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Calendar className="w-5 h-5 text-[#d4ff00]" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">Tarih</h4>
                      <p className="text-gray-600">{formatDate(event.start_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-[#d4ff00]/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Clock className="w-5 h-5 text-[#d4ff00]" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">Saat</h4>
                      <p className="text-gray-600">{formatTime(event.start_date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-[#d4ff00]/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="w-5 h-5 text-[#d4ff00]" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">Konum</h4>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  
                  {event.attendees && (
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-[#d4ff00]/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Users className="w-5 h-5 text-[#d4ff00]" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-800">Katılımcılar</h4>
                        <p className="text-gray-600">{event.attendees} kişi</p>
                      </div>
                    </div>
                  )}
                  
                  {event.rating && (
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-[#d4ff00]/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Star className="w-5 h-5 text-[#d4ff00]" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-800">Değerlendirme</h4>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < event.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">{event.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Bilet Alma Butonu */}
                <button 
                  onClick={navigateToPurchase}
                  className="w-full bg-[#d4ff00] text-gray-900 py-3 rounded-xl font-semibold hover:bg-[#c4ef00] transition-colors mt-6 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Hemen Bilet Al</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Favori Ekleme Butonu */}
                <button 
                  onClick={handleFavoriteToggle}
                  disabled={favoritesLoading}
                  className={`w-full mt-3 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                    isFavorited 
                      ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500' : ''}`} />
                  <span>{isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal; 