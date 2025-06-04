-- Eventify Veritabanı Kurulum ve Veri Girişi SQL Dosyası
-- Bu dosya tüm tabloları oluşturur ve örnek verilerle doldurur

-- TABLO OLUŞTURMA BÖLÜMÜ
-- ==========================================

-- Categories Tablosu (Etkinlik Kategorileri)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Venues Tablosu (Etkinlik Mekanları)
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events Tablosu (Etkinlikler)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  venue_id UUID REFERENCES venues(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kullanıcılar için profile tablosu (auth.users'a ek olarak)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Biletler Tablosu
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('reserved', 'purchased', 'cancelled')) DEFAULT 'reserved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- VERİ GİRİŞİ BÖLÜMÜ
-- ==========================================

-- Mevcut verileri temizle (Kodun çoklu çalışmasında hataları önlemek için)
TRUNCATE categories CASCADE;
TRUNCATE venues CASCADE;

-- Örnek Kategoriler
INSERT INTO categories (name, description, image_url) VALUES
('Konser', 'Canlı müzik performansları ve konserler', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'),
('Festival', 'Müzik, sanat ve kültür festivalleri', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'),
('Tiyatro', 'Tiyatro gösterileri ve sahne sanatları', 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'),
('Workshop', 'Atölye çalışmaları ve eğitimler', 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'),
('Spor', 'Spor müsabakaları ve turnuvalar', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'),
('Gastronomi', 'Yemek festivalleri ve tadım etkinlikleri', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'),
('Sanat', 'Sanat sergileri ve galeriler', 'https://images.unsplash.com/photo-1510012202620-9088c80acf96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80');

-- Örnek Mekanlar
INSERT INTO venues (name, description, image_url, address, city, country, capacity) VALUES
-- Konser mekanları
('Volkswagen Arena', 'Modern konser ve etkinlik alanı', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Maslak Mahallesi, Büyükdere Caddesi No:185', 'İstanbul', 'Türkiye', 5000),
('Zorlu PSM', 'Çok amaçlı sanat merkezi', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Levazım Mahallesi, Koru Sokağı No:2', 'İstanbul', 'Türkiye', 4500),
('IF Performance Hall', 'Canlı müzik ve performans mekanı', 'https://images.unsplash.com/photo-1468359601543-843bfaef291a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Ataşehir Bulvarı No:187', 'İstanbul', 'Türkiye', 1200),

-- Festival mekanları
('Kilyos Plajı', 'Açık hava festival alanı', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Kilyos Sahili', 'İstanbul', 'Türkiye', 10000),
('ODTÜ Vişnelik', 'Geniş festival alanı', 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'ODTÜ Kampüsü', 'Ankara', 'Türkiye', 15000),

-- Tiyatro mekanları
('İstanbul Devlet Tiyatrosu', 'Klasik tiyatro salonu', 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Harbiye Mahallesi', 'İstanbul', 'Türkiye', 800),
('Moda Sahnesi', 'Modern sahne sanatları mekanı', 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Caferağa Mahallesi', 'İstanbul', 'Türkiye', 700),

-- Workshop mekanları
('Salt Galata', 'Çok amaçlı atölye ve sergi alanı', 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Bankalar Caddesi No:11', 'İstanbul', 'Türkiye', 300),
('İmpact Hub', 'İnovasyon ve girişimcilik merkezi', 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Maslak Mahallesi', 'İstanbul', 'Türkiye', 200),

-- Spor mekanları
('Ülker Spor ve Etkinlik Salonu', 'Çok amaçlı spor salonu', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Fenerbahçe Mahallesi', 'İstanbul', 'Türkiye', 12000),
('Ankara Spor Salonu', 'Kapalı spor kompleksi', 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Çankaya', 'Ankara', 'Türkiye', 7500),

-- Gastronomi mekanları
('Michelin Guide İstanbul', 'Gourmet yemek festivali alanı', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Karaköy', 'İstanbul', 'Türkiye', 500),
('Gastronomi Merkezi', 'Yemek kültürü ve tadım alanı', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Gaziantep Kalesi', 'Gaziantep', 'Türkiye', 600),

-- Sanat mekanları
('İstanbul Modern', 'Modern sanat müzesi', 'https://images.unsplash.com/photo-1510012202620-9088c80acf96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Karaköy Rıhtımı', 'İstanbul', 'Türkiye', 900),
('Pera Müzesi', 'Tarihi sanat ve kültür müzesi', 'https://images.unsplash.com/photo-1574182945156-2dab819dd0da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 'Beyoğlu', 'İstanbul', 'Türkiye', 600);

-- Örnek Etkinlikler - Konser Kategorisi
WITH 
  category_id AS (SELECT id FROM categories WHERE name = 'Konser' LIMIT 1)
INSERT INTO events (title, description, image_url, location, start_date, end_date, price, category_id, venue_id)
SELECT 
  'Duman Konseri - ' || ROW_NUMBER() OVER(),
  'Duman grubunun unutulmaz şarkılarıyla muhteşem bir gece sizi bekliyor.',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  'İstanbul, Maslak',
  NOW() + (ROW_NUMBER() OVER() * 10 || ' days')::interval,
  NOW() + (ROW_NUMBER() OVER() * 10 || ' days')::interval + '3 hours'::interval,
  200 + (ROW_NUMBER() OVER() * 10),
  (SELECT id FROM category_id),
  (SELECT id FROM venues ORDER BY RANDOM() LIMIT 1)
FROM generate_series(1, 10);

-- Örnek Etkinlikler - Festival Kategorisi
WITH 
  category_id AS (SELECT id FROM categories WHERE name = 'Festival' LIMIT 1)
INSERT INTO events (title, description, image_url, location, start_date, end_date, price, category_id, venue_id)
SELECT 
  'Müzik Festivali - ' || ROW_NUMBER() OVER(),
  'Türkiye''nin en büyük müzik festivalinde yerli ve yabancı sanatçılar sizi bekliyor.',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  'İstanbul, Kilyos',
  NOW() + (ROW_NUMBER() OVER() * 15 || ' days')::interval,
  NOW() + (ROW_NUMBER() OVER() * 15 || ' days')::interval + '2 days'::interval,
  300 + (ROW_NUMBER() OVER() * 20),
  (SELECT id FROM category_id),
  (SELECT id FROM venues ORDER BY RANDOM() LIMIT 1)
FROM generate_series(1, 10);

-- Örnek Etkinlikler - Tiyatro Kategorisi
WITH 
  category_id AS (SELECT id FROM categories WHERE name = 'Tiyatro' LIMIT 1)
INSERT INTO events (title, description, image_url, location, start_date, end_date, price, category_id, venue_id)
SELECT 
  'Hamlet Gösterisi - ' || ROW_NUMBER() OVER(),
  'Shakespeare''in ölümsüz eseri, modern bir yorumla sahneye taşınıyor.',
  'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  'İstanbul, Beyoğlu',
  NOW() + (ROW_NUMBER() OVER() * 12 || ' days')::interval,
  NOW() + (ROW_NUMBER() OVER() * 12 || ' days')::interval + '3 hours'::interval,
  150 + (ROW_NUMBER() OVER() * 5),
  (SELECT id FROM category_id),
  (SELECT id FROM venues ORDER BY RANDOM() LIMIT 1)
FROM generate_series(1, 10);

-- Örnek Etkinlikler - Workshop Kategorisi
WITH 
  category_id AS (SELECT id FROM categories WHERE name = 'Workshop' LIMIT 1)
INSERT INTO events (title, description, image_url, location, start_date, end_date, price, category_id, venue_id)
SELECT 
  'Yazılım Geliştirme Atölyesi - ' || ROW_NUMBER() OVER(),
  'Modern web teknolojileri ve yazılım geliştirme teknikleri üzerine kapsamlı bir atölye çalışması.',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  'İstanbul, Maslak',
  NOW() + (ROW_NUMBER() OVER() * 8 || ' days')::interval,
  NOW() + (ROW_NUMBER() OVER() * 8 || ' days')::interval + '8 hours'::interval,
  75 + (ROW_NUMBER() OVER() * 10),
  (SELECT id FROM category_id),
  (SELECT id FROM venues ORDER BY RANDOM() LIMIT 1)
FROM generate_series(1, 10);

-- Örnek Etkinlikler - Spor Kategorisi
WITH 
  category_id AS (SELECT id FROM categories WHERE name = 'Spor' LIMIT 1)
INSERT INTO events (title, description, image_url, location, start_date, end_date, price, category_id, venue_id)
SELECT 
  'Basketbol Turnuvası - ' || ROW_NUMBER() OVER(),
  'Türkiye''nin önde gelen basketbol takımlarının karşılaşacağı heyecan dolu turnuva.',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  'İstanbul, Kadıköy',
  NOW() + (ROW_NUMBER() OVER() * 20 || ' days')::interval,
  NOW() + (ROW_NUMBER() OVER() * 20 || ' days')::interval + '5 hours'::interval,
  120 + (ROW_NUMBER() OVER() * 15),
  (SELECT id FROM category_id),
  (SELECT id FROM venues ORDER BY RANDOM() LIMIT 1)
FROM generate_series(1, 10);

-- Örnek Etkinlikler - Gastronomi Kategorisi
WITH 
  category_id AS (SELECT id FROM categories WHERE name = 'Gastronomi' LIMIT 1)
INSERT INTO events (title, description, image_url, location, start_date, end_date, price, category_id, venue_id)
SELECT 
  'Yöresel Lezzetler Festivali - ' || ROW_NUMBER() OVER(),
  'Türkiye''nin dört bir yanından gelen yöresel lezzetleri tadabileceğiniz gastronomi şöleni.',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  'Gaziantep, Merkez',
  NOW() + (ROW_NUMBER() OVER() * 25 || ' days')::interval,
  NOW() + (ROW_NUMBER() OVER() * 25 || ' days')::interval + '2 days'::interval,
  50 + (ROW_NUMBER() OVER() * 5),
  (SELECT id FROM category_id),
  (SELECT id FROM venues ORDER BY RANDOM() LIMIT 1)
FROM generate_series(1, 10);

-- Örnek Etkinlikler - Sanat Kategorisi
WITH 
  category_id AS (SELECT id FROM categories WHERE name = 'Sanat' LIMIT 1)
INSERT INTO events (title, description, image_url, location, start_date, end_date, price, category_id, venue_id)
SELECT 
  'Modern Sanat Sergisi - ' || ROW_NUMBER() OVER(),
  'Çağdaş sanatçıların eserlerinden oluşan özel bir sergi.',
  'https://images.unsplash.com/photo-1510012202620-9088c80acf96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  'İstanbul, Beyoğlu',
  NOW() + (ROW_NUMBER() OVER() * 18 || ' days')::interval,
  NOW() + (ROW_NUMBER() OVER() * 18 || ' days')::interval + '14 days'::interval,
  40 + (ROW_NUMBER() OVER() * 5),
  (SELECT id FROM category_id),
  (SELECT id FROM venues ORDER BY RANDOM() LIMIT 1)
FROM generate_series(1, 10);