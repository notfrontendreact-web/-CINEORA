'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';
import { ShopCard } from '@/components/cinematic/ShopCard';
import { Particles } from '@/components/cinematic/Particles';
import { fetchShops } from '@/lib/queries';
import { Shop } from '@/lib/types';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

function ShopsPageContent() {
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'reviews'>('featured');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { slug: 'all', labelKey: 'allShops' as const },
    { slug: 'restaurant', labelKey: 'restaurants' as const },
    { slug: 'fashion', labelKey: 'fashion' as const },
    { slug: 'tech', labelKey: 'tech' as const },
    { slug: 'beauty', labelKey: 'beauty' as const },
    { slug: 'art', labelKey: 'art' as const },
  ];

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchShops(activeCategory !== 'all' ? activeCategory : undefined, search || undefined);
        const sorted = [...data].sort((a, b) => {
          if (sortBy === 'rating') return b.rating - a.rating;
          if (sortBy === 'reviews') return b.review_count - a.review_count;
          return Number(b.featured) - Number(a.featured);
        });
        setShops(sorted);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, [activeCategory, search, sortBy]);

  return (
    <div className="relative min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-cinema-hero" />
        <div className="absolute inset-0">
          <div className="aurora-blob w-96 h-96 bg-primary/20 top-[-50px] left-[-50px] animate-aurora" />
          <div className="aurora-blob w-96 h-96 bg-accent/20 bottom-[-50px] right-[-50px] animate-aurora" style={{ animationDelay: '3s' }} />
        </div>
        <Particles count={30} />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-bold mb-4"><span className="cinema-gradient-text">{t('shops')}</span></motion.h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('featuredShopsDesc')}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('searchPlaceholder')} className="w-full h-12 ps-10 pe-4 rounded-xl glass border border-border outline-none focus:border-primary transition-colors text-sm" />
          </div>
          <div className="flex gap-2">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="h-12 px-4 rounded-xl glass border border-border outline-none focus:border-primary text-sm cursor-pointer">
              <option value="featured">{t('featured')}</option>
              <option value="rating">{t('topRated')}</option>
              <option value="reviews">{t('reviewsCount')}</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden h-12 px-4 rounded-xl glass border border-border flex items-center gap-2 text-sm"><SlidersHorizontal className="w-4 h-4" />{t('filters')}</button>
          </div>
        </div>

        <div className={cn('flex flex-wrap gap-2 mb-8', !showFilters && 'hidden md:flex')}>
          {categories.map((cat) => (
            <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)} className={cn('px-4 py-2 rounded-full text-sm font-medium transition-all', activeCategory === cat.slug ? 'bg-gradient-to-r from-primary to-accent text-white glow-primary' : 'glass hover:bg-secondary/80')}>{t(cat.labelKey)}</button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{loading ? t('loading') : `${shops.length} ${t('resultsFound')}`}</p>
          {(activeCategory !== 'all' || search) && <button onClick={() => { setActiveCategory('all'); setSearch(''); }} className="text-xs text-primary hover:underline flex items-center gap-1"><X className="w-3 h-3" /> {t('clearFilters')}</button>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={i} className="h-72 rounded-2xl glass shimmer" />)}</div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full glass flex items-center justify-center mb-4"><Search className="w-8 h-8 text-muted-foreground" /></div>
            <p className="text-lg font-medium">{t('noResults')}</p><p className="text-sm text-muted-foreground mt-1">{t('noResultsDesc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{shops.map((shop, i) => <ShopCard key={shop.id} shop={shop} index={i} />)}</div>
        )}
      </section>
    </div>
  );
}

export default function ShopsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
      <ShopsPageContent />
    </Suspense>
  );
}
