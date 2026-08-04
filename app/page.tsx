'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { Particles } from '@/components/cinematic/Particles';
import { SectionHeading } from '@/components/cinematic/SectionHeading';
import { ShopCard } from '@/components/cinematic/ShopCard';
import { ProductCard } from '@/components/cinematic/ProductCard';
import { VideoPlayer } from '@/components/cinematic/VideoPlayer';
import { fetchFeaturedShops, fetchFeaturedProducts } from '@/lib/queries';
import { Shop, Product } from '@/lib/types';
import { ArrowRight, ArrowLeft, Play, Sparkles, UtensilsCrossed, Shirt, Smartphone, Image, Heart, Search, Calendar, Star, ChevronDown } from 'lucide-react';

export default function HomePage() {
  const { locale, dir, t } = useLocale();
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<{ product: Product; shop: Shop }[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    (async () => {
      try { const [s, p] = await Promise.all([fetchFeaturedShops(6), fetchFeaturedProducts(8)]); setShops(s); setProducts(p); }
      catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, []);

  const categories = [
    { slug: 'restaurant', icon: UtensilsCrossed, labelKey: 'restaurants' as const },
    { slug: 'fashion', icon: Shirt, labelKey: 'fashion' as const },
    { slug: 'tech', icon: Smartphone, labelKey: 'tech' as const },
    { slug: 'beauty', icon: Sparkles, labelKey: 'beauty' as const },
    { slug: 'art', icon: Image, labelKey: 'art' as const },
  ];
  const steps = [
    { icon: Search, titleKey: 'step1Title' as const, descKey: 'step1Desc' as const },
    { icon: Heart, titleKey: 'step2Title' as const, descKey: 'step2Desc' as const },
    { icon: Calendar, titleKey: 'step3Title' as const, descKey: 'step3Desc' as const },
  ];

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cinema-hero" />
        <div className="absolute inset-0">
          <div className="aurora-blob w-[600px] h-[600px] bg-primary/20 top-[-100px] left-[-100px] animate-aurora" />
          <div className="aurora-blob w-[500px] h-[500px] bg-accent/20 bottom-[-100px] right-[-100px] animate-aurora" style={{ animationDelay: '5s' }} />
          <div className="aurora-blob w-[400px] h-[400px] bg-teal/15 top-1/2 left-1/3 animate-aurora" style={{ animationDelay: '10s' }} />
        </div>
        <Particles count={60} />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-gold" /><span className="text-sm font-medium">{locale === 'fa' ? 'نسل بعد تجربه خرید' : 'Next-Gen Shopping Experience'}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="cinema-gradient-text">{t('heroTitle')}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">{t('heroSubtitle')}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shops" className="group px-8 py-4 rounded-xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:bg-[position:100%] text-white font-bold transition-all duration-500 glow-primary flex items-center gap-2">{t('exploreShops')}<Arrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
            <button className="px-8 py-4 rounded-xl glass-strong font-medium flex items-center gap-2 hover:glow-primary transition-all"><Play className="w-4 h-4 fill-current" />{t('watchVideo')}</button>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-widest">{t('scrollDown')}</span><ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="relative py-20 container mx-auto px-4">
        <SectionHeading title={t('categories')} description={t('categoriesDesc')} icon={<Sparkles className="w-3 h-3" />} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return <motion.div key={cat.slug} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <Link href={`/shops?category=${cat.slug}`} className="group relative block p-6 rounded-2xl glass card-glow-hover cinema-border text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Icon className="w-6 h-6 text-primary" /></div>
                <p className="font-medium text-sm">{t(cat.labelKey)}</p>
              </Link>
            </motion.div>;
          })}
        </div>
      </section>

      {/* FEATURED SHOPS */}
      <section className="relative py-20 container mx-auto px-4">
        <SectionHeading title={t('featuredShops')} description={t('featuredShopsDesc')} icon={<Star className="w-3 h-3" />} action={<Link href="/shops" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">{t('viewAll')} <Arrow className="w-4 h-4" /></Link>} />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={i} className="h-72 rounded-2xl glass shimmer" />)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{shops.map((shop, i) => <ShopCard key={shop.id} shop={shop} index={i} />)}</div>
        )}
      </section>

      {/* VIDEO SHOWCASE */}
      <section className="relative py-20 container mx-auto px-4">
        <SectionHeading title={t('introVideo')} description={locale === 'fa' ? 'تجربه ویدیویی سینمایی از فروشگاه‌ها' : 'A cinematic video experience of our shops'} icon={<Play className="w-3 h-3" />} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="h-[400px]">
            <VideoPlayer src="https://www.youtube.com/embed/LXb3EKWsInQ" provider="youtube" thumbnail={shops[0]?.cover_image} className="h-full" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="h-[400px]">
            <VideoPlayer src="https://www.youtube.com/embed/3JZ_DpkELkQ" provider="youtube" thumbnail={shops[2]?.cover_image || 'https://images.pexels.com/photos/236086/pexels-photo-236086.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'} className="h-full" />
          </motion.div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="relative py-20 container mx-auto px-4">
        <SectionHeading title={t('products')} description={locale === 'fa' ? 'محصولات منتخب و ویژه' : 'Curated and featured products'} icon={<Sparkles className="w-3 h-3" />} action={<Link href="/shops" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all">{t('viewAll')} <Arrow className="w-4 h-4" /></Link>} />
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="h-72 rounded-2xl glass shimmer" />)}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{products.map((item, i) => <ProductCard key={item.product.id} product={item.product} shop={item.shop} index={i} />)}</div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-20 container mx-auto px-4">
        <SectionHeading title={t('howItWorks')} description={t('howItWorksDesc')} icon={<Calendar className="w-3 h-3" />} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="relative">
              <div className="relative p-8 rounded-2xl glass card-glow-hover cinema-border text-center">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold flex items-center justify-center glow-primary">{i + 1}</div>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 mt-4"><Icon className="w-7 h-7 text-primary" /></div>
                <h3 className="text-xl font-bold mb-2">{t(step.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </div>
              {i < 2 && <div className="hidden md:flex absolute top-1/2 -right-4 w-8 h-8 items-center justify-center text-muted-foreground"><Arrow className="w-5 h-5" /></div>}
            </motion.div>;
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative rounded-3xl overflow-hidden glass-strong cinema-border p-12 md:p-20 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="aurora-blob w-96 h-96 bg-primary/20 -top-48 -left-48 animate-aurora" />
            <div className="aurora-blob w-96 h-96 bg-accent/20 -bottom-48 -right-48 animate-aurora" style={{ animationDelay: '5s' }} />
          </div>
          <Particles count={30} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4"><span className="cinema-gradient-text">{t('exploreMore')}</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">{locale === 'fa' ? 'بیش از ۵ فروشگاه لوکس با تجربه‌ای سینمایی منتظر شما هستند' : 'Over 5 luxury shops with a cinematic experience await you'}</p>
            <Link href="/shops" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:bg-[position:100%] text-white font-bold transition-all duration-500 glow-primary">{t('exploreShops')} <Arrow className="w-5 h-5" /></Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
