// Kategori tipi tanımı
export interface Category {
  name: string;
  iconName: string; // Lucide icon adı
}

// Etkinlik tipi tanımı
export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  platform?: string;
}

// Mekan tipi tanımı
export interface Venue {
  id: number;
  name: string;
  location: string;
  image: string;
}

// Kullanıcı tipi tanımı
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  favorites?: number[];
}

// Auth state tipi
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  showLoginModal: boolean;
  showRegisterModal: boolean;
}

// UI state tipi
export interface UIState {
  currentSlide: number;
  searchPlaceholderIndex: number;
} 