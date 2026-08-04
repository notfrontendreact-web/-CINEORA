'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Heart, GitCompare, Download, ShoppingBag } from 'lucide-react';
import { Product, Shop } from '@/lib/types';
import { useLocale } from '@/contexts/LocaleContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCompare } from '@/contexts/CompareContext';
import { getBilingual, formatPrice } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ProductCard({ product, shop, index = 0 }: { product: Product; shop: Shop; index?: number }) {
  const { locale, t } = useLocale();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const price = product.discount_price ?? product.price;
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: index * 0.08 }} className="group relative rounded-2xl overflow-hidden glass card-glow-hover cinema-border">
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={getBilingual(product.name, locale)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        {hasDiscount && <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-destructive text-white text-xs font-bold">-{Math.round((1 - (product.discount_price! / product.price)) * 100)}% {t('off')}</div>}
        {product.is_digital && <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-teal/80 text-white text-xs font-medium flex items-center gap-1"><Download className="w-3 h-3" /> {t('digitalProduct')}</div>}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button onClick={() => { toggleWishlist(product, shop); toast.success(inWishlist ? t('removeFromWishlist') : t('addToWishlist')); }} className={cn('w-8 h-8 rounded-full glass-strong flex items-center justify-center transition-all hover:scale-110', inWishlist && 'text-destructive')}><Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} /></button>
          <button onClick={() => { toggleCompare(product, shop); toast.success(t('compare')); }} className={cn('w-8 h-8 rounded-full glass-strong flex items-center justify-center transition-all hover:scale-110', inCompare && 'text-accent')}><GitCompare className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <Link href={`/shops/${shop.slug}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">{getBilingual(shop.name, locale)}</Link>
        <h3 className="font-medium text-sm leading-snug line-clamp-2">{getBilingual(product.name, locale)}</h3>
        <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-gold text-gold" /><span className="text-xs font-bold">{product.rating}</span><span className="text-xs text-muted-foreground">({product.review_count})</span></div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold cinema-gradient-text">{formatPrice(price, locale)}</span>
            {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price, locale)}</span>}
          </div>
          <button onClick={() => { addToCart(product, shop); toast.success(t('addedToCart')); }} className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center hover:glow-primary transition-all hover:scale-105" aria-label={t('addToCart')}><ShoppingBag className="w-4 h-4" /></button>
        </div>
      </div>
    </motion.div>
  );
}
