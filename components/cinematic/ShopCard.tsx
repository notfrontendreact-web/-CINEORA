'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { Shop } from '@/lib/types';
import { useLocale } from '@/contexts/LocaleContext';
import { getBilingual } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function ShopCard({ shop, index = 0 }: { shop: Shop; index?: number }) {
  const { locale, dir, t } = useLocale();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Link href={`/shops/${shop.slug}`} className="group block">
        <div className="relative rounded-2xl overflow-hidden glass card-glow-hover cinema-border">
          <div className="relative h-56 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shop.cover_image} alt={getBilingual(shop.name, locale)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute top-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-strong text-sm">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" /><span className="font-bold">{shop.rating}</span><span className="text-xs text-muted-foreground">({shop.review_count})</span>
            </div>
            {shop.featured && <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-gold to-amber-500 text-black text-xs font-bold">{t('featured')}</div>}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white">{getBilingual(shop.name, locale)}</h3>
              <p className="text-sm text-white/70">{getBilingual(shop.tagline, locale)}</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="w-3.5 h-3.5" /><span>{shop.city ? getBilingual(shop.city, locale) : ''}</span></div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-medium group-hover:gap-2 transition-all flex items-center gap-1">{t('viewShop')}<Arrow className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></span>
              {shop.booking_enabled && <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal/20 text-teal font-medium">{t('bookAppointment')}</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
