'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { Navigation } from '@/components/cinematic/Navigation';
import { Footer } from '@/components/cinematic/Footer';
import { CartDrawer } from '@/components/cinematic/CartDrawer';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  useLocale();
  return (
    <div className="relative min-h-screen mesh-bg">
      <Navigation />
      <main className="relative">{children}</main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </div>
  );
}
