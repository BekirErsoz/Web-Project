import supabase from '../utils/supabase';
import { Category } from '../types/supabase';

const CATEGORIES_TABLE = 'categories';

// Örnek kategoriler - yalnızca tablo boşsa kullanılacak
const DEFAULT_CATEGORIES = [
  { 
    name: 'Konser', 
    icon: 'music', 
    description: 'Canlı müzik etkinlikleri ve konserler'
  },
  { 
    name: 'Tiyatro', 
    icon: 'theater', 
    description: 'Tiyatro oyunları ve sahne performansları'
  },
  { 
    name: 'Festival', 
    icon: 'calendar-days', 
    description: 'Müzik, sanat ve kültür festivalleri'
  },
  { 
    name: 'Workshop', 
    icon: 'pen-tool', 
    description: 'Atölyeler ve eğitim etkinlikleri'
  },
  { 
    name: 'Spor', 
    icon: 'dumbbell', 
    description: 'Spor müsabakaları ve fitness etkinlikleri'
  },
  { 
    name: 'Gastronomi', 
    icon: 'utensils', 
    description: 'Yemek ve içecek etkinlikleri'
  },
  { 
    name: 'Sanat', 
    icon: 'paint-bucket', 
    description: 'Sanat sergileri ve görsel sanatlar'
  }
];

// Kategori tablosunu kontrol et ve gerekirse örnek verilerle doldur
export const initCategories = async (): Promise<void> => {
  console.log('initCategories fonksiyonu çağrıldı - kategoriler kontrol ediliyor...');
  
  try {
    // Önce mevcut kategorileri kontrol et
    const { data: existingCategories, error: checkError } = await supabase
      .from(CATEGORIES_TABLE)
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Kategori tablosunu kontrol ederken hata:', checkError);
      throw checkError;
    }
    
    // Eğer kategori yoksa, varsayılan kategorileri ekle
    if (!existingCategories || existingCategories.length === 0) {
      console.log('Kategori tablosunda veri bulunamadı, varsayılan kategoriler ekleniyor...');
      
      const { data, error } = await supabase
        .from(CATEGORIES_TABLE)
        .insert(DEFAULT_CATEGORIES)
        .select();
      
      if (error) {
        console.error('Varsayılan kategorileri eklerken hata:', error);
        throw error;
      }
      
      console.log(`${data?.length || 0} adet varsayılan kategori başarıyla eklendi.`);
    } else {
      console.log('Kategori tablosunda mevcut veri bulundu, işlem yapılmadı.');
    }
  } catch (err) {
    console.error('initCategories sırasında beklenmeyen hata:', err);
    throw err;
  }
};

// Geliştirilmiş getCategories fonksiyonu - daha güvenilir veri getirme
export const getCategories = async (): Promise<Category[]> => {
  console.log('getCategories fonksiyonu çağrıldı - tüm kategorileri getiriyorum');
  
  try {
    // Bağlantıyı test et
    const { error: healthCheckError } = await supabase.from('_health_check').select('*').maybeSingle();
    
    if (healthCheckError) {
      console.error('Supabase bağlantı testi başarısız:', healthCheckError);
      // Bağlantı hatası olsa da devam ediyoruz, belki asıl sorgu çalışır
    } else {
      console.log('Supabase bağlantı testi başarılı');
    }

    // Tüm kategorileri getir - id'ye göre sıralı olarak
    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Kategorileri getirme hatası:', error);
      throw error;
    }

    // Eğer hiç kategori yoksa, varsayılan kategorileri ekle ve sonra tekrar getir
    if (!data || data.length === 0) {
      console.log('Hiç kategori bulunamadı, varsayılan kategorileri ekliyorum...');
      
      // Varsayılan kategorileri doğrudan ekle
      const { error: insertError } = await supabase
        .from(CATEGORIES_TABLE)
        .insert(DEFAULT_CATEGORIES);
      
      if (insertError) {
        console.error('Varsayılan kategorileri eklerken hata:', insertError);
        return [];
      }
      
      // Ekleme başarılıysa, tüm kategorileri tekrar getir
      const { data: refreshedData, error: refreshError } = await supabase
        .from(CATEGORIES_TABLE)
        .select('*')
        .order('id', { ascending: true });
      
      if (refreshError) {
        console.error('Yenilenen kategorileri getirme hatası:', refreshError);
        return [];
      }
      
      console.log(`Toplam ${refreshedData?.length || 0} yeni kategori başarıyla eklendi ve getirildi`);
      return refreshedData || [];
    }

    console.log(`Toplam ${data.length} kategori başarıyla getirildi`);
    return data;
  } catch (err) {
    console.error('Kategorileri getirirken beklenmeyen hata:', err);
    
    // Hata durumunda yine de varsayılan kategorileri döndür
    try {
      console.log('Hata sonrası varsayılan kategorileri döndürüyorum');
      return DEFAULT_CATEGORIES.map((cat, index) => ({
        ...cat,
        id: `temp_${index + 1}`, // Geçici id'ler
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) as Category[];
    } catch (fallbackErr) {
      console.error('Varsayılan kategorileri döndürürken hata:', fallbackErr);
    return [];
    }
  }
};

export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) {
      console.error(`${categoryId} ID'li kategoriyi getirme hatası:`, error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Beklenmeyen hata:', err);
    return null;
  }
}; 