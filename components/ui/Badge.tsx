'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'orange';

interface BadgeProps extends Omit<HTMLMotionProps<'span'>, 'children'> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = 'neutral', children, className = '', ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none cursor-default touch-manipulation';
  
  const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80 shadow-sm shadow-emerald-500/5',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800/80 shadow-sm shadow-amber-500/5',
    error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/80 shadow-sm shadow-rose-500/5',
    info: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200/80 dark:border-cyan-800/80 shadow-sm shadow-cyan-500/5',
    neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 shadow-sm shadow-slate-500/5',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200/80 dark:border-orange-800/80 shadow-sm shadow-orange-500/5',
  };

  return (
    <motion.span 
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
      {...props}
    >
      {children}
    </motion.span>
  );
}


