'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  bgColor,
  trend,
  className = '',
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.93, y: 2 }}
      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
      className={`touch-manipulation ${className}`}
    >
      <Card className="group relative transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/80 dark:hover:shadow-black/50 hover:border-brand-pink/40 border-slate-200/80 dark:border-slate-800 cursor-pointer select-none">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-outfit transition-colors group-hover:text-slate-500 dark:group-hover:text-slate-300">
                {title}
              </span>
              <span className="text-2xl font-outfit font-bold text-slate-800 dark:text-white tracking-tight block group-hover:text-brand-pink transition-colors">
                {value}
              </span>
            </div>
            
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.15 }}
              whileTap={{ rotate: -15, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className={`p-3 rounded-2xl ${bgColor} dark:bg-slate-800 flex items-center justify-center shadow-sm`}
            >
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </motion.div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {trend && (
              <span className={`font-semibold px-2 py-0.5 rounded-full transition-all ${
                trend.isPositive 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60' 
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60'
              }`}>
                {trend.value}
              </span>
            )}
            <span className="text-slate-400 dark:text-slate-500 font-medium group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors">{subtitle}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
