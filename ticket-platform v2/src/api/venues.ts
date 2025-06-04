import supabase from '../utils/supabase';
import { Venue } from '../types/supabase';
import { saveToCache, getFromCache } from '../utils/cache';

const CACHE_KEYS = {
  POPULAR_VENUES: 'venues_popular',
  VENUE_EVENTS: 'venue_events_'
};

/**
 * Popüler mekanları getirir
 */
export const getPopularVenues = async (limit: number = 6): Promise<Venue[]> => {
  try {
    // Önce önbellekten kontrol et
    const { data: cachedVenues, expired } = getFromCache<Venue[]>(CACHE_KEYS.POPULAR_VENUES);
    if (cachedVenues && !expired) {
      return cachedVenues.slice(0, limit);
    }

    // Veritabanından al
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('id')
      .limit(limit);

    if (error) {
      console.error('Popüler mekanları getirme hatası:', error);
      return [];
    }

    // Önbelleğe kaydet
    if (data && data.length > 0) {
      saveToCache(CACHE_KEYS.POPULAR_VENUES, data);
    }

    return data || [];
  } catch (err) {
    console.error('Popüler mekanları getirirken beklenmeyen hata:', err);
    return [];
  }
};

/**
 * Belirli bir mekanın etkinliklerini getirir
 */
export const getVenueEvents = async (venueId: string): Promise<any[]> => {
  try {
    const cacheKey = `${CACHE_KEYS.VENUE_EVENTS}${venueId}`;
    
    // Önce önbellekten kontrol et
    const { data: cachedEvents, expired } = getFromCache<any[]>(cacheKey);
    if (cachedEvents && !expired) {
      return cachedEvents;
    }

    // Veritabanından al
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('venue_id', venueId);

    if (error) {
      console.error(`Mekan ID ${venueId} için etkinlikleri getirme hatası:`, error);
      return [];
    }

    // Önbelleğe kaydet
    if (data && data.length > 0) {
      saveToCache(cacheKey, data);
    }

    return data || [];
  } catch (err) {
    console.error('Mekan etkinlikleri alınırken beklenmeyen hata:', err);
    return [];
  }
};

/**
 * Mekan bilgilerini getirir
 */
export const getVenueById = async (venueId: string): Promise<Venue | null> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .single();
    
    if (error) {
      console.error(`Mekan ID ${venueId} için bilgileri getirme hatası:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Mekan bilgileri alınırken beklenmeyen hata:', err);
    return null;
  }
}; 