'use client';

import { useCallback, useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <button className="theme-toggle" onClick={toggle}>
      {theme === 'light' ? 'DARK' : 'LIGHT'}
    </button>
  );
}
