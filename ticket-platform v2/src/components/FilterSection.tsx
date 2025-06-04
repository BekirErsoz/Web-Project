import React from 'react';
import { Tag, Clock } from 'lucide-react';

const DATE_OPTIONS = [
  { label: 'Tümü', value: 'all' },
  { label: 'Bugün', value: 'today' },
  { label: 'Yarın', value: 'tomorrow' },
  { label: 'Bu Hafta', value: 'this_week' },
  { label: 'Gelecek Hafta', value: 'next_week' },
];

interface FilterSectionProps {
  priceRange: string;
  setPriceRange: (val: string) => void;
  eventDate: string;
  setEventDate: (val: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ priceRange, setPriceRange, eventDate, setEventDate }) => (
  <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-2xl mb-6 animate-fadeIn">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Fiyat Filtresi */}
      <div>
        <h3 className="font-medium mb-4 flex items-center text-lg">
          <Tag className="w-5 h-5 mr-2 text-[#d4ff00]" />
          Fiyat Aralığı
        </h3>
        <div className="flex flex-col gap-4">
          <input
            type="range"
            min={0}
            max={500}
            step={10}
            value={priceRange === 'all' ? 500 : priceRange === 'free' ? 0 : priceRange === 'below_100' ? 99 : priceRange === 'above_100' ? 150 : Number(priceRange)}
            onChange={e => {
              const val = Number(e.target.value);
              if (val === 0) setPriceRange('free');
              else if (val < 100) setPriceRange('below_100');
              else if (val >= 100) setPriceRange('above_100');
              else setPriceRange('all');
            }}
            className="w-full accent-[#d4ff00]"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Ücretsiz</span>
            <span>100 TL altı</span>
            <span>100 TL ve üzeri</span>
          </div>
        </div>
      </div>
      {/* Tarih Filtresi */}
      <div>
        <h3 className="font-medium mb-4 flex items-center text-lg">
          <Clock className="w-5 h-5 mr-2 text-[#d4ff00]" />
          Tarih
        </h3>
        <div className="flex gap-2 flex-wrap">
          {DATE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`px-4 py-2 rounded-full border transition-all text-sm font-medium shadow-sm ${eventDate === opt.value ? 'bg-[#d4ff00] text-gray-900 border-[#d4ff00]' : 'bg-white/80 border-gray-200 hover:bg-[#f6ffe0]'}`}
              onClick={() => setEventDate(opt.value)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default FilterSection; 