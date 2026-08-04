import { supabase } from '@/lib/supabase';
import { Shop, Product, Category, GalleryImage, Review, TimeSlot, Reservation } from '@/lib/types';

export async function fetchShops(category?: string, query?: string): Promise<Shop[]> {
  try {
    let q = supabase.from('shops').select('*').order('featured', { ascending: false }).order('rating', { ascending: false });
    if (category && category !== 'all') q = q.eq('category', category);
    const { data, error } = await q;
    if (error) throw error;
    let shops = (data || []) as Shop[];
    if (query) {
      const lower = query.toLowerCase();
      shops = shops.filter((s) =>
        s.name.fa.toLowerCase().includes(lower) || s.name.en.toLowerCase().includes(lower) ||
        s.tagline.fa.toLowerCase().includes(lower) || s.tagline.en.toLowerCase().includes(lower)
      );
    }
    return shops;
  } catch (e) {
    console.error('fetchShops failed:', e);
    return [];
  }
}

export async function fetchShopBySlug(slug: string): Promise<Shop | null> {
  try {
    const { data, error } = await supabase.from('shops').select('*').eq('slug', slug).maybeSingle();
    if (error) throw error;
    return data as Shop | null;
  } catch (e) {
    console.error('fetchShopBySlug failed:', e);
    return null;
  }
}

export async function fetchFeaturedShops(limit = 6): Promise<Shop[]> {
  try {
    const { data, error } = await supabase.from('shops').select('*').eq('featured', true).order('rating', { ascending: false }).limit(limit);
    if (error) throw error;
    return (data || []) as Shop[];
  } catch (e) {
    console.error('fetchFeaturedShops failed:', e);
    return [];
  }
}

export async function fetchProductsByShop(shopId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('shop_id', shopId).order('featured', { ascending: false });
    if (error) throw error;
    return (data || []) as Product[];
  } catch (e) {
    console.error('fetchProductsByShop failed:', e);
    return [];
  }
}

export async function fetchFeaturedProducts(limit = 8): Promise<{ product: Product; shop: Shop }[]> {
  try {
    const { data, error } = await supabase.from('products').select('*, shops(*)').eq('featured', true).order('rating', { ascending: false }).limit(limit);
    if (error) throw error;
    return ((data || []) as unknown as Array<Product & { shops: Shop }>).map((p) => ({ product: p, shop: p.shops }));
  } catch (e) {
    console.error('fetchFeaturedProducts failed:', e);
    return [];
  }
}

export async function fetchAllProducts(): Promise<{ product: Product; shop: Shop }[]> {
  try {
    const { data, error } = await supabase.from('products').select('*, shops(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return ((data || []) as unknown as Array<Product & { shops: Shop }>).map((p) => ({ product: p, shop: p.shops }));
  } catch (e) {
    console.error('fetchAllProducts failed:', e);
    return [];
  }
}

export async function fetchCategories(shopCategory?: string): Promise<Category[]> {
  try {
    let q = supabase.from('categories').select('*').order('name');
    if (shopCategory) q = q.eq('shop_category', shopCategory);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []) as Category[];
  } catch (e) {
    console.error('fetchCategories failed:', e);
    return [];
  }
}

export async function fetchGalleryByShop(shopId: string): Promise<GalleryImage[]> {
  try {
    const { data, error } = await supabase.from('gallery_images').select('*').eq('shop_id', shopId).order('sort_order');
    if (error) throw error;
    return (data || []) as GalleryImage[];
  } catch (e) {
    console.error('fetchGalleryByShop failed:', e);
    return [];
  }
}

export async function fetchReviewsByShop(shopId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase.from('reviews').select('*').eq('shop_id', shopId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Review[];
  } catch (e) {
    console.error('fetchReviewsByShop failed:', e);
    return [];
  }
}

export async function fetchTimeSlots(shopId: string): Promise<TimeSlot[]> {
  try {
    const { data, error } = await supabase.from('time_slots').select('*').eq('shop_id', shopId).order('start_time');
    if (error) throw error;
    return (data || []) as TimeSlot[];
  } catch (e) {
    console.error('fetchTimeSlots failed:', e);
    return [];
  }
}

export async function fetchReservationsByDate(shopId: string, date: string): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase.from('reservations').select('*').eq('shop_id', shopId).eq('date', date).neq('status', 'cancelled');
    if (error) throw error;
    return (data || []) as Reservation[];
  } catch (e) {
    console.error('fetchReservationsByDate failed:', e);
    return [];
  }
}

export async function createReservation(res: {
  shop_id: string; time_slot_id: string; customer_name: string;
  customer_email: string; customer_phone?: string; date: string; party_size: number; status?: string;
}): Promise<Reservation | null> {
  try {
    const { data, error } = await supabase.from('reservations').insert({ ...res, status: res.status || 'confirmed' }).select().maybeSingle();
    if (error) throw error;
    return data as Reservation | null;
  } catch (e) {
    console.error('createReservation failed:', e);
    return null;
  }
}

export async function fetchAllReservations(): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase.from('reservations').select('*, shops(*), time_slots(*)').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as unknown as Reservation[];
  } catch (e) {
    console.error('fetchAllReservations failed:', e);
    return [];
  }
}