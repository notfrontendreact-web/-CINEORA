'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/contexts/LocaleContext';
import { Shop, TimeSlot, Reservation } from '@/lib/types';
import { fetchTimeSlots, fetchReservationsByDate, createReservation } from '@/lib/queries';
import { getBilingual } from '@/lib/i18n';
import { Calendar, Clock, Users, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ReservationSystem({ shop }: { shop: Shop }) {
  const { t, locale, dir } = useLocale();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [confirmed, setConfirmed] = useState<Reservation | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const monthNames = locale === 'fa' ? ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = locale === 'fa' ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  useEffect(() => {
    (async () => {
      try { const data = await fetchTimeSlots(shop.id); setSlots(data); } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, [shop.id]);

  useEffect(() => {
    if (slots.length === 0) return;
    (async () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      try {
        const reservations = await fetchReservationsByDate(shop.id, dateStr);
        const booked = new Set<string>();
        reservations.forEach((r) => {
          const slot = slots.find((s) => s.id === r.time_slot_id);
          if (slot) { const count = reservations.filter((rr) => rr.time_slot_id === slot.id).reduce((sum, r) => sum + r.party_size, 0); if (count >= slot.capacity) booked.add(slot.id); }
        });
        setBookedSlots(booked);
      } catch (e) { console.error(e); }
    })();
  }, [selectedDate, shop.id, slots]);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const changeMonth = (delta: number) => { const d = new Date(selectedDate); d.setMonth(d.getMonth() + delta); setSelectedDate(d); };
  const getDaysInMonth = (date: Date) => {
    const y = date.getFullYear(), m = date.getMonth();
    const first = new Date(y, m, 1), last = new Date(y, m + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < first.getDay(); i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(y, m, d));
    return days;
  };
  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();
  const isPast = (d: Date) => { const today = new Date(); today.setHours(0, 0, 0, 0); return d < today; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    try {
      const res = await createReservation({ shop_id: shop.id, time_slot_id: selectedSlot.id, customer_name: form.name, customer_email: form.email, customer_phone: form.phone || undefined, date: formatDate(selectedDate), party_size: partySize });
      setConfirmed(res); setShowForm(false); toast.success(t('reservationConfirmed'));
    } catch (e) { toast.error(locale === 'fa' ? 'خطا در ثبت رزرو' : 'Reservation failed'); console.error(e); } finally { setSubmitting(false); }
  };

  const days = getDaysInMonth(selectedDate);
  const ChevronPrev = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const ChevronNext = dir === 'rtl' ? ChevronLeft : ChevronRight;

  if (loading) return <div className="rounded-2xl glass p-8 shimmer h-96" />;

  return (
    <div className="rounded-2xl glass-strong cinema-border overflow-hidden">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"><Calendar className="w-5 h-5 text-primary" /></div>
        <div><h3 className="font-bold text-lg">{t('bookAppointment')}</h3><p className="text-sm text-muted-foreground">{getBilingual(shop.name, locale)}</p></div>
      </div>
      <AnimatePresence mode="wait">
        {confirmed ? (
          <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring' }} className="w-16 h-16 mx-auto rounded-full bg-teal/20 flex items-center justify-center mb-4"><CheckCircle2 className="w-8 h-8 text-teal" /></motion.div>
            <h4 className="text-xl font-bold mb-2">{t('reservationConfirmed')}</h4>
            <p className="text-sm text-muted-foreground mb-6">{t('reservationDesc')}</p>
            <div className="glass rounded-xl p-4 text-sm space-y-2 max-w-xs mx-auto">
              <div className="flex justify-between"><span className="text-muted-foreground">{t('selectDate')}</span><span className="font-medium">{selectedDate.toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('selectTime')}</span><span className="font-medium">{selectedSlot?.start_time}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('selectPartySize')}</span><span className="font-medium">{partySize} {t('partySize')}</span></div>
            </div>
            <button onClick={() => { setConfirmed(null); setSelectedSlot(null); setForm({ name: '', email: '', phone: '', notes: '' }); }} className="mt-6 px-6 py-2.5 rounded-lg glass hover:bg-secondary transition-colors text-sm font-medium">{t('confirm')} →</button>
          </motion.div>
        ) : showForm ? (
          <motion.form key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-2"><h4 className="font-bold">{t('confirmReservation')}</h4><button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><X className="w-4 h-4" /></button></div>
            <div className="glass rounded-lg p-3 text-sm space-y-1 mb-2">
              <div className="flex justify-between"><span className="text-muted-foreground">{t('selectDate')}</span><span>{selectedDate.toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('selectTime')}</span><span>{selectedSlot?.start_time} - {selectedSlot?.end_time}</span></div>
            </div>
            <div><label className="text-xs text-muted-foreground mb-1 block">{t('yourName')}</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-11 px-3 rounded-lg glass border border-border outline-none focus:border-primary text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">{t('yourEmail')}</label><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-11 px-3 rounded-lg glass border border-border outline-none focus:border-primary text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">{t('yourPhone')}</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-11 px-3 rounded-lg glass border border-border outline-none focus:border-primary text-sm" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">{t('notes')}</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg glass border border-border outline-none focus:border-primary text-sm resize-none" /></div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-11 rounded-lg glass hover:bg-secondary transition-colors text-sm font-medium">{t('cancel')}</button>
              <button type="submit" disabled={submitting} className="flex-1 h-11 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium hover:glow-primary transition-all disabled:opacity-50 text-sm">{submitting ? '...' : t('confirm')}</button>
            </div>
          </motion.form>
        ) : (
          <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm">{t('selectDate')}</h4>
                <div className="flex items-center gap-2">
                  <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-lg glass hover:bg-secondary flex items-center justify-center"><ChevronPrev className="w-4 h-4" /></button>
                  <span className="text-sm font-medium min-w-[100px] text-center">{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
                  <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-lg glass hover:bg-secondary flex items-center justify-center"><ChevronNext className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">{dayNames.map((d, i) => <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>)}</div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const past = isPast(day), isSelected = day.toDateString() === selectedDate.toDateString(), isCurrentDay = isToday(day);
                  return <button key={i} onClick={() => !past && setSelectedDate(day)} disabled={past} className={cn('aspect-square rounded-lg text-sm font-medium transition-all relative', isSelected ? 'bg-gradient-to-br from-primary to-accent text-white glow-primary' : past ? 'opacity-30 cursor-not-allowed' : 'glass hover:bg-secondary/80', !isSelected && isCurrentDay && 'ring-1 ring-primary')}>{day.getDate()}</button>;
                })}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {t('selectTime')}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slots.map((slot) => {
                  const isBooked = bookedSlots.has(slot.id);
                  return <button key={slot.id} onClick={() => !isBooked && setSelectedSlot(slot)} disabled={isBooked} className={cn('p-3 rounded-xl text-center transition-all border', selectedSlot?.id === slot.id ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary glow-primary' : isBooked ? 'opacity-40 cursor-not-allowed border-border bg-secondary/30' : 'glass border-border hover:border-primary/50')}>
                    <div className="text-sm font-bold">{slot.start_time}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{isBooked ? t('full') : `${slot.capacity} ${t('freeSlots')}`}</div>
                  </button>;
                })}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {t('selectPartySize')}</h4>
              <div className="flex items-center gap-3">
                <button onClick={() => setPartySize(Math.max(1, partySize - 1))} className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-secondary">-</button>
                <span className="text-lg font-bold w-12 text-center">{partySize}</span>
                <button onClick={() => setPartySize(Math.min(10, partySize + 1))} className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:bg-secondary">+</button>
                <span className="text-sm text-muted-foreground">{t('partySize')}</span>
              </div>
            </div>
            <button onClick={() => setShowForm(true)} disabled={!selectedSlot} className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:bg-[position:100%] text-white font-bold transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed glow-primary">{t('confirmReservation')}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
