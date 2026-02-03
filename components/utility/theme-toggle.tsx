'use client';

import { startVt } from '@/lib/view-transition';

import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ThemeToggle = () => {
  const { resolvedTheme, theme, setTheme, isHydrated } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const buttonLabel = isHydrated
    ? isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode'
    : 'Toggle theme';

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              id='theme-toggle'
              variant='ghost'
              size='icon'
              aria-label={buttonLabel}
              className='shadow-none hover:bg-transparent focus:bg-transparent active:bg-transparent active:*:drop-shadow-none dark:hover:bg-transparent dark:focus:bg-transparent dark:active:bg-transparent'
              onClick={(e) => {
                const next =
                  (resolvedTheme ?? theme) === 'dark' ? 'light' : 'dark';
                startVt(() => setTheme(next), e.nativeEvent);
              }}>
              <Moon
                className={`text-primary drop-shadow-secondary ${
                  isHydrated && isDark
                    ? 'scale-100 rotate-0'
                    : 'scale-0 -rotate-90'
                } absolute size-6 drop-shadow-xs transition-all duration-300 ease-in-out`}
                aria-hidden='true'
              />
              <Sun
                className={`text-secondary drop-shadow-primary ${
                  isHydrated && !isDark
                    ? 'scale-100 rotate-0'
                    : 'scale-0 rotate-90'
                } absolute size-6 drop-shadow-xs transition-all duration-300 ease-in-out`}
                aria-hidden='true'
              />
              <span className='sr-only'>
                {theme === 'dark'
                  ? 'Switch to light theme'
                  : 'Switch to dark theme'}
              </span>
            </Button>
          }
        />
        <TooltipContent side='right'>
          <span className='font-bold text-lg'>
            {theme === 'dark'
              ? 'Switch to light theme'
              : 'Switch to dark theme'}
          </span>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default ThemeToggle;
