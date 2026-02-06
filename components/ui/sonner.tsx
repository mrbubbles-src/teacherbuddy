'use client';

import type { ComponentProps } from 'react';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

const toastClassNames = {
  toast:
    'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
  description: 'group-[.toast]:text-muted-foreground',
  actionButton:
    'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
  cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
};

type ToasterProps = ComponentProps<typeof Sonner>;

/**
 * Renders the global Sonner toast container with theme-aware styling.
 * Mount once near the app root to enable `toast.*` notifications.
 *
 * @param props - Sonner props to customize toast placement and behavior.
 * @returns The toast container that listens for notification events.
 */
export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{ classNames: toastClassNames }}
      {...props}
    />
  );
}
