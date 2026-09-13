'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'pinkPill';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-pink/40 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer touch-manipulation';
  
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4 py-2 text-sm font-medium gap-2',
    lg: 'px-5 py-2.5 text-base font-semibold gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-brand-navy-dark dark:bg-brand-navy-light hover:bg-brand-navy-light dark:hover:bg-slate-700 text-white shadow-sm hover:shadow-md hover:shadow-brand-navy/20 border border-brand-navy-muted dark:border-slate-700',
    secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700 shadow-sm',
    outline: 'bg-transparent border border-slate-300 dark:border-slate-700 hover:border-brand-pink/50 dark:hover:border-brand-pink/50 hover:bg-brand-pink/5 hover:text-brand-pink text-slate-700 dark:text-slate-200 shadow-sm',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md hover:shadow-rose-500/20',
    ghost: 'bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
    pinkPill: 'bg-gradient-to-r from-brand-pink-gradientStart to-brand-pink-gradientEnd text-white shadow-md shadow-brand-pink/25 hover:shadow-lg hover:shadow-brand-pink/40 rounded-full font-semibold',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.92, y: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}


