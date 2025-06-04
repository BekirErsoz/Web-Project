import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Calendar, Users, X, ArrowRight } from 'lucide-react';
import { getPopularVenues, getVenueEvents } from '../../api/venues';
import { Venue, Event } from '../../types/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const PopularVenues: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [venueEvents, setVenueEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);
        const venuesData = await getPopularVenues(8);
        setVenues(venuesData);
      } catch (err) {
        console.error('Popüler mekanlar yüklenirken hata:', err);
        setError('Mekanlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleVenueClick = async (venue: Venue) => {
    setSelectedVenue(venue);
    
    try {
      setEventsLoading(true);
      const events = await getVenueEvents(venue.id);
      setVenueEvents(events);
    } catch (err) {
      console.error('Mekan etkinlikleri yüklenirken hata:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  const closeVenueModal = () => {
    setSelectedVenue(null);
    setVenueEvents([]);
  };

  const navigateToVenuePage = (venueId: string) => {
    navigate(`/venue/${venueId}`);
    closeVenueModal();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  if (loading) {
    return (
      <div className="mb-14">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Popüler Mekanlar</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-14">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Popüler Mekanlar</h2>
        </div>
        <div className="bg-red-50 p-6 rounded-xl text-center">
          <p className="text-red-600 mb-2 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 underline"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-14">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Popüler Mekanlar</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full border hover:border-[#d4ff00] hover:bg-[#d4ff00]/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full border hover:border-[#d4ff00] hover:bg-[#d4ff00]/10 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {venues.map((venue) => (
          <div 
            key={venue.id} 
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border border-transparent hover:border-[#d4ff00] cursor-pointer"
            onClick={() => handleVenueClick(venue)}
          >
            <div className="overflow-hidden">
              <img
                src={venue.image_url}
                alt={venue.name}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-[#d4ff00] transition-colors">{venue.name}</h3>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{venue.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mekan Detay Modalı */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative">
              <img 
                src={selectedVenue.image_url} 
                alt={selectedVenue.name} 
                className="w-full h-64 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <button 
                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                onClick={closeVenueModal}
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedVenue.name}</h2>
                <div className="flex items-center space-x-3 text-white/90">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedVenue.address}, {selectedVenue.city}
                  </span>
                  {selectedVenue.capacity && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {selectedVenue.capacity} kişi kapasiteli
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mekan Bilgileri */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Mekan Hakkında</h3>
              <p className="text-gray-700 mb-6">{selectedVenue.description}</p>
              
              <div className="border-t pt-6 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Bu Mekandaki Etkinlikler</h3>
                  <button 
                    className="text-sm text-[#d4ff00] hover:underline flex items-center"
                    onClick={() => navigateToVenuePage(selectedVenue.id)}
                  >
                    Tüm Etkinlikleri Gör
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                {eventsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-10 h-10 border-4 border-[#d4ff00] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : venueEvents.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Bu mekanda yaklaşan etkinlik bulunmamaktadır.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {venueEvents.slice(0, 4).map((event) => (
                      <div 
                        key={event.id}
                        className="bg-white border rounded-lg p-4 hover:border-[#d4ff00] transition-colors cursor-pointer"
                        onClick={() => navigate(`/event/${event.id}`)}
                      >
                        <h4 className="font-medium mb-2">{event.title}</h4>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(event.start_date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularVenues; 