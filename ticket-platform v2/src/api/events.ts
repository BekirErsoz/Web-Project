import supabase from '../utils/supabase';
import { Event } from '../types/supabase';

const EVENTS_TABLE = 'events';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 saat (milisaniye)

// Önbellek anahtarları
const CACHE_KEYS = {
  ALL_EVENTS: 'events_all',
  FEATURED_EVENTS: 'events_featured',
  POPULAR_EVENTS: 'events_popular'
};

// Önbellekten veri al
const getFromCache = <T>(key: string): { data: T | null; expired: boolean } => {
  const cached = localStorage.getItem(key);
  if (!cached) return { data: null, expired: true };
  
  try {
    const { data, timestamp } = JSON.parse(cached);
    const expired = Date.now() - timestamp > CACHE_EXPIRY;
    return { data, expired };
  } catch (err) {
    console.error('Önbellek verisi çözümlenirken hata:', err);
    return { data: null, expired: true };
  }
};

// Veriyi önbelleğe yaz
const saveToCache = <T>(key: string, data: T): void => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (err) {
    console.error('Veriler önbelleğe kaydedilirken hata:', err);
  }
};

export const getEvents = async (): Promise<Event[]> => {
  // Önce önbellekten okuma dene
  const { data: cachedEvents, expired } = getFromCache<Event[]>(CACHE_KEYS.ALL_EVENTS);
  
  // Eğer önbellekte taze veri varsa, onu döndür
  if (cachedEvents && !expired) {
    return cachedEvents;
  }

  try {
    // Taze veri çek
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*');

    if (error) {
      console.error('Etkinlikler alınırken hata oluştu:', error);
      // Eğer herhangi bir önbellek verisi varsa, tarihi geçmiş olsa bile kullan
      return cachedEvents || [];
    }

    // Yeni verileri önbelleğe kaydet
    const events = data || [];
    saveToCache(CACHE_KEYS.ALL_EVENTS, events);
    
    return events;
  } catch (err) {
    console.error('Etkinlikler alınırken beklenmeyen hata:', err);
    // Hata durumunda önbellekteki verilere geri dön
    return cachedEvents || [];
  }
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`ID'si ${id} olan etkinlik alınırken hata oluştu:`, error);
      
      // Tüm etkinlikleri önbellekten al ve ID'ye göre filtrele
      const { data: cachedEvents } = getFromCache<Event[]>(CACHE_KEYS.ALL_EVENTS);
      if (cachedEvents) {
        const cachedEvent = cachedEvents.find(event => event.id === id);
        if (cachedEvent) return cachedEvent;
      }
      
      return null;
    }

    return data;
  } catch (err) {
    console.error(`Etkinlik alınırken beklenmeyen hata:`, err);
    return null;
  }
};

export const getFeaturedEvents = async (limit: number = 5): Promise<Event[]> => {
  // Önce önbellekten okuma dene
  const { data: cachedEvents, expired } = getFromCache<Event[]>(CACHE_KEYS.FEATURED_EVENTS);
  
  // Eğer önbellekte taze veri varsa, onu döndür
  if (cachedEvents && !expired) {
    return cachedEvents.slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Öne çıkan etkinlikler alınırken hata oluştu:', error);
      // RLS hatası olabilir - mevcut önbellek verilerine dön
      return cachedEvents || [];
    }

    const events = data || [];
    
    // Boş veri kontrolü
    if (events.length === 0) {
      // Önbellekte veri varsa, tarihli de olsa kullan
      if (cachedEvents) {
        return cachedEvents.slice(0, limit);
      }
      // Hiç önbellek verisi yoksa boş dizi döndür
      return [];
    }
    
    // Yeni verileri önbelleğe kaydet
    saveToCache(CACHE_KEYS.FEATURED_EVENTS, events);
    
    return events;
  } catch (err) {
    console.error('Öne çıkan etkinlikler alınırken beklenmeyen hata:', err);
    return cachedEvents || [];
  }
};

export const getEventsByCategory = async (categoryId: string): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .eq('category_id', categoryId)
      .order('start_date', { ascending: false });
    
    if (error) {
      console.error(`Kategori ID ${categoryId} için etkinlikleri getirme hatası:`, error);
      
      // Tüm etkinlikleri önbellekten al ve kategoriye göre filtrele
      const { data: cachedEvents } = getFromCache<Event[]>(CACHE_KEYS.ALL_EVENTS);
      if (cachedEvents) {
        return cachedEvents.filter(event => event.category_id === categoryId);
      }
      
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Kategori etkinlikleri alınırken beklenmeyen hata:', err);
    return [];
  }
};

export const getPopularEvents = async (limit: number = 6): Promise<Event[]> => {
  // Önce önbellekten okuma dene
  const { data: cachedEvents, expired } = getFromCache<Event[]>(CACHE_KEYS.POPULAR_EVENTS);
  
  // Eğer önbellekte taze veri varsa, onu döndür
  if (cachedEvents && !expired) {
    return cachedEvents.slice(0, limit);
  }

  try {
    // Tüm kategorileri al
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id');
      
    if (categoryError) {
      console.error('Kategoriler alınırken hata oluştu:', categoryError);
      // RLS hatası olabilir - mevcut önbellek verilerine dön
      return cachedEvents || [];
    }

    if (!categories || categories.length === 0) {
      console.warn('Hiç kategori bulunamadı');
      return cachedEvents || [];
    }

    // Her kategoriden rastgele etkinlikler seçmek için kaç etkinlik alınacağını hesapla
    const eventsPerCategory = Math.ceil(limit / categories.length);
    
    // Her kategoriden rastgele etkinlikleri getirmek için sorgu oluştur
    const promises = categories.map(category => 
      supabase
        .from(EVENTS_TABLE)
        .select('*')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false })
        .limit(eventsPerCategory)
    );

    // Tüm sorguları paralel olarak çalıştır
    const results = await Promise.all(promises);
    
    // Hata kontrolü
    let hasError = false;
    for (const result of results) {
      if (result.error) {
        console.error('Popüler etkinlikler alınırken hata oluştu:', result.error);
        hasError = true;
        break;
      }
    }

    if (hasError) {
      // RLS hatası olabilir - mevcut önbellek verilerine dön
      return cachedEvents || [];
    }

    // Tüm sonuçları birleştir ve karıştır
    const allEvents = results
      .flatMap(result => result.data || [])
      .sort(() => Math.random() - 0.5); // Karıştır
    
    // Eğer hiç etkinlik yoksa ve önbellekte varsa, önbellekteki verileri döndür
    if (allEvents.length === 0) {
      return cachedEvents || [];
    }
    
    // Yeni verileri önbelleğe kaydet
    saveToCache(CACHE_KEYS.POPULAR_EVENTS, allEvents);
    
    return allEvents.slice(0, limit); // Limit uygula
  } catch (err) {
    console.error('Popüler etkinlikler alınırken beklenmeyen hata:', err);
    return cachedEvents || [];
  }
};

export const searchEvents = async (
  query: string, 
  city?: string, 
  dateFilter?: string,
  limit: number = 20
): Promise<Event[]> => {
  if (!query || query.trim() === '') {
    // Arama terimi yoksa filtreleri kullan veya popüler etkinlikleri göster
    if (city || dateFilter) {
      return filterEvents([], city, dateFilter, limit);
    }
    return getPopularEvents(limit);
  }

  try {
    const searchTermLower = query.toLowerCase().trim();

    // Etkinlikleri ara - başlık, açıklama ve lokasyonda
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('*')
      .or(`title.ilike.%${searchTermLower}%, description.ilike.%${searchTermLower}%, location.ilike.%${searchTermLower}%`)
      .limit(limit * 2); // Filtreleme sonrası azalabilir, bu yüzden daha fazla çekelim

    if (error) {
      console.error('Etkinlikler aranırken hata oluştu:', error);
      
      // Tüm etkinlikleri önbellekten al ve manuel olarak ara
      const { data: cachedEvents } = getFromCache<Event[]>(CACHE_KEYS.ALL_EVENTS);
      if (cachedEvents) {
        const filteredEvents = cachedEvents.filter(event => 
          event.title.toLowerCase().includes(searchTermLower) || 
          event.description.toLowerCase().includes(searchTermLower) || 
          event.location.toLowerCase().includes(searchTermLower)
        );
        return filterEvents(filteredEvents, city, dateFilter, limit);
      }
      
      return [];
    }

    // Sonuçları alakasına göre sırala (başlıkta geçenler önce)
    const sortedResults = data?.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      
      // Başlıkta arama terimi geçenler önce gösterilsin
      const termInTitleA = titleA.includes(searchTermLower);
      const termInTitleB = titleB.includes(searchTermLower);
      
      if (termInTitleA && !termInTitleB) return -1;
      if (!termInTitleA && termInTitleB) return 1;
      
      // Başlık alfabetik sıralama
      return titleA.localeCompare(titleB);
    });

    // Şehir ve tarih filtrelerini uygula
    return filterEvents(sortedResults || [], city, dateFilter, limit);
  } catch (err) {
    console.error('Arama sırasında beklenmeyen hata:', err);
    return [];
  }
};

export const getUniqueEventCities = async (): Promise<string[]> => {
  try {
    // Önce önbellekten almayı dene
    const cacheKey = 'events_cities';
    const { data: cachedCities, expired } = getFromCache<string[]>(cacheKey);
    
    if (cachedCities && !expired) {
      return cachedCities;
    }
    
    // Tüm etkinlikleri al
    const { data, error } = await supabase
      .from(EVENTS_TABLE)
      .select('location');
      
    if (error) {
      console.error('Şehir bilgileri alınırken hata oluştu:', error);
      return cachedCities || [];
    }
    
    if (!data || data.length === 0) {
      return cachedCities || [];
    }
    
    // Etkili şehir adlarını çıkar ve benzersizleştir
    const allCities = data
      .map(event => {
        // Lokasyon genellikle "Şehir, Yer" formatında olduğundan şehir adını ayıkla
        const locationParts = event.location.split(',');
        // Eğer virgül varsa ilk parçayı al, yoksa tam lokasyonu al
        return locationParts.length > 1 
          ? locationParts[0].trim() 
          : event.location.trim();
      })
      .filter(Boolean) // Boş değerleri filtrele
      .sort(); // Alfabetik sırala
    
    // Benzersiz şehir listesi oluştur
    const uniqueCities = ['Tüm Şehirler', ...new Set(allCities)];
    
    // Önbelleğe kaydet
    saveToCache(cacheKey, uniqueCities);
    
    return uniqueCities;
  } catch (err) {
    console.error('Şehir listesi alınırken beklenmeyen hata:', err);
    return ['Tüm Şehirler'];
  }
};

// Şehir ve tarihe göre etkinlikleri filtrele
const filterEvents = (events: Event[], city?: string, dateFilter?: string, limit: number = 20): Promise<Event[]> => {
  let filteredEvents = [...events];
  
  // Şehir filtreleme
  if (city && city !== 'Tüm Şehirler') {
    filteredEvents = filteredEvents.filter(event => {
      // Etkinliğin lokasyonunu parçalarına ayır (genellikle "Şehir, Yer" formatında)
      const locationParts = event.location.split(',');
      const eventCity = locationParts.length > 1 
        ? locationParts[0].trim().toLowerCase()
        : event.location.trim().toLowerCase();
      
      // Şehir adı tam eşleşmesi için
      return eventCity === city.toLowerCase() ||
        // Kısmi eşleşme için (örn: "İstanbul" ile "İstanbul Avrupa" eşleşir)
        eventCity.includes(city.toLowerCase()) ||
        // Tam tersi durumlar için (örn: "Kadıköy" ile "İstanbul, Kadıköy" eşleşir)
        city.toLowerCase().includes(eventCity);
    });
  }
  
  // Tarih filtreleme
  if (dateFilter && dateFilter !== 'all') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const nextThreeMonths = new Date(today);
    nextThreeMonths.setMonth(nextThreeMonths.getMonth() + 3);
    
    switch (dateFilter) {
      case 'today':
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate >= today && eventDate < tomorrow;
        });
        break;
      case 'tomorrow':
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 86400000);
        });
        break;
      case 'thisWeek':
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate >= today && eventDate < nextWeek;
        });
        break;
      case 'thisMonth':
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate >= today && eventDate < nextMonth;
        });
        break;
      case 'next3Months':
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate >= today && eventDate < nextThreeMonths;
        });
        break;
    }
  }
  
  return Promise.resolve(filteredEvents.slice(0, limit));
}; 