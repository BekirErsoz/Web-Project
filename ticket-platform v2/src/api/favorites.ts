import supabase from '../utils/supabase';
import { Favorite, Event, Venue } from '../types/supabase';

// Tablo adını tekil olarak güncelliyorum
const FAVORITES_TABLE = 'favorite';

/**
 * Kullanıcının tüm favori etkinliklerini getirir
 */
export const getUserFavoriteEvents = async (userId: string): Promise<Event[]> => {
  try {
    // Favori kayıtlarını al, etkinlik bilgileriyle birlikte
    const { data, error } = await supabase
      .from(FAVORITES_TABLE)
      .select(`
        *,
        events:event_id (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Favori etkinlikleri getirirken hata:', error);
      return [];
    }

    // Etkinlikleri düzenlenmiş bir şekilde dön
    return data?.filter(fav => fav.events).map(fav => fav.events) || [];
  } catch (err) {
    console.error('Favori etkinlikleri getirirken beklenmeyen hata:', err);
    return [];
  }
};

/**
 * Kullanıcının tüm favori mekanlarını getirir
 */
export const getUserFavoriteVenues = async (userId: string): Promise<Venue[]> => {
  try {
    // Favori kayıtlarını al, mekan bilgileriyle birlikte
    const { data, error } = await supabase
      .from(FAVORITES_TABLE)
      .select(`
        *,
        venues:venue_id (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Favori mekanları getirirken hata:', error);
      return [];
    }

    // Mekanları düzenlenmiş bir şekilde dön
    return data?.filter(fav => fav.venues).map(fav => fav.venues) || [];
  } catch (err) {
    console.error('Favori mekanları getirirken beklenmeyen hata:', err);
    return [];
  }
};

/**
 * Kullanıcının tüm favori öğelerini getirir (hem etkinlikler hem mekanlar)
 */
export const getUserFavorites = async (userId: string): Promise<Event[]> => {
  try {
    // Geriye uyumluluk için, şimdilik sadece etkinlikleri dönüyoruz
    return await getUserFavoriteEvents(userId);
  } catch (err) {
    console.error('Favorileri getirirken beklenmeyen hata:', err);
    return [];
  }
};

/**
 * Etkinliği kullanıcının favorilerine ekler
 */
export const addEventToFavorites = async (userId: string, eventId: string): Promise<boolean> => {
  try {
    // Önce bu favori zaten var mı kontrol et
    const { data: existingFav, error: checkError } = await supabase
      .from(FAVORITES_TABLE)
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .maybeSingle();

    if (checkError) {
      console.error('Favori kontrolü sırasında hata:', checkError);
      if (checkError.code === '42P01') {
        console.error('Tablo bulunamadı. Veritabanında "favorite" tablosu oluşturulmuş mu kontrol edin.');
      }
      return false;
    }

    // Eğer zaten favorilerdeyse, tekrar ekleme
    if (existingFav) {
      console.log('Bu etkinlik zaten favorilerde');
      return true;
    }

    // Yeni favori ekle - Basitleştirilmiş, sadece gerekli alanlar
    const { data, error } = await supabase
      .from(FAVORITES_TABLE)
      .insert({
        user_id: userId,
        event_id: eventId
      });

    if (error) {
      console.error('Favorilere eklerken hata (tam hata):', JSON.stringify(error));
      if (error.code === '42P01') {
        console.error('Tablo bulunamadı. Veritabanında "favorite" tablosu oluşturulmuş mu kontrol edin.');
      }
      return false;
    }

    console.log('Etkinlik favorilere eklendi:', data);
    return true;
  } catch (err) {
    console.error('Favorilere eklerken beklenmeyen hata:', err);
    return false;
  }
};

/**
 * Mekanı kullanıcının favorilerine ekler
 */
export const addVenueToFavorites = async (userId: string, venueId: string): Promise<boolean> => {
  try {
    // Önce bu favori zaten var mı kontrol et
    const { data: existingFav, error: checkError } = await supabase
      .from(FAVORITES_TABLE)
      .select('id')
      .eq('user_id', userId)
      .eq('venue_id', venueId)
      .maybeSingle();

    if (checkError) {
      console.error('Favori kontrolü sırasında hata:', checkError);
      if (checkError.code === '42P01') {
        console.error('Tablo bulunamadı. Veritabanında "favorite" tablosu oluşturulmuş mu kontrol edin.');
      }
      return false;
    }

    // Eğer zaten favorilerdeyse, tekrar ekleme
    if (existingFav) {
      console.log('Bu mekan zaten favorilerde');
      return true;
    }

    // Yeni favori ekle - Basitleştirilmiş, sadece gerekli alanlar
    const { data, error } = await supabase
      .from(FAVORITES_TABLE)
      .insert({
        user_id: userId,
        venue_id: venueId
      });

    if (error) {
      console.error('Favorilere eklerken hata (tam hata):', JSON.stringify(error));
      if (error.code === '42P01') {
        console.error('Tablo bulunamadı. Veritabanında "favorite" tablosu oluşturulmuş mu kontrol edin.');
      }
      return false;
    }

    console.log('Mekan favorilere eklendi:', data);
    return true;
  } catch (err) {
    console.error('Favorilere eklerken beklenmeyen hata:', err);
    return false;
  }
};

/**
 * Etkinliği kullanıcının favorilerinden kaldırır
 */
export const removeEventFromFavorites = async (userId: string, eventId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(FAVORITES_TABLE)
      .delete()
      .eq('user_id', userId)
      .eq('event_id', eventId);

    if (error) {
      console.error('Favorilerden kaldırırken hata:', error);
      if (error.code === '42P01') {
        console.error('Tablo bulunamadı. Veritabanında "favorite" tablosu oluşturulmuş mu kontrol edin.');
      }
      return false;
    }

    console.log('Etkinlik favorilerden kaldırıldı:', data);
    return true;
  } catch (err) {
    console.error('Favorilerden kaldırırken beklenmeyen hata:', err);
    return false;
  }
};

/**
 * Mekanı kullanıcının favorilerinden kaldırır
 */
export const removeVenueFromFavorites = async (userId: string, venueId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(FAVORITES_TABLE)
      .delete()
      .eq('user_id', userId)
      .eq('venue_id', venueId);

    if (error) {
      console.error('Favorilerden kaldırırken hata:', error);
      if (error.code === '42P01') {
        console.error('Tablo bulunamadı. Veritabanında "favorite" tablosu oluşturulmuş mu kontrol edin.');
      }
      return false;
    }

    console.log('Mekan favorilerden kaldırıldı:', data);
    return true;
  } catch (err) {
    console.error('Favorilerden kaldırırken beklenmeyen hata:', err);
    return false;
  }
};

/**
 * Etkinliğin kullanıcının favorilerinde olup olmadığını kontrol eder
 */
export const isEventFavorited = async (userId: string, eventId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(FAVORITES_TABLE)
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .maybeSingle();

    if (error) {
      console.error('Favori kontrolü sırasında hata:', error);
      if (error.code === '42P01') {
        console.error('Tablo bulunamadı. Veritabanında "favorite" tablosu oluşturulmuş mu kontrol edin.');
      }
      return false;
    }

    return !!data; // Eğer data varsa true, yoksa false döner
  } catch (err) {
    console.error('Favori kontrolü sırasında beklenmeyen hata:', err);
    return false;
  }
};

/**
 * Mekanın kullanıcının favorilerinde olup olmadığını kontrol eder
 */
export const isVenueFavorited = async (userId: string, venueId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(FAVORITES_TABLE)
      .select('id')
      .eq('user_id', userId)
      .eq('venue_id', venueId)
      .maybeSingle();

    if (error) {
      console.error('Favori kontrolü sırasında hata:', error);
      if (error.code === '42P01') {
        console.error('Tablo bulunamadı. Veritabanında "favorite" tablosu oluşturulmuş mu kontrol edin.');
      }
      return false;
    }

    return !!data; // Eğer data varsa true, yoksa false döner
  } catch (err) {
    console.error('Favori kontrolü sırasında beklenmeyen hata:', err);
    return false;
  }
};

// Geriye uyumluluk için eski fonksiyonları koruyalım
export const addToFavorites = addEventToFavorites;
export const removeFromFavorites = removeEventFromFavorites; 