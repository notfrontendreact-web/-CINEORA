'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale } from '@/lib/types';
import { translations, getDirection, TranslationKey } from '@/lib/i18n';

interface LocaleContextValue {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fa');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('locale') as Locale) : null;
    if (saved === 'fa' || saved === 'en') setLocaleState(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const dir = getDirection(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.classList.toggle('rtl', dir === 'rtl');
    localStorage.setItem('locale', locale);
  }, [locale, mounted]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggleLocale = useCallback(() => setLocaleState((p) => (p === 'fa' ? 'en' : 'fa')), []);
  const t = useCallback((key: TranslationKey) => translations[locale][key] || translations.en[key] || key, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, dir: getDirection(locale), setLocale, toggleLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
