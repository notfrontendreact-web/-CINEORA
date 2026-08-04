import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CompareProvider } from '@/contexts/CompareContext';
import { Providers } from '@/components/shared/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://cineora.example.com'),
  title: 'CINEORA — Cinematic Marketplace',
  description: 'A next-generation cinematic multi-vendor marketplace with 3D visual experiences, reservation systems, and immersive shopping.',
  keywords: ['cinematic marketplace', 'multi-vendor', 'reservation', 'bilingual', '3D shopping'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <LocaleProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <Providers>{children}</Providers>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
