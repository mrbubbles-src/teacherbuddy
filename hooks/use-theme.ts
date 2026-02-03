'use client';

import * as React from 'react';

export type Theme = 'dark' | 'light';

export type ThemeProviderValue = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (next: Theme) => void;
  isHydrated: boolean;
};

export const ThemeProviderContext =
  React.createContext<ThemeProviderValue | null>(null);

export function useTheme(): ThemeProviderValue {
  const context = React.useContext(ThemeProviderContext);
  if (!context) {
    throw new Error(
      'useTheme muss innerhalb des ThemeProvider verwendet werden',
    );
  }
  return context;
}
