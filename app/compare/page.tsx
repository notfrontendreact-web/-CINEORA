'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCompare } from '@/contexts/CompareContext';
import { useCart } from '@/contexts/CartContext';
import { useLocale } from '@/contexts/LocaleContext';
import { Particles } from '@/components/cinematic/Particles';
import { getBilingual, formatPrice } from '@/lib/i18n';
import { GitCompare, X, ShoppingBag, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { t, locale, dir } = useLocale();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const compareFields = [
    { key: 'price', label: locale === 'fa' ? 'قیمت' : 'Price', render: (p: typeof items[0]['product']) => formatPrice(p.discount_price ?? p.price, locale) },
    { key: 'rating', label: t('rating'), render: (p: typeof items[0]['product']) => `${p.rating} / 5` },
    { key: 'reviews', label: t('reviewsCount'), render: (p: typeof items[0]['product']) => `${p.review_count}` },
    { key: 'stock', label: t('inStock'), render: (p: typeof items[0]['product']) => `${p.stock}` },
    { key: 'digital', label: t('digitalProduct'), render: (p: typeof items[0]['product']) => p.is_digital ? <Check className="w-4 h-4 text-teal" /> : '—' },
    { key: 'shop', label: locale === 'fa' ? 'فروشگاه' : 'Shop', render: (_p: typeof items[0]['product'], shop: typeof items[0]['shop']) => getBilingual(shop.name, locale) },
  ];

  return (
    <div className="relative min-h-screen">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-cinema-hero" />
        <Particles count={20} />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4"><GitCompare className="w-7 h-7 text-accent" /></div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2"><span className="cinema-gradient-text">{t('compareProducts')}</span></h1>
            <p className="text-muted-foreground">{items.length} / 4 {locale === 'fa' ? 'محصول' : 'products'}</p>
          </motion.div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full glass flex items-center justify-center mb-4"><GitCompare className="w-8 h-8 text-muted-foreground" /></div>
            <p className="text-lg font-medium">{t('compareEmpty')}</p>
            <Link href="/shops" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium hover:glow-primary transition-all mt-6">{t('continueShopping')} <Arrow className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end"><button onClick={clearCompare} className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1"><X className="w-4 h-4" /> {t('clearFilters')}</button></div>
            <div className="overflow-x-auto rounded-2xl glass cinema-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-sm text-muted-foreground font-medium">{locale === 'fa' ? 'ویژگی' : 'Feature'}</th>
                    {items.map((item) => (
                      <th key={item.product.id} className="p-4 min-w-[200px]">
                        <div className="relative group">
                          <button onClick={() => removeFromCompare(item.product.id)} className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive/20 hover:bg-destructive/40 flex items-center justify-center z-10"><X className="w-3 h-3" /></button>
                          <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-secondary">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.product.image} alt={getBilingual(item.product.name, locale)} className="w-full h-full object-cover" />
                          </div>
                          <p className="font-medium text-sm line-clamp-2">{getBilingual(item.product.name, locale)}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareFields.map((field) => (
                    <tr key={field.key} className="border-b border-border/50">
                      <td className="p-4 text-sm text-muted-foreground font-medium">{field.label}</td>
                      {items.map((item) => <td key={item.product.id} className="p-4 text-sm text-center">{field.render(item.product, item.shop)}</td>)}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-4"></td>
                    {items.map((item) => (
                      <td key={item.product.id} className="p-4 text-center">
                        <button onClick={() => { addToCart(item.product, item.shop); toast.success(t('addedToCart')); }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-medium hover:glow-primary transition-all inline-flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> {t('addToCart')}</button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
