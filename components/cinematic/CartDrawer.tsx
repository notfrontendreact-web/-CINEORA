'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useLocale } from '@/contexts/LocaleContext';
import { getBilingual, formatPrice } from '@/lib/i18n';
import { X, Plus, Minus, ShoppingBag, Trash2, Tag } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, subtotal, discount, appliedCode, applyDiscountCode, removeDiscount, clearCart } = useCart();
  const { t, locale, dir } = useLocale();
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  const handleApplyCode = () => {
    if (applyDiscountCode(codeInput)) { toast.success(t('discountApplied')); setCodeInput(''); setCodeError(false); }
    else { setCodeError(true); toast.error(t('invalidCode')); }
  };

  const total = subtotal - discount;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <motion.div initial={{ x: dir === 'rtl' ? '-100%' : '100%' }} animate={{ x: 0 }} exit={{ x: dir === 'rtl' ? '-100%' : '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className={cn('absolute top-0 bottom-0 w-full max-w-md glass-strong flex flex-col', dir === 'rtl' ? 'left-0' : 'right-0')}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-primary" /><h2 className="text-lg font-bold">{t('cart')}</h2>{items.length > 0 && <span className="text-sm text-muted-foreground">({items.length})</span>}</div>
              <button onClick={() => setIsOpen(false)} className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"><X className="w-5 h-5" /></button>
            </div>
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="w-20 h-20 rounded-full glass flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-muted-foreground" /></div>
                <div><p className="font-medium text-lg">{t('cartEmpty')}</p><p className="text-sm text-muted-foreground mt-1">{t('cartEmptyDesc')}</p></div>
                <Link href="/shops" onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium hover:glow-primary transition-all">{t('continueShopping')}</Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {items.map((item) => {
                    const price = item.product.discount_price ?? item.product.price;
                    return (
                      <motion.div key={item.product.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: dir === 'rtl' ? 30 : -30 }} className="flex gap-3 p-3 rounded-xl glass cinema-border">
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-secondary">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.product.image} alt={getBilingual(item.product.name, locale)} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/shops/${item.shop.slug}`} onClick={() => setIsOpen(false)} className="text-xs text-muted-foreground hover:text-primary">{getBilingual(item.shop.name, locale)}</Link>
                          <p className="font-medium text-sm truncate">{getBilingual(item.product.name, locale)}</p>
                          <p className="text-sm text-primary font-bold mt-1">{formatPrice(price, locale)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1 glass rounded-lg">
                              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:text-primary"><Minus className="w-3 h-3" /></button>
                              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:text-primary"><Plus className="w-3 h-3" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.product.id)} className="w-7 h-7 rounded-lg hover:bg-destructive/20 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="p-5 border-t border-border space-y-3">
                  {appliedCode ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <div className="flex items-center gap-2 text-sm"><Tag className="w-4 h-4 text-primary" /><span className="font-medium">{appliedCode}</span></div>
                      <button onClick={removeDiscount} className="text-xs text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={codeInput} onChange={(e) => { setCodeInput(e.target.value); setCodeError(false); }} placeholder={t('discountCode')} className={cn('flex-1 h-10 px-3 rounded-lg glass border text-sm outline-none transition-colors', codeError ? 'border-destructive' : 'border-border focus:border-primary')} onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCode(); }} />
                      <button onClick={handleApplyCode} className="px-4 h-10 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors">{t('applyDiscount')}</button>
                    </div>
                  )}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>{t('subtotal')}</span><span>{formatPrice(subtotal, locale)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-primary"><span>{t('off')}</span><span>-{formatPrice(discount, locale)}</span></div>}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border"><span>{t('total')}</span><span className="cinema-gradient-text">{formatPrice(total, locale)}</span></div>
                  </div>
                  <button onClick={() => { toast.success(locale === 'fa' ? 'سفارش شما ثبت شد!' : 'Order placed successfully!'); clearCart(); setIsOpen(false); }} className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:bg-[position:100%] text-white font-bold transition-all duration-500 glow-primary">{t('checkout')}</button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
