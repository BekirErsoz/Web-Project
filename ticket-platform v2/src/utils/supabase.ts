import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL veya anahtar bilgileri eksik. .env dosyasını kontrol edin.');
  // Uygulama hata vermemesi için varsayılan değerler kullanıyoruz
  // Bu değerler geçersiz olacaktır, ancak uygulama çökmeyecektir
}

// Optimal supabase istemci oluşturma
const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co', // Supabase URL yok ise varsayılan
  supabaseKey || 'public-anon-key', // Supabase Key yok ise varsayılan
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'eventify-web'
      },
    },
    // Bağlantı sorunlarını daha iyi yönetmek için timeout süresini artırma
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Bağlantı durumunu test etmek için fonksiyon
export const testConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('_health_check').select('*').maybeSingle();
    return !error;
  } catch (error) {
    console.error('Supabase bağlantı testi başarısız:', error);
    return false;
  }
};

export default supabase; 