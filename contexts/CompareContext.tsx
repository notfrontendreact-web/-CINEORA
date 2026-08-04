'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Shop } from '@/lib/types';

interface CompareContextValue {
  items: { product: Product; shop: Shop }[];
  toggleCompare: (product: Product, shop: Shop) => void;
  isInCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  totalItems: number;
}

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<{ product: Product; shop: Shop }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try { const saved = localStorage.getItem('compare-items'); if (saved) setItems(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);
  useEffect(() => { if (mounted) localStorage.setItem('compare-items', JSON.stringify(items)); }, [items, mounted]);

  const toggleCompare = useCallback((product: Product, shop: Shop) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      if (exists) return prev.filter((i) => i.product.id !== product.id);
      if (prev.length >= 4) return prev;
      return [...prev, { product, shop }];
    });
  }, []);
  const isInCompare = useCallback((productId: string) => items.some((i) => i.product.id === productId), [items]);
  const removeFromCompare = useCallback((productId: string) => setItems((prev) => prev.filter((i) => i.product.id !== productId)), []);
  const clearCompare = useCallback(() => setItems([]), []);

  return (
    <CompareContext.Provider value={{ items, toggleCompare, isInCompare, removeFromCompare, clearCompare, totalItems: items.length }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
