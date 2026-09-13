'use client';

import { useEffect } from 'react';

export default function StorageInitializer() {
  useEffect(() => {
    // Enable :active pseudo-class on iOS Safari & mobile browsers
    const enableTouchActive = () => {};
    document.addEventListener('touchstart', enableTouchActive, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', enableTouchActive);
    };
  }, []);

  return null;
}
