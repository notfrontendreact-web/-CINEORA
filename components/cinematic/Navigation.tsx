'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCompare } from '@/contexts/CompareContext';
import { ShoppingBag, Heart, GitCompare, Search, Menu, X, Globe, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryConfig = [
  { slug: 'restaurant', labelKey: 'restaurants' as const },
  { slug: 'fashion', labelKey: 'fashion' as const },
  { slug: 'tech', labelKey: 'tech' as const },
  { slug: 'beauty', labelKey: 'beauty' as const },
  { slug: 'art', labelKey: 'art' as const },
];

export function Navigation() {
  const { locale, toggleLocale, t } = useLocale();
  const { totalItems: cartCount, setIsOpen } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { totalItems: compareCount } = useCompare();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); setMegaOpen(false); }, [pathname]);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/shops', label: t('shops'), mega: true },
    { href: '/shops?category=restaurant', label: t('restaurants') },
    { href: '/shops?category=fashion', label: t('fashion') },
  ];

  return (
    <>
      <div className="relative z-50 overflow-hidden bg-gradient-to-r from-primary/20 via-accent/20 to-teal/20 border-b border-border/30">
        <div className="flex animate-marquee whitespace-nowrap py-1.5 text-xs text-muted-foreground">
          {[0, 1, 0, 1].map((_, i) => (
            <span key={i} className="mx-8 flex items-center gap-2"><Sparkles className="w-3 h-3" /> {locale === 'fa' ? 'تخفیف ۲۰٪ با کد LUXE20 — ارسال رایگان بالای ۱۰۰ دلار' : '20% OFF with code LUXE20 — Free shipping over $100'}</span>
          ))}
        </div>
      </div>

      <header className={cn('sticky top-0 z-40 transition-all duration-500', scrolled ? 'glass-nav py-2' : 'bg-transparent py-4')}>
        <nav className="container mx-auto px-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-accent to-teal flex items-center justify-center glow-primary transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight cinema-gradient-text">CINEORA</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.mega ? (
                <div key={link.href} className="relative" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground nav-underline transition-colors">
                    {link.label}<ChevronDown className={cn('w-4 h-4 transition-transform', megaOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.25 }} className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[600px]">
                        <div className="glass-strong rounded-2xl p-6 cinema-border">
                          <div className="grid grid-cols-3 gap-4">
                            {categoryConfig.map((cat) => (
                              <Link key={cat.slug} href={`/shops?category=${cat.slug}`} className="group/cat flex flex-col gap-2 p-4 rounded-xl hover:bg-primary/10 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary group-hover/cat:scale-110 transition-transform">
                                  <Sparkles className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-sm">{t(cat.labelKey)}</span>
                                <span className="text-xs text-muted-foreground">{t('viewShop')} →</span>
                              </Link>
                            ))}
                            <Link href="/shops" className="group/cat flex flex-col gap-2 p-4 rounded-xl hover:bg-accent/10 transition-colors">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-accent group-hover/cat:scale-110 transition-transform">
                                <Sparkles className="w-5 h-5" />
                              </div>
                              <span className="font-medium text-sm">{t('allShops')}</span>
                              <span className="text-xs text-muted-foreground">{t('exploreMore')} →</span>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.href} href={link.href} className={cn('px-4 py-2 text-sm font-medium nav-underline transition-colors', pathname === link.href ? 'text-foreground' : 'text-foreground/80 hover:text-foreground')}>
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => setSearchOpen(true)} className="w-9 h-9 rounded-lg hover:bg-secondary/60 flex items-center justify-center transition-colors" aria-label={t('search')}>
              <Search className="w-4 h-4" />
            </button>
            <Link href="/compare" className="hidden sm:flex relative w-9 h-9 rounded-lg hover:bg-secondary/60 items-center justify-center transition-colors" aria-label={t('compare')}>
              <GitCompare className="w-4 h-4" />
              {compareCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[10px] flex items-center justify-center font-bold">{compareCount}</span>}
            </Link>
            <Link href="/wishlist" className="relative w-9 h-9 rounded-lg hover:bg-secondary/60 flex items-center justify-center transition-colors" aria-label={t('wishlist')}>
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-[10px] flex items-center justify-center font-bold">{wishlistCount}</span>}
            </Link>
            <button onClick={() => setIsOpen(true)} className="relative w-9 h-9 rounded-lg hover:bg-secondary/60 flex items-center justify-center transition-colors" aria-label={t('cart')}>
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[10px] flex items-center justify-center font-bold glow-primary">{cartCount}</span>}
            </button>
            <button onClick={toggleLocale} className="flex items-center gap-1 px-2.5 h-9 rounded-lg hover:bg-secondary/60 transition-colors text-sm font-medium" aria-label={t('language')}>
              <Globe className="w-4 h-4" /><span>{locale === 'fa' ? 'فا' : 'EN'}</span>
            </button>
            <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 rounded-lg hover:bg-secondary/60 flex items-center justify-center transition-colors" aria-label={t('menu')}>
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-start justify-center pt-24 px-4" onClick={() => setSearchOpen(false)}>
            <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }} className="glass-strong rounded-2xl p-6 w-full max-w-2xl cinema-border" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('searchPlaceholder')} className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground" onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim()) window.location.href = `/shops?q=${encodeURIComponent(searchQuery)}`; }} />
                <button onClick={() => setSearchOpen(false)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {categoryConfig.map((cat) => (
                  <Link key={cat.slug} href={`/shops?category=${cat.slug}`} onClick={() => setSearchOpen(false)} className="px-3 py-1.5 rounded-full text-sm bg-secondary/60 hover:bg-primary/20 transition-colors">{t(cat.labelKey)}</Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: locale === 'fa' ? '-100%' : '100%' }} animate={{ x: 0 }} exit={{ x: locale === 'fa' ? '-100%' : '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className={cn('absolute top-0 bottom-0 w-80 glass-strong p-6 overflow-y-auto', locale === 'fa' ? 'left-0' : 'right-0')}>
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold cinema-gradient-text">CINEORA</span>
                <button onClick={() => setMobileOpen(false)} className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-1">
                <Link href="/" className="block px-4 py-3 rounded-xl hover:bg-secondary/60 font-medium">{t('home')}</Link>
                <div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-wide">{t('shops')}</div>
                <Link href="/shops" className="block px-4 py-3 rounded-xl hover:bg-secondary/60 font-medium">{t('allShops')}</Link>
                {categoryConfig.map((cat) => (
                  <Link key={cat.slug} href={`/shops?category=${cat.slug}`} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/60">
                    <Sparkles className="w-4 h-4 text-primary" /><span className="font-medium">{t(cat.labelKey)}</span>
                  </Link>
                ))}
                <div className="h-px bg-border my-4" />
                <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/60"><Heart className="w-4 h-4" /> <span className="font-medium">{t('wishlist')}</span></Link>
                <Link href="/compare" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/60"><GitCompare className="w-4 h-4" /> <span className="font-medium">{t('compare')}</span></Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
