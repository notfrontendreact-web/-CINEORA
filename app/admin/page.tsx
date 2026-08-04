'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';
import { Particles } from '@/components/cinematic/Particles';
import { fetchAllReservations, fetchShops, fetchFeaturedProducts, fetchAllProducts } from '@/lib/queries';
import { Reservation, Shop, Product } from '@/lib/types';
import { getBilingual, formatPrice } from '@/lib/i18n';
import { LayoutDashboard, Store, Package, Calendar, Users, DollarSign, TrendingUp, Video, Image as ImageIcon, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const { t, locale } = useLocale();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<{ product: Product; shop: Shop }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'reservations' | 'shops' | 'products'>('overview');

  useEffect(() => {
    (async () => {
      try { const [r, s, p] = await Promise.all([fetchAllReservations(), fetchShops(), fetchAllProducts()]); setReservations(r); setShops(s); setProducts(p); }
      catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, []);

  const totalRevenue = products.reduce((sum, p) => { const price = p.product.discount_price ?? p.product.price; return sum + price * (p.product.review_count + 10); }, 0);
  const confirmedReservations = reservations.filter((r) => r.status === 'confirmed').length;
  const pendingReservations = reservations.filter((r) => r.status === 'pending').length;

  const stats = [
    { label: locale === 'fa' ? 'فروشگاه‌ها' : 'Shops', value: shops.length, icon: Store, color: 'from-primary/20 to-accent/20', text: 'text-primary' },
    { label: locale === 'fa' ? 'محصولات' : 'Products', value: products.length, icon: Package, color: 'from-accent/20 to-teal/20', text: 'text-accent' },
    { label: locale === 'fa' ? 'رزروها' : 'Reservations', value: reservations.length, icon: Calendar, color: 'from-teal/20 to-gold/20', text: 'text-teal' },
    { label: locale === 'fa' ? 'درآمد تخمینی' : 'Est. Revenue', value: formatPrice(totalRevenue, locale), icon: DollarSign, color: 'from-gold/20 to-primary/20', text: 'text-gold' },
  ];
  const sections = [
    { id: 'overview' as const, label: locale === 'fa' ? 'نمای کلی' : 'Overview', icon: LayoutDashboard },
    { id: 'reservations' as const, label: locale === 'fa' ? 'رزروها' : 'Reservations', icon: Calendar },
    { id: 'shops' as const, label: locale === 'fa' ? 'فروشگاه‌ها' : 'Shops', icon: Store },
    { id: 'products' as const, label: locale === 'fa' ? 'محصولات' : 'Products', icon: Package },
  ];

  return (
    <div className="relative min-h-screen">
      <section className="relative py-12 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-cinema-hero" />
        <Particles count={20} />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary"><LayoutDashboard className="w-5 h-5 text-white" /></div>
              <h1 className="text-3xl md:text-4xl font-bold"><span className="cinema-gradient-text">Admin Dashboard</span></h1>
            </div>
            <p className="text-muted-foreground text-sm">{locale === 'fa' ? 'پنل مدیریت فروشگاه‌ها، محصولات، رزروها و گزارش‌ها' : 'Manage shops, products, reservations, and reports'}</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map((s) => { const Icon = s.icon; return <button key={s.id} onClick={() => setActiveSection(s.id)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all', activeSection === s.id ? 'bg-gradient-to-r from-primary to-accent text-white glow-primary' : 'glass hover:bg-secondary/80')}><Icon className="w-4 h-4" /> {s.label}</button>; })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl glass shimmer" />)}</div>
        ) : (
          <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, i) => { const Icon = stat.icon; return (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-5 cinema-border">
                      <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', stat.color)}><Icon className={cn('w-5 h-5', stat.text)} /></div>
                      <div className="text-2xl font-bold">{stat.value}</div><div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </motion.div>
                  ); })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6 cinema-border">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> {locale === 'fa' ? 'مدیریت سریع' : 'Quick Management'}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: locale === 'fa' ? 'کاربران' : 'Users', icon: Users },
                        { label: locale === 'fa' ? 'ویدیوها' : 'Videos', icon: Video },
                        { label: locale === 'fa' ? 'تصاویر' : 'Images', icon: ImageIcon },
                        { label: locale === 'fa' ? 'زبان‌ها' : 'Languages', icon: Languages },
                      ].map((item) => { const Icon = item.icon; return <div key={item.label} className="glass rounded-xl p-4 hover:bg-secondary/60 transition-colors cursor-pointer flex items-center gap-3"><Icon className="w-5 h-5 text-primary" /><span className="text-sm font-medium">{item.label}</span></div>; })}
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-6 cinema-border">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> {locale === 'fa' ? 'رزروهای اخیر' : 'Recent Reservations'}</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {reservations.slice(0, 5).map((r) => { const shop = shops.find((s) => s.id === r.shop_id); return (
                        <div key={r.id} className="flex items-center justify-between p-3 rounded-lg glass">
                          <div><p className="text-sm font-medium">{r.customer_name}</p><p className="text-xs text-muted-foreground">{shop ? getBilingual(shop.name, locale) : '—'}</p></div>
                          <div className="text-right"><span className={cn('text-xs px-2 py-0.5 rounded-full', r.status === 'confirmed' ? 'bg-teal/20 text-teal' : 'bg-gold/20 text-gold')}>{r.status}</span><p className="text-xs text-muted-foreground mt-1">{r.date}</p></div>
                        </div>
                      ); })}
                      {reservations.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t('noResults')}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSection === 'reservations' && (
              <div className="glass rounded-2xl overflow-hidden cinema-border">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold">{locale === 'fa' ? 'همه رزروها' : 'All Reservations'}</h3>
                  <div className="flex gap-3 text-xs"><span className="text-teal">{confirmedReservations} {locale === 'fa' ? 'تایید شده' : 'confirmed'}</span><span className="text-gold">{pendingReservations} {locale === 'fa' ? 'در انتظار' : 'pending'}</span></div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border"><tr className="text-muted-foreground text-xs"><th className="p-3 text-left font-medium">{t('yourName')}</th><th className="p-3 text-left font-medium">{locale === 'fa' ? 'فروشگاه' : 'Shop'}</th><th className="p-3 text-left font-medium">{t('selectDate')}</th><th className="p-3 text-left font-medium">{t('selectPartySize')}</th><th className="p-3 text-left font-medium">{locale === 'fa' ? 'وضعیت' : 'Status'}</th></tr></thead>
                    <tbody>
                      {reservations.map((r) => { const shop = shops.find((s) => s.id === r.shop_id); return (
                        <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30"><td className="p-3 font-medium">{r.customer_name}</td><td className="p-3 text-muted-foreground">{shop ? getBilingual(shop.name, locale) : '—'}</td><td className="p-3 text-muted-foreground">{r.date}</td><td className="p-3">{r.party_size} {t('partySize')}</td><td className="p-3"><span className={cn('text-xs px-2 py-0.5 rounded-full', r.status === 'confirmed' ? 'bg-teal/20 text-teal' : 'bg-gold/20 text-gold')}>{r.status}</span></td></tr>
                      ); })}
                      {reservations.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">{t('noResults')}</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeSection === 'shops' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shops.map((shop) => (
                  <div key={shop.id} className="glass rounded-2xl overflow-hidden cinema-border">
                    <div className="h-32 overflow-hidden">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={shop.cover_image} alt={getBilingual(shop.name, locale)} className="w-full h-full object-cover" /></div>
                    <div className="p-4"><p className="font-bold text-sm">{getBilingual(shop.name, locale)}</p><p className="text-xs text-muted-foreground mt-1">{getBilingual(shop.tagline, locale)}</p><div className="flex items-center justify-between mt-3 text-xs"><span className="text-gold">★ {shop.rating}</span><span className={cn('px-2 py-0.5 rounded-full', shop.featured ? 'bg-gold/20 text-gold' : 'bg-secondary text-muted-foreground')}>{shop.featured ? t('featured') : locale === 'fa' ? 'عادی' : 'Standard'}</span></div></div>
                  </div>
                ))}
              </div>
            )}
            {activeSection === 'products' && (
              <div className="glass rounded-2xl overflow-hidden cinema-border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border"><tr className="text-muted-foreground text-xs"><th className="p-3 text-left font-medium">{locale === 'fa' ? 'محصول' : 'Product'}</th><th className="p-3 text-left font-medium">{locale === 'fa' ? 'فروشگاه' : 'Shop'}</th><th className="p-3 text-left font-medium">{locale === 'fa' ? 'قیمت' : 'Price'}</th><th className="p-3 text-left font-medium">{t('rating')}</th><th className="p-3 text-left font-medium">{t('inStock')}</th></tr></thead>
                    <tbody>
                      {products.map((item) => (
                        <tr key={item.product.id} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="p-3"><div className="flex items-center gap-2"><div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={item.product.image} alt="" className="w-full h-full object-cover" /></div><span className="font-medium">{getBilingual(item.product.name, locale)}</span></div></td>
                          <td className="p-3 text-muted-foreground">{getBilingual(item.shop.name, locale)}</td>
                          <td className="p-3 font-medium">{formatPrice(item.product.discount_price ?? item.product.price, locale)}</td>
                          <td className="p-3 text-gold">★ {item.product.rating}</td>
                          <td className="p-3">{item.product.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
