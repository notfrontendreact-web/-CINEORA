export type Locale = 'fa' | 'en';

export interface Bilingual {
  fa: string;
  en: string;
}

export interface Shop {
  id: string;
  slug: string;
  name: Bilingual;
  tagline: Bilingual;
  description: Bilingual;
  category: string;
  cover_image: string;
  logo_image: string | null;
  video_url: string | null;
  video_provider: string;
  rating: number;
  review_count: number;
  phone: string | null;
  email: string | null;
  address: Bilingual | null;
  city: Bilingual | null;
  featured: boolean;
  booking_enabled: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: Bilingual;
  icon: string;
  shop_category: string;
}

export interface Product {
  id: string;
  shop_id: string;
  category_id: string | null;
  slug: string;
  name: Bilingual;
  description: Bilingual;
  price: number;
  discount_price: number | null;
  currency: string;
  image: string;
  images: string[] | null;
  stock: number;
  is_digital: boolean;
  digital_file_url: string | null;
  rating: number;
  review_count: number;
  featured: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  shop_id: string;
  image_url: string;
  caption: Bilingual | null;
  sort_order: number;
}

export interface Review {
  id: string;
  shop_id: string;
  author_name: string;
  avatar_url: string | null;
  rating: number;
  comment: Bilingual;
  created_at: string;
}

export interface TimeSlot {
  id: string;
  shop_id: string;
  start_time: string;
  end_time: string;
  capacity: number;
}

export interface Reservation {
  id: string;
  shop_id: string;
  time_slot_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  date: string;
  party_size: number;
  status: string;
  notes: Bilingual | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  shop: Shop;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  shop: Shop;
}
