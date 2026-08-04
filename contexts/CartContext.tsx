'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product, Shop } from '@/lib/types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, shop: Shop, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  appliedCode: string | null;
  applyDiscountCode: (code: string) => boolean;
  removeDiscount: () => void;
}

const VALID_CODES: Record<string, number> = { CINEMA10: 0.1, LUXE20: 0.2, WELCOME15: 0.15 };
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cart-items');
        if (saved) setItems(JSON.parse(saved));
        const savedCode = localStorage.getItem('cart-discount');
        if (savedCode) setAppliedCode(savedCode);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => { if (mounted) localStorage.setItem('cart-items', JSON.stringify(items)); }, [items, mounted]);
  useEffect(() => {
    if (!mounted) return;
    if (appliedCode) localStorage.setItem('cart-discount', appliedCode);
    else localStorage.removeItem('cart-discount');
  }, [appliedCode, mounted]);

  const addToCart = useCallback((product: Product, shop: Shop, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { product, shop, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => setItems((prev) => prev.filter((i) => i.product.id !== productId)), []);
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) { setItems((prev) => prev.filter((i) => i.product.id !== productId)); return; }
    setItems((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity } : i));
  }, []);
  const clearCart = useCallback(() => { setItems([]); setAppliedCode(null); }, []);
  const applyDiscountCode = useCallback((code: string) => {
    const upper = code.toUpperCase().trim();
    if (VALID_CODES[upper]) { setAppliedCode(upper); return true; }
    return false;
  }, []);
  const removeDiscount = useCallback(() => setAppliedCode(null), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => { const p = i.product.discount_price ?? i.product.price; return s + p * i.quantity; }, 0);
  const discountRate = appliedCode ? VALID_CODES[appliedCode] || 0 : 0;
  const discount = subtotal * discountRate;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, isOpen, setIsOpen, totalItems, subtotal, discount, appliedCode, applyDiscountCode, removeDiscount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
