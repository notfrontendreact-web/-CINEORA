'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import { Sparkles, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  const { t, locale } = useLocale();

  const shopLinks = [
    { href: '/shops?category=restaurant', label: t('restaurants') },
    { href: '/shops?category=fashion', label: t('fashion') },
    { href: '/shops?category=tech', label: t('tech') },
    { href: '/shops?category=beauty', label: t('beauty') },
    { href: '/shops?category=art', label: t('art') },
  ];
  const serviceLinks = [
    { href: '/wishlist', label: t('wishlist') },
    { href: '/compare', label: t('compare') },
    { href: '/shops', label: t('allShops') },
    { href: '/admin', label: 'Admin Dashboard' },
  ];

  return (
    <footer className="relative mt-20 border-t border-border/50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="aurora-blob w-96 h-96 bg-primary/20 -top-48 -left-48 animate-aurora" />
        <div className="aurora-blob w-96 h-96 bg-accent/20 -bottom-48 -right-48 animate-aurora" style={{ animationDelay: '5s' }} />
      </div>
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-accent to-teal flex items-center justify-center glow-primary"><span className="text-white font-bold text-lg">C</span></div>
              <span className="text-xl font-bold cinema-gradient-text">CINEORA</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('footerTagline')}</p>
            <div className="flex gap-3 pt-2">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:glow-primary transition-all hover:scale-110"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{t('quickLinks')}</h3>
            <ul className="space-y-2">{shopLinks.map((l) => <li key={l.href}><Link href={l.href} className="text-sm text-foreground/70 hover:text-primary transition-colors">{l.label}</Link></li>)}</ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{t('customerService')}</h3>
            <ul className="space-y-2">{serviceLinks.map((l) => <li key={l.href}><Link href={l.href} className="text-sm text-foreground/70 hover:text-primary transition-colors">{l.label}</Link></li>)}</ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{t('newsletter')}</h3>
            <p className="text-sm text-muted-foreground">{t('newsletterDesc')}</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t('email')} className="flex-1 h-10 px-3 rounded-lg glass border border-border text-sm outline-none focus:border-primary transition-colors" />
              <button className="h-10 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-white text-sm font-medium hover:glow-primary transition-all">{t('subscribe')}</button>
            </form>
            <div className="pt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> contact@cineora.com</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (555) 000-0000</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {locale === 'fa' ? 'نیویورک، آمریکا' : 'New York, USA'}</div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 CINEORA. {t('rights')}.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">{t('privacy')}</Link>
            <Link href="#" className="hover:text-foreground transition-colors">{t('terms')}</Link>
            <Link href="#" className="hover:text-foreground transition-colors">{t('faq')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
