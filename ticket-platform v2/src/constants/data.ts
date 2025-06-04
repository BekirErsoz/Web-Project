import { Category, Event, Venue } from '../types';

export const categories: Category[] = [
  { name: 'Konserler', iconName: 'Music' },
  { name: 'Festivaller', iconName: 'Music' },
  { name: 'Tiyatro', iconName: 'Theater' },
  { name: 'Spor', iconName: 'Football' },
  { name: 'Stand-up', iconName: 'Mic' },
  { name: 'Opera & Bale', iconName: 'Drama' },
  { name: 'Çocuk Etkinlikleri', iconName: 'Baby' },
  { name: 'Seminer & Atölye', iconName: 'GraduationCap' },
];

export const featuredEvents: Event[] = [
  {
    id: 1,
    title: 'Fazıl Say Resitali',
    date: '1 Mart 2025',
    location: 'İş Sanat Kültür Merkezi',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    platform: 'Biletix'
  },
  {
    id: 2,
    title: 'Rock Festivali',
    date: '15 Mart 2025',
    location: 'KüçükÇiftlik Park',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    platform: 'Passo'
  },
  {
    id: 3,
    title: 'Hamlet',
    date: '20 Mart 2025',
    location: 'Zorlu PSM',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    platform: 'Mobilet'
  }
];

export const popularEvents: Event[] = [
  {
    id: 1,
    title: 'Duman Konseri',
    date: '5 Mart 2025',
    location: 'Volkswagen Arena',
    image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    platform: 'Biletix'
  },
  {
    id: 2,
    title: 'Romeo ve Juliet Balesi',
    date: '10 Mart 2025',
    location: 'AKM',
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    platform: 'Passo'
  },
  {
    id: 3,
    title: 'Cem Yılmaz Stand-Up',
    date: '25 Mart 2025',
    location: 'Bostancı Gösteri Merkezi',
    image: 'https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    platform: 'Mobilet'
  }
];

export const popularVenues: Venue[] = [
  {
    id: 1,
    name: 'Volkswagen Arena',
    location: 'Maslak, İstanbul',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    name: 'Zorlu PSM',
    location: 'Levent, İstanbul',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    name: 'Harbiye Açıkhava',
    location: 'Harbiye, İstanbul',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    name: 'İş Sanat',
    location: 'Levent, İstanbul',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
  }
];

export const searchPlaceholders = [
  "Konser ara...",
  "Festival ara...",
  "Tiyatro etkinliği ara...",
  "Spor etkinliği ara...",
  "Stand-up etkinliği ara...",
  "Opera & Bale etkinliği ara...",
  "Çocuk etkinliği ara...",
  "Seminer & Atölye ara..."
]; 