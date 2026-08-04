'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WishlistItem, Product, Shop } from '@/lib/types';

interface WishlistContextValue {
  items: WishlistItem[];
  toggleWishlist: (product: Product, shop: Shop) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try { const saved = localStorage.getItem('wishlist-items'); if (saved) setItems(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);
  useEffect(() => { if (mounted) localStorage.setItem('wishlist-items', JSON.stringify(items)); }, [items, mounted]);

  const toggleWishlist = useCallback((product: Product, shop: Shop) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      if (exists) return prev.filter((i) => i.product.id !== product.id);
      return [...prev, { product, shop }];
    });
  }, []);
  const isInWishlist = useCallback((productId: string) => items.some((i) => i.product.id === productId), [items]);
  const removeFromWishlist = useCallback((productId: string) => setItems((prev) => prev.filter((i) => i.product.id !== productId)), []);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isInWishlist, removeFromWishlist, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
