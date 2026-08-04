'use client';

import { supabase } from '@/lib/supabase';
import { Shop, Product, Category, GalleryImage, Review, TimeSlot, Reservation } from '@/lib/types';

export async function fetchShops(category?: string, query?: string): Promise<Shop[]> {
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
}

export async function fetchShopBySlug(slug: string): Promise<Shop | null> {
  const { data, error } = await supabase.from('shops').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data as Shop | null;
}

export async function fetchFeaturedShops(limit = 6): Promise<Shop[]> {
  const { data, error } = await supabase.from('shops').select('*').eq('featured', true).order('rating', { ascending: false }).limit(limit);
  if (error) throw error;
  return (data || []) as Shop[];
}

export async function fetchProductsByShop(shopId: string): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').eq('shop_id', shopId).order('featured', { ascending: false });
  if (error) throw error;
  return (data || []) as Product[];
}

export async function fetchFeaturedProducts(limit = 8): Promise<{ product: Product; shop: Shop }[]> {
  const { data, error } = await supabase.from('products').select('*, shops(*)').eq('featured', true).order('rating', { ascending: false }).limit(limit);
  if (error) throw error;
  return ((data || []) as unknown as Array<Product & { shops: Shop }>).map((p) => ({ product: p, shop: p.shops }));
}

export async function fetchAllProducts(): Promise<{ product: Product; shop: Shop }[]> {
  const { data, error } = await supabase.from('products').select('*, shops(*)').order('created_at', { ascending: false });
  if (error) throw error;
  return ((data || []) as unknown as Array<Product & { shops: Shop }>).map((p) => ({ product: p, shop: p.shops }));
}

export async function fetchCategories(shopCategory?: string): Promise<Category[]> {
  let q = supabase.from('categories').select('*').order('name');
  if (shopCategory) q = q.eq('shop_category', shopCategory);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as Category[];
}

export async function fetchGalleryByShop(shopId: string): Promise<GalleryImage[]> {
  const { data, error } = await supabase.from('gallery_images').select('*').eq('shop_id', shopId).order('sort_order');
  if (error) throw error;
  return (data || []) as GalleryImage[];
}

export async function fetchReviewsByShop(shopId: string): Promise<Review[]> {
  const { data, error } = await supabase.from('reviews').select('*').eq('shop_id', shopId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Review[];
}

export async function fetchTimeSlots(shopId: string): Promise<TimeSlot[]> {
  const { data, error } = await supabase.from('time_slots').select('*').eq('shop_id', shopId).order('start_time');
  if (error) throw error;
  return (data || []) as TimeSlot[];
}

export async function fetchReservationsByDate(shopId: string, date: string): Promise<Reservation[]> {
  const { data, error } = await supabase.from('reservations').select('*').eq('shop_id', shopId).eq('date', date).neq('status', 'cancelled');
  if (error) throw error;
  return (data || []) as Reservation[];
}

export async function createReservation(res: {
  shop_id: string; time_slot_id: string; customer_name: string;
  customer_email: string; customer_phone?: string; date: string; party_size: number; status?: string;
}): Promise<Reservation | null> {
  const { data, error } = await supabase.from('reservations').insert({ ...res, status: res.status || 'confirmed' }).select().maybeSingle();
  if (error) throw error;
  return data as Reservation | null;
}

export async function fetchAllReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase.from('reservations').select('*, shops(*), time_slots(*)').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Reservation[];
}
