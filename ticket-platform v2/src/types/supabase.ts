export type Event = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  location: string;
  start_date: string;
  end_date: string;
  price: number;
  category_id: string;
  venue_id: string;
  created_at: string;
  ticket_url?: string;
  attendees?: number;
  rating?: number;
};

export type Venue = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  email?: string;
  phone?: string;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  popularity?: number;
  created_at?: string;
};

export type User = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  interests?: string[];
  notification_preferences?: {
    email: boolean;
    push: boolean;
  };
  created_at: string;
  updated_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  event_id?: string;
  venue_id?: string;
  created_at: string;
};

export type Ticket = {
  id: string;
  event_id: string;
  user_id: string;
  purchase_date: string;
  quantity: number;
  total_price: number;
  status: 'reserved' | 'purchased' | 'cancelled';
  created_at: string;
}; 