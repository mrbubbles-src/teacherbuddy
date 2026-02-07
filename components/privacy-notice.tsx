'use client';

import {
  isPrivacyNoticeAcknowledged,
  setPrivacyNoticeAcknowledged,
} from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

/**
 * One-time privacy notice shown on first visit. Renders as a compact bar at
 * the bottom center so the site stays usable. Explains that nothing is
 * tracked or sent off-site and that data is stored locally. Dismissal is
 * stored in local storage so the notice does not show again unless storage
 * is cleared.
 */
export default function PrivacyNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isPrivacyNoticeAcknowledged()) {
      setOpen(true);
    }
  }, []);

  function handleUnderstood() {
    setPrivacyNoticeAcknowledged();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2',
        'rounded-lg border border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm',
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
      )}>
      <p className="text-muted-foreground text-sm">
        Nothing is tracked or sent anywhere. Everything is saved in your
        browser&apos;s local storage only.
      </p>
      <Button size="sm" onClick={handleUnderstood} className="shrink-0">
        Understood
      </Button>
    </div>
  );
}
