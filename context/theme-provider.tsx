'use client';

import type { Theme, ThemeProviderValue } from '@/hooks/use-theme';

import * as React from 'react';

import {
  ThemeProviderProps as NextThemeProviderProps,
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from 'next-themes';

import { ThemeProviderContext } from '@/hooks/use-theme';

// Bridges next-themes into our custom ThemeProviderContext expected by useTheme()
function ThemeBridge({ children }: { children: React.ReactNode }) {
  const next = useNextTheme(); // { theme, setTheme, resolvedTheme, systemTheme, themes }
  const [isHydrated, setIsHydrated] = React.useState(false);
  React.useEffect(() => setIsHydrated(true), []);

  // Build a typed value; default `theme` to "system" to satisfy Theme (no undefined)
  const value: ThemeProviderValue = {
    theme: (next.theme ?? 'system') as Theme,
    setTheme: next.setTheme,
    resolvedTheme: (next.resolvedTheme ?? next.theme ?? 'dark') as Theme,
    isHydrated,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function ThemeProvider({
  children,
  ...props
}: NextThemeProviderProps & { children: React.ReactNode }) {
  return (
    <NextThemesProvider {...props}>
      <ThemeBridge>{children}</ThemeBridge>
    </NextThemesProvider>
  );
}
