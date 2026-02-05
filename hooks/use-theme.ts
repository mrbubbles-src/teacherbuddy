'use client';

import * as React from 'react';

export type Theme = 'dark' | 'light';

export type ThemeProviderValue = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (next: Theme) => void;
  isHydrated: boolean;
};

/**
 * Shared context for accessing app theme state and updater functions.
 * Provided by `ThemeProvider` and consumed via `useTheme`.
 */
export const ThemeProviderContext =
  React.createContext<ThemeProviderValue | null>(null);

/**
 * Returns the active theme context from `ThemeProvider`.
 * Throws when called outside the provider boundary.
 */
export function useTheme(): ThemeProviderValue {
  const context = React.useContext(ThemeProviderContext);
  if (!context) {
    throw new Error(
      'useTheme muss innerhalb des ThemeProvider verwendet werden',
    );
  }
  return context;
}
