import { useEffect, useMemo, useState } from 'react';

import { ThemeProviderContext } from './theme-context';
import type { Theme } from './theme-context';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        root.classList.add(systemTheme.matches ? 'dark' : 'light');
        return;
      }

      root.classList.add(theme);
    };

    updateTheme();

    systemTheme.addEventListener('change', updateTheme);

    return () => {
      systemTheme.removeEventListener('change', updateTheme);
    };
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      },
    }),
    [theme, storageKey],
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
