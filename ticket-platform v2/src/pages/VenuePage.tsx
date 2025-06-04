import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Clock, ArrowLeft, Filter, 
  AlertCircle, Users, Building, Mail, Phone, 
  RefreshCw, Tag
} from 'lucide-react';
import { Venue, Event } from '../types/supabase';
import { getVenueById, getVenueEvents } from '../api/venues';
import EventDetailModal from '../components/ui/EventDetailModal';

const VenuePage: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Filtreleme seçenekleri için
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [categoryMap, setCategoryMap] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchVenueData = async () => {
      if (!venueId) return;

      try {
        setLoading(true);
        setError(null);

        // Mekan bilgilerini al
        const venueData = await getVenueById(venueId);
        if (venueData) {
          setVenue(venueData);
        } else {
          setError('Mekan bulunamadı');
        }

        // Mekandaki etkinlikleri al
        const venueEvents = await getVenueEvents(venueId);
        setEvents(venueEvents);
        setFilteredEvents(venueEvents);

        // Kategori bilgilerini çekmek için API çağrısı yapabiliriz
        // Şimdilik boş kategori haritası kullanıyoruz
      } catch (err) {
        console.error('Mekan verileri alınırken hata:', err);
        setError('Mekan bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [venueId]);

  const applyFilters = () => {
    let filtered = [...events];

    // Kategoriye göre filtrele
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(event => selectedCategories.includes(event.category_id));
    }

    // Tarihe göre filtrele
    if (startDate) {
      filtered = filtered.filter(event => new Date(event.start_date) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(event => new Date(event.start_date) <= new Date(endDate));
    }

    // Fiyata göre filtrele
    filtered = filtered.filter(event => 
      event.price >= priceRange[0] && event.price <= priceRange[1]
    );

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, startDate, endDate, priceRange]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-12 h-12 border-4 border-[#d4ff00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 p-8 rounded-xl text-center max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-3">{error || 'Mekan bulunamadı'}</h2>
          <p className="text-red-600 mb-6">İstediğiniz mekan bilgilerine şu anda ulaşılamıyor.</p>
          <Link to="/" className="px-6 py-3 bg-[#d4ff00] text-gray-900 rounded-lg font-medium inline-block">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-gray-600 hover:text-[#d4ff00] transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>

      {/* Mekan Başlık */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <img 
          src={venue.image_url} 
          alt={venue.name} 
          className="w-full h-64 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{venue.name}</h1>
          <div className="flex flex-wrap items-center text-white/90 gap-3">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {venue.address}, {venue.city}, {venue.country}
            </span>
            {venue.capacity && (
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {venue.capacity} kişi kapasiteli
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sol Sidebar - Filtreler ve Mekan Bilgileri */}
        <div className="md:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Mekan Bilgileri</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-sm">
                  {venue.description}
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-medium mb-2">İletişim Bilgileri</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Building className="w-4 h-4 mt-1 mr-2 text-gray-500" />
                      <div>
                        <p>{venue.address}</p>
                        <p>{venue.city}, {venue.country}</p>
                      </div>
                    </div>
                    {venue.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`mailto:${venue.email}`} className="hover:text-[#d4ff00]">
                          {venue.email}
                        </a>
                      </div>
                    )}
                    {venue.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <a href={`tel:${venue.phone}`} className="hover:text-[#d4ff00]">
                          {venue.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Filtreler</h2>
                <button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setStartDate('');
                    setEndDate('');
                    setPriceRange([0, 5000]);
                  }}
                  className="text-sm text-[#d4ff00] hover:underline flex items-center"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Temizle
                </button>
              </div>

              {/* Tarih Filtreleme */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Etkinlik Tarihi
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Başlangıç Tarihi</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-lg text-sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Bitiş Tarihi</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-lg text-sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Fiyat Filtreleme */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Fiyat Aralığı
                </h3>
                <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    step="50"
                    className="w-full accent-[#d4ff00]"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 TL</span>
                    <span>{priceRange[1]} TL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ İçerik - Etkinlik Listesi */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">{venue.name} Etkinlikleri</h2>
              <div className="flex items-center text-sm">
                <Filter className="w-4 h-4 mr-1" />
                <span>{filteredEvents.length} etkinlik bulundu</span>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="py-16 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Etkinlik Bulunamadı</h3>
                <p className="text-gray-500">
                  Bu mekanda seçtiğiniz kriterlere uygun etkinlik bulunmamaktadır. 
                  Farklı tarih veya fiyat aralığı seçmeyi deneyebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="border border-gray-100 hover:border-[#d4ff00] rounded-xl p-4 transition-all cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={event.image_url} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {formatDate(event.start_date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-gray-400" />
                            {formatTime(event.start_date)}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {event.location}
                          </div>
                          {categoryMap[event.category_id] && (
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-1 text-gray-400" />
                              {categoryMap[event.category_id]}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {event.description || 'Bu etkinlik için açıklama bulunmamaktadır.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">{event.price} TL</span>
                          <button className="px-4 py-2 bg-[#d4ff00] text-gray-900 rounded-lg text-sm font-medium hover:bg-[#c4ef00] transition-colors">
                            Bilet Al
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Etkinlik Detay Modalı */}
      {showModal && selectedEvent && (
        <EventDetailModal
          isOpen={showModal}
          onClose={closeModal}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default VenuePage; 