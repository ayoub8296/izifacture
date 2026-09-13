'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Card({ 
  children, 
  className = '',
  interactive = false,
  onClick,
}: { 
  children: React.ReactNode; 
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}) {
  const baseClasses = `bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200 ${className}`;

  if (interactive) {
    return (
      <motion.div 
        onClick={onClick}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className={`${baseClasses} cursor-pointer touch-manipulation hover:shadow-xl hover:shadow-slate-200/80 dark:hover:shadow-black/50 hover:border-slate-300/80 dark:hover:border-slate-700`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={baseClasses}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-lg font-outfit font-semibold text-slate-800 dark:text-white tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}
