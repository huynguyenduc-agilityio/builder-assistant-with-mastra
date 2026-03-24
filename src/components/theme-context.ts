import { createContext, useContext } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

export const useTheme = (): ThemeProviderState =>
  useContext(ThemeProviderContext);

// Returns true if dark, falls back to OS preference when theme is 'system'
export const resolveIsDark = (theme: Theme): boolean =>
  theme === 'dark' ||
  (theme === 'system' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches);
