'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function SectionHeading({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode; }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div className="space-y-2">
        {icon && <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-primary font-medium mb-2">{icon}</div>}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight"><span className="cinema-gradient-text">{title}</span></h2>
        {description && <p className="text-muted-foreground text-base">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
