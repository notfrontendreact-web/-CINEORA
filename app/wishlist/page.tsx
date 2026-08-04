'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLocale } from '@/contexts/LocaleContext';
import { ProductCard } from '@/components/cinematic/ProductCard';
import { Particles } from '@/components/cinematic/Particles';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { items } = useWishlist();
  const { t, dir } = useLocale();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="relative min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-cinema-hero" />
        <div className="absolute inset-0"><div className="aurora-blob w-96 h-96 bg-destructive/20 top-[-50px] right-[-50px] animate-aurora" /></div>
        <Particles count={20} />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-destructive/20 to-accent/20 flex items-center justify-center mb-4"><Heart className="w-7 h-7 text-destructive" /></div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2"><span className="cinema-gradient-text">{t('wishlist')}</span></h1>
            <p className="text-muted-foreground">{items.length} {t('reviewsCount')}</p>
          </motion.div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full glass flex items-center justify-center mb-4"><Heart className="w-8 h-8 text-muted-foreground" /></div>
            <p className="text-lg font-medium">{t('wishlistEmpty')}</p><p className="text-sm text-muted-foreground mt-1 mb-6">{t('wishlistEmptyDesc')}</p>
            <Link href="/shops" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium hover:glow-primary transition-all">{t('continueShopping')} <Arrow className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{items.map((item, i) => <ProductCard key={item.product.id} product={item.product} shop={item.shop} index={i} />)}</div>
        )}
      </section>
    </div>
  );
}
