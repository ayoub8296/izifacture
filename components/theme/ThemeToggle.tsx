'use client';

import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-colors cursor-pointer touch-manipulation flex items-center justify-center ${
        isDark
          ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300 shadow-sm'
          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
      } ${className}`}
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      aria-label="Changer de thème"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.div>
    </motion.button>
  );
}
