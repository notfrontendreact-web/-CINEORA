'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { Shop, Product, GalleryImage, Review, Category } from '@/lib/types';
import { fetchShopBySlug, fetchProductsByShop, fetchGalleryByShop, fetchReviewsByShop, fetchCategories } from '@/lib/queries';
import { getBilingual } from '@/lib/i18n';
import { ProductCard } from '@/components/cinematic/ProductCard';
import { VideoPlayer } from '@/components/cinematic/VideoPlayer';
import { ReservationSystem } from '@/components/cinematic/ReservationSystem';
import { Particles } from '@/components/cinematic/Particles';
import { Star, MapPin, Phone, Mail, ArrowRight, ArrowLeft, Image as ImageIcon, Package, Calendar, MessageSquare, Play, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ShopDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, locale, dir } = useLocale();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'gallery' | 'video' | 'reviews' | 'booking' | 'contact'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    (async () => {
      try {
        const s = await fetchShopBySlug(slug);
        if (!s) { notFound(); return; }
        setShop(s);
        const [p, g, r, c] = await Promise.all([fetchProductsByShop(s.id), fetchGalleryByShop(s.id), fetchReviewsByShop(s.id), fetchCategories(s.category)]);
        setProducts(p); setGallery(g); setReviews(r); setCategories(c);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, [slug]);

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const tabs = [
    { id: 'products' as const, label: t('products'), icon: Package },
    { id: 'gallery' as const, label: t('gallery'), icon: ImageIcon },
    { id: 'video' as const, label: t('introVideo'), icon: Play },
    { id: 'reviews' as const, label: t('reviews'), icon: MessageSquare },
    { id: 'booking' as const, label: t('bookAppointment'), icon: Calendar },
    { id: 'contact' as const, label: t('contactInfo'), icon: Mail },
  ];
  const productCategories = categories.filter((c) => products.some((p) => p.category_id === c.id));
  const filteredProducts = selectedCategory === 'all' ? products : products.filter((p) => { const cat = categories.find((c) => c.id === p.category_id); return cat?.slug === selectedCategory; });

  if (loading) return <div className="min-h-screen"><div className="h-96 shimmer" /><div className="container mx-auto px-4 py-10"><div className="h-12 w-64 shimmer rounded-lg mb-6" /><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-72 rounded-2xl glass shimmer" />)}</div></div></div>;
  if (!shop) return null;

  return (
    <div className="relative min-h-screen">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shop.cover_image} alt={getBilingual(shop.name, locale)} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <Particles count={25} />
        <div className="absolute top-6 left-6 rtl:left-auto rtl:right-6 z-10">
          <Link href="/shops" className="flex items-center gap-2 px-4 py-2 rounded-lg glass-strong text-sm font-medium hover:glow-primary transition-all"><Arrow className="w-4 h-4" /> {t('backToShops')}</Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-strong text-sm"><Star className="w-4 h-4 fill-gold text-gold" /><span className="font-bold">{shop.rating}</span><span className="text-xs text-muted-foreground">({shop.review_count} {t('reviewsCount')})</span></div>
                {shop.featured && <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-gold to-amber-500 text-black text-xs font-bold">{t('featured')}</span>}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-2"><span className="cinema-gradient-text">{getBilingual(shop.name, locale)}</span></h1>
              <p className="text-lg text-white/80">{getBilingual(shop.tagline, locale)}</p>
              {shop.city && <div className="flex items-center gap-1.5 text-sm text-white/60 mt-2"><MapPin className="w-4 h-4" /> {getBilingual(shop.city, locale)}</div>}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="glass rounded-2xl p-6 cinema-border"><p className="text-muted-foreground leading-relaxed">{getBilingual(shop.description, locale)}</p></div>
      </section>

      <section className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative', activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
              <Icon className="w-4 h-4" />{tab.label}
              {activeTab === tab.id && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />}
            </button>;
          })}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pb-20">
          {activeTab === 'products' && (
            <div>
              {productCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <button onClick={() => setSelectedCategory('all')} className={cn('px-4 py-2 rounded-full text-sm font-medium transition-all', selectedCategory === 'all' ? 'bg-gradient-to-r from-primary to-accent text-white' : 'glass hover:bg-secondary/80')}>{t('allCategories')}</button>
                  {productCategories.map((cat) => <button key={cat.id} onClick={() => setSelectedCategory(cat.slug)} className={cn('px-4 py-2 rounded-full text-sm font-medium transition-all', selectedCategory === cat.slug ? 'bg-gradient-to-r from-primary to-accent text-white' : 'glass hover:bg-secondary/80')}>{getBilingual(cat.name, locale)}</button>)}
                </div>
              )}
              {filteredProducts.length === 0 ? <div className="text-center py-16 text-muted-foreground">{t('noResults')}</div> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{filteredProducts.map((p, i) => <ProductCard key={p.id} product={p} shop={shop} index={i} />)}</div>}
            </div>
          )}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((img, i) => <motion.div key={img.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="group relative rounded-2xl overflow-hidden glass cinema-border aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt={getBilingual(img.caption, locale)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {img.caption && <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><p className="text-sm font-medium">{getBilingual(img.caption, locale)}</p></div>}
              </motion.div>)}
            </div>
          )}
          {activeTab === 'video' && (
            <div className="max-w-4xl mx-auto"><div className="aspect-video"><VideoPlayer src={shop.video_url || 'https://www.youtube.com/embed/LXb3EKWsInQ'} provider={(shop.video_provider as 'youtube' | 'vimeo' | 'file') || 'youtube'} thumbnail={shop.cover_image} className="w-full h-full" /></div></div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-6 cinema-border flex items-center gap-6">
                <div className="text-center"><div className="text-5xl font-bold cinema-gradient-text">{shop.rating}</div><div className="flex gap-0.5 mt-2">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={cn('w-4 h-4', s <= Math.round(shop.rating) ? 'fill-gold text-gold' : 'text-muted-foreground/30')} />)}</div><div className="text-xs text-muted-foreground mt-1">{shop.review_count} {t('reviewsCount')}</div></div>
                <div className="h-16 w-px bg-border" />
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length;
                    const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                    return <div key={star} className="flex items-center gap-2 text-xs"><span className="w-3 text-muted-foreground">{star}</span><Star className="w-3 h-3 fill-gold text-gold" /><div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-gradient-to-r from-gold to-amber-500" style={{ width: `${pct}%` }} /></div><span className="w-6 text-muted-foreground">{count}</span></div>;
                  })}
                </div>
              </div>
              {reviews.map((review, i) => <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold text-sm shrink-0">{review.author_name.charAt(0)}</div>
                  <div className="flex-1"><div className="flex items-center justify-between"><p className="font-medium text-sm">{review.author_name}</p><div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={cn('w-3 h-3', s <= review.rating ? 'fill-gold text-gold' : 'text-muted-foreground/30')} />)}</div></div><p className="text-sm text-muted-foreground mt-1">{getBilingual(review.comment, locale)}</p></div>
                </div>
              </motion.div>)}
            </div>
          )}
          {activeTab === 'booking' && <div className="max-w-2xl mx-auto">{shop.booking_enabled ? <ReservationSystem shop={shop} /> : <div className="text-center py-16 text-muted-foreground">{t('noResults')}</div>}</div>}
          {activeTab === 'contact' && (
            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shop.address && <div className="glass rounded-xl p-5 flex items-start gap-3"><div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div><div><p className="text-xs text-muted-foreground">{t('address')}</p><p className="font-medium text-sm">{getBilingual(shop.address, locale)}</p></div></div>}
              {shop.phone && <div className="glass rounded-xl p-5 flex items-start gap-3"><div className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center"><Phone className="w-5 h-5 text-teal" /></div><div><p className="text-xs text-muted-foreground">{t('phone')}</p><p className="font-medium text-sm" dir="ltr">{shop.phone}</p></div></div>}
              {shop.email && <div className="glass rounded-xl p-5 flex items-start gap-3"><div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center"><Mail className="w-5 h-5 text-accent" /></div><div><p className="text-xs text-muted-foreground">{t('email')}</p><p className="font-medium text-sm" dir="ltr">{shop.email}</p></div></div>}
              {shop.city && <div className="glass rounded-xl p-5 flex items-start gap-3"><div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center"><Globe className="w-5 h-5 text-gold" /></div><div><p className="text-xs text-muted-foreground">{t('city')}</p><p className="font-medium text-sm">{getBilingual(shop.city, locale)}</p></div></div>}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
