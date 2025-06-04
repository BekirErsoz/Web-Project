import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Music, Theater, PenTool, Dumbbell, CalendarDays, 
  Utensils, PaintBucket, AlertCircle, LayoutGrid
} from 'lucide-react';
import { getCategories } from '../../api/categories';
import { Category } from '../../types/supabase';

// Kategori adına göre icon eşleştirme
const getCategoryIcon = (categoryName: string, iconValue?: string) => {
  // Eğer icon değeri varsa, ona göre eşleştir
  if (iconValue) {
    switch (iconValue.toLowerCase()) {
      case 'music': return Music;
      case 'theater': return Theater;
      case 'calendar-days': return CalendarDays;
      case 'pen-tool': return PenTool;
      case 'dumbbell': return Dumbbell;
      case 'utensils': return Utensils;
      case 'paint-bucket': return PaintBucket;
      default: break;
    }
  }
  
  // İsim bazlı eşleştirme yap
  const name = categoryName.toLowerCase();
  
  if (name.includes('konser')) return Music;
  if (name.includes('tiyatro')) return Theater;
  if (name.includes('festival')) return CalendarDays;
  if (name.includes('workshop')) return PenTool;
  if (name.includes('spor')) return Dumbbell;
  if (name.includes('gastronomi')) return Utensils;
  if (name.includes('sanat')) return PaintBucket;
  
  // Varsayılan icon
  return Music;
};

const CategorySidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Kategorileri getir
  const fetchCategories = useCallback(async () => {
    try {
      console.log('Kategoriler yükleniyor...', { retryAttempt: retryCount });
      setLoading(true);
      setError(null);
      
      const categoriesData = await getCategories();
      console.log('Çekilen kategoriler:', categoriesData);
      
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
        setRetryCount(0); // Başarılı olduğunda retry sayacını sıfırla
      } else {
        throw new Error('Kategoriler yüklenemedi veya boş veri döndü');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kategoriler yüklenirken bir hata oluştu';
      setError(errorMessage);
      console.error('Kategoriler yüklenirken detaylı hata:', err);
      
      // Otomatik tekrar dene - maksimum 3 kez
      if (retryCount < 3) {
        console.log(`Kategori yükleme başarısız. ${retryCount + 1}. deneme yapılacak...`);
        setRetryCount(prevCount => prevCount + 1);
        setTimeout(() => {
          fetchCategories();
        }, 3000); // 3 saniye bekle ve tekrar dene
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  // Sayfa yüklendiğinde kategorileri getir
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Kategori tıklama
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  // Tüm etkinlikler
  const handleAllEventsClick = () => {
    navigate('/events');
  };

  // Geçerli URL'ye göre aktif sayfayı belirleme
  const isAllEventsActive = location.pathname === '/events';

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-white rounded-xl p-8 shadow-md sticky top-8 border-2 border-[#d4ff00]">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Kategoriler</h2>
        </div>
        
        {loading ? (
          <div className="flex flex-col space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="h-6 bg-gray-200 rounded w-36"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 rounded-lg text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 font-medium mb-1">Kategoriler yüklenemedi</p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-6 bg-yellow-50 rounded-lg text-center">
            <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
            <p className="text-gray-700 font-medium mb-4">Henüz kategori bulunmuyor.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <button
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                isAllEventsActive 
                  ? 'bg-[#d4ff00] text-gray-900 font-medium' 
                  : 'hover:bg-[#d4ff00]/10 text-lg hover:text-gray-900'
              } transition-colors text-lg`}
              onClick={handleAllEventsClick}
            >
              <LayoutGrid className={`w-6 h-6 ${isAllEventsActive ? 'text-gray-900' : 'text-[#d4ff00]'} font-bold`} strokeWidth={2.5} />
              <span>Tüm Etkinlikler</span>
            </button>

            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name, category.icon);
              const isActive = location.pathname === `/category/${category.id}`;
              
              return (
                <button
                  key={category.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg ${
                    isActive 
                      ? 'bg-[#d4ff00] text-gray-900 font-medium' 
                      : 'hover:bg-[#d4ff00]/10 text-lg hover:text-gray-900'
                  } transition-colors text-lg`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <IconComponent className={`w-6 h-6 ${isActive ? 'text-gray-900' : 'text-[#d4ff00]'}`} strokeWidth={2.5} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySidebar; 