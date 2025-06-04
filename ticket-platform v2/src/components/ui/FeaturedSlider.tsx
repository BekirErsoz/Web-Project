import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../../types/supabase';
import { getFeaturedEvents } from '../../api/events';

const FeaturedSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sliderIntervalRef = useRef<number | null>(null);

  // Verileri Supabase'den alma
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const featuredEvents = await getFeaturedEvents(5);
        setEvents(featuredEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Etkinlikler yüklenirken bir hata oluştu');
        console.error('Öne çıkan etkinlikler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Slider otomatik değişim için effect (7 saniyede bir)
  useEffect(() => {
    if (events.length === 0) return;

    sliderIntervalRef.current = window.setInterval(() => {
      setCurrentSlide(prev => (prev === events.length - 1 ? 0 : prev + 1));
    }, 7000);
    
    return () => {
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
      }
    };
  }, [events.length]);

  // Slider kontrolü ile geçiş yapma ve interval'i resetleme
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    
    // Otomatik değişimi sıfırla
    if (sliderIntervalRef.current) {
      clearInterval(sliderIntervalRef.current);
      sliderIntervalRef.current = window.setInterval(() => {
        setCurrentSlide(prev => (prev === events.length - 1 ? 0 : prev + 1));
      }, 7000);
    }
  };

  // Önceki slide'a geçme
  const goToPrevSlide = () => {
    if (events.length === 0) return;
    goToSlide(currentSlide === 0 ? events.length - 1 : currentSlide - 1);
  };

  // Sonraki slide'a geçme
  const goToNextSlide = () => {
    if (events.length === 0) return;
    goToSlide(currentSlide === events.length - 1 ? 0 : currentSlide + 1);
  };

  if (loading) {
    return (
      <div className="rounded-xl shadow-lg bg-gray-100 h-[450px] flex items-center justify-center mb-14">
        <p className="text-lg text-gray-500">Etkinlikler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl shadow-lg bg-red-50 h-[450px] flex items-center justify-center mb-14">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl shadow-lg bg-gray-100 h-[450px] flex items-center justify-center mb-14">
        <p className="text-lg text-gray-500">Henüz öne çıkan etkinlik bulunmuyor</p>
      </div>
    );
  }

  return (
    <div className="relative mb-14 w-full">
      <div className="overflow-hidden rounded-xl shadow-lg">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="w-full flex-shrink-0 relative cursor-pointer"
              onClick={() => window.dispatchEvent(new CustomEvent('openEventModal', { detail: event }))}
            >
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
                <h3 className="text-white text-3xl font-bold mb-2">{event.title}</h3>
                <div className="flex items-center text-white space-x-4">
                  <span>{new Date(event.start_date).toLocaleDateString('tr-TR')}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
                <div className="mt-2">
                  <span className="text-white font-bold">{event.price} TL</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-[#d4ff00]/90 transition-colors"
        aria-label="Önceki etkinlik"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-[#d4ff00]/90 transition-colors"
        aria-label="Sonraki etkinlik"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-[#d4ff00]' : 'bg-white/50'
            }`}
            aria-label={`${index + 1}. etkinliğe git`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider; 