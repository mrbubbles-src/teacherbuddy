'use client';

import { cn } from '@/lib/utils';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import {
  ChevronDownIcon,
  HeartIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  Volume2Icon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTimer } from '@/hooks/use-timer';
import { loadTimerFavorites, saveTimerFavorites } from '@/lib/storage';

const TICKING_SRC = '/sounds/alarm-clock-ticking.mp3';
const ALARM_SRC = '/sounds/alarm.mp3';
const DEFAULT_VOLUME = 0.05;

/** All available presets (label + total seconds). */
const PRESETS = [
  { label: '30s', totalSeconds: 30 },
  { label: '1m', totalSeconds: 60 },
  { label: '2m', totalSeconds: 120 },
  { label: '3m', totalSeconds: 180 },
  { label: '5m', totalSeconds: 300 },
  { label: '10m', totalSeconds: 600 },
  { label: '15m', totalSeconds: 900 },
  { label: '20m', totalSeconds: 1200 },
  { label: '25m', totalSeconds: 1500 },
  { label: '30m', totalSeconds: 1800 },
  { label: '45m', totalSeconds: 2700 },
  { label: '1h', totalSeconds: 3600 },
] as const;

/**
 * Converts total seconds into { hours, minutes, seconds } string values
 * suitable for the useTimer hook setters.
 */
function secondsToHMS(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { hours: String(h), minutes: String(m), seconds: String(s) };
}

/** Formats seconds as a human-readable label like "5m" or "1h 30m". */
function formatPresetLabel(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0) parts.push(`${s}s`);
  return parts.join(' ') || '0s';
}

/**
 * Renders the classroom timer controls used in the app header.
 * Supports preset favorites, editable time fields, stepper-based adjustment,
 * volume control, and start/pause/reset actions with alert sounds.
 */
export default function QuizTimerCard() {
  const timerId = useId();
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [favorites, setFavorites] = useState<number[]>([60, 300, 900]);
  const tickingRef = useRef<HTMLAudioElement | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const prevDisplaySecondsRef = useRef<number | null>(null);

  const {
    formattedTime,
    displaySeconds,
    isRunning,
    isAlerting,
    hours,
    minutes,
    seconds,
    setHours,
    setMinutes,
    setSeconds,
    start,
    pause,
    reset,
    hasTimeConfigured,
  } = useTimer();

  /** Current configured total in seconds (from the string inputs). */
  const configuredTotal =
    (Number.parseInt(hours, 10) || 0) * 3600 +
    (Number.parseInt(minutes, 10) || 0) * 60 +
    (Number.parseInt(seconds, 10) || 0);

  // Load favorites from localStorage on mount
  useEffect(() => {
    setFavorites(loadTimerFavorites());
  }, []);

  // Create audio elements on the client only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    tickingRef.current = new Audio(TICKING_SRC);
    alarmRef.current = new Audio(ALARM_SRC);
    return () => {
      tickingRef.current?.pause();
      alarmRef.current?.pause();
      tickingRef.current = null;
      alarmRef.current = null;
    };
  }, []);

  // Sound logic: ticking for warnings, alarm when timer hits 0; stop on pause/reset
  useEffect(() => {
    const ticking = tickingRef.current;
    const alarm = alarmRef.current;
    if (!ticking || !alarm) return;

    ticking.volume = volume;
    alarm.volume = volume;

    const prevDisplaySeconds = prevDisplaySecondsRef.current;

    if (!isRunning) {
      ticking.pause();
      ticking.currentTime = 0;
    }
    if (displaySeconds !== 0) {
      alarm.pause();
      alarm.currentTime = 0;
    }

    if (isAlerting && isRunning) {
      ticking.loop = true;
      ticking.play().catch(() => {});
    } else {
      ticking.pause();
      ticking.currentTime = 0;
    }

    if (
      displaySeconds === 0 &&
      prevDisplaySeconds !== null &&
      prevDisplaySeconds > 0
    ) {
      alarm.play().catch(() => {});
    }

    prevDisplaySecondsRef.current = displaySeconds;
  }, [isRunning, isAlerting, displaySeconds, volume]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVolume(Number(e.target.value) / 100);
    },
    [],
  );

  /** Apply a preset by setting all three time fields at once. */
  const applyPreset = useCallback(
    (totalSeconds: number) => {
      const { hours: h, minutes: m, seconds: s } = secondsToHMS(totalSeconds);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    },
    [setHours, setMinutes, setSeconds],
  );

  /** Add or subtract seconds from the current configured time. */
  const adjustTime = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(configuredTotal + delta, 359999));
      const { hours: h, minutes: m, seconds: s } = secondsToHMS(next);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    },
    [configuredTotal, setHours, setMinutes, setSeconds],
  );

  /** Toggle a value into/out of favorites. Max 3; oldest bumped when full. */
  const toggleFavorite = useCallback(
    (totalSeconds: number) => {
      setFavorites((prev) => {
        let next: number[];
        if (prev.includes(totalSeconds)) {
          // Remove it
          next = prev.filter((v) => v !== totalSeconds);
        } else if (prev.length < 3) {
          // Room available — append
          next = [...prev, totalSeconds];
        } else {
          // Full — bump the oldest (first) and append new one
          next = [...prev.slice(1), totalSeconds];
        }
        saveTimerFavorites(next);
        return next;
      });
    },
    [],
  );

  /** Auto-select input text on focus for easy overwriting. */
  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  /** Find the matching preset value string for the Select, or empty for custom. */
  const activePresetValue = PRESETS.find(
    (p) => p.totalSeconds === configuredTotal,
  )?.totalSeconds.toString() ?? '';

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-center gap-2 md:flex-nowrap md:justify-start md:gap-3 lg:gap-4">
      <Popover>
        <PopoverTrigger className="flex min-w-0 max-w-full items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm font-semibold tabular-nums shadow-xs md:max-w-none md:gap-3 md:px-4 md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
          <span
            className={cn(
              'text-foreground',
              isAlerting && 'text-destructive animate-ping',
            )}>
            {formattedTime}
          </span>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className="w-[min(92vw,22rem)] p-4 md:w-88">

          {/* Editable time fields */}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Set time
          </p>
          <div className="mt-2 flex items-center justify-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <label
                htmlFor={`${timerId}-h`}
                className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Hr
              </label>
              <input
                id={`${timerId}-h`}
                type="text"
                inputMode="numeric"
                value={hours}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setHours(v || '0');
                }}
                onFocus={handleInputFocus}
                className="h-11 w-12 rounded-lg border border-border/60 bg-background/80 text-center text-lg font-semibold tabular-nums text-foreground shadow-inner outline-none transition-colors focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <span className="mt-4 text-lg font-bold text-muted-foreground/50">:</span>
            <div className="flex flex-col items-center gap-1">
              <label
                htmlFor={`${timerId}-m`}
                className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Min
              </label>
              <input
                id={`${timerId}-m`}
                type="text"
                inputMode="numeric"
                value={minutes}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  const num = Number.parseInt(v || '0', 10);
                  setMinutes(String(Math.min(num, 59)));
                }}
                onFocus={handleInputFocus}
                className="h-11 w-12 rounded-lg border border-border/60 bg-background/80 text-center text-lg font-semibold tabular-nums text-foreground shadow-inner outline-none transition-colors focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <span className="mt-4 text-lg font-bold text-muted-foreground/50">:</span>
            <div className="flex flex-col items-center gap-1">
              <label
                htmlFor={`${timerId}-s`}
                className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Sec
              </label>
              <input
                id={`${timerId}-s`}
                type="text"
                inputMode="numeric"
                value={seconds}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  const num = Number.parseInt(v || '0', 10);
                  setSeconds(String(Math.min(num, 59)));
                }}
                onFocus={handleInputFocus}
                className="h-11 w-12 rounded-lg border border-border/60 bg-background/80 text-center text-lg font-semibold tabular-nums text-foreground shadow-inner outline-none transition-colors focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Fine-tune steppers */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-8 shrink-0 rounded-md touch-hitbox"
              onClick={() => adjustTime(-60)}
              disabled={configuredTotal < 60}
              aria-label="Subtract 1 minute">
              <MinusIcon className="size-3.5" />
            </Button>
            <button
              type="button"
              onClick={() => adjustTime(-15)}
              disabled={configuredTotal < 15}
              className="flex h-8 items-center justify-center rounded-md bg-muted/40 px-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground active:scale-95 disabled:opacity-40 touch-hitbox"
              aria-label="Subtract 15 seconds">
              <span className="text-xs font-bold">−15s</span>
            </button>
            <button
              type="button"
              onClick={() => adjustTime(15)}
              disabled={configuredTotal >= 359999}
              className="flex h-8 items-center justify-center rounded-md bg-muted/40 px-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground active:scale-95 disabled:opacity-40 touch-hitbox"
              aria-label="Add 15 seconds">
              <span className="text-xs font-bold">+15s</span>
            </button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-8 shrink-0 rounded-md touch-hitbox"
              onClick={() => adjustTime(60)}
              disabled={configuredTotal >= 359999}
              aria-label="Add 1 minute">
              <PlusIcon className="size-3.5" />
            </Button>
          </div>

          {/* Presets: Select + Favorites */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Presets
            </p>
            <div className="mt-2 flex items-center gap-2">
              {/* 3 favorite preset buttons */}
              {favorites.map((fav) => (
                <button
                  key={fav}
                  type="button"
                  onClick={() => applyPreset(fav)}
                  className={cn(
                    'group relative h-9 flex-1 rounded-md text-sm font-semibold transition-all active:scale-[0.97] touch-hitbox',
                    configuredTotal === fav
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/50 text-muted-foreground hover:bg-accent/10 hover:text-foreground',
                  )}>
                  {formatPresetLabel(fav)}
                </button>
              ))}
            </div>

            {/* Preset selector dropdown + favorite toggle */}
            <div className="mt-2 flex items-center gap-2">
              <Select
                value={activePresetValue}
                onValueChange={(v) => applyPreset(Number(v))}>
                <SelectTrigger className="h-8 flex-1 text-sm">
                  <SelectValue>
                    {activePresetValue ? formatPresetLabel(Number(activePresetValue)) : 'Custom time'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((preset) => (
                    <SelectItem
                      key={preset.totalSeconds}
                      value={preset.totalSeconds.toString()}
                      className="text-sm">
                      <span className="flex w-full items-center justify-between gap-3">
                        <span>{preset.label}</span>
                        {favorites.includes(preset.totalSeconds) ? (
                          <HeartIcon className="size-3 fill-primary text-primary" />
                        ) : null}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => {
                  if (configuredTotal > 0) toggleFavorite(configuredTotal);
                }}
                disabled={configuredTotal <= 0}
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-md transition-colors touch-hitbox',
                  favorites.includes(configuredTotal)
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted/40 text-muted-foreground hover:bg-accent/10 hover:text-foreground',
                  'disabled:opacity-40',
                )}
                title={
                  favorites.includes(configuredTotal)
                    ? 'Remove from favorites'
                    : 'Add current time to favorites'
                }
                aria-label="Toggle favorite">
                <HeartIcon
                  className={cn(
                    'size-3.5',
                    favorites.includes(configuredTotal) && 'fill-primary',
                  )}
                />
              </button>
            </div>
          </div>

          {/* Volume */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Volume2Icon className="size-3.5 text-muted-foreground" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Volume
              </p>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={handleVolumeChange}
                style={{ '--slider-pct': `${Math.round(volume * 100)}%` } as React.CSSProperties}
                className="timer-volume-slider h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted"
                aria-label="Timer volume"
              />
              <span className="w-8 text-right text-sm tabular-nums text-muted-foreground">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={start}
        disabled={!hasTimeConfigured || isRunning}
        aria-label="Start timer">
        <PlayIcon className="size-5 text-ctp-latte-green dark:text-ctp-mocha-green" />
      </Button>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={pause}
        disabled={!isRunning}
        aria-label="Pause timer">
        <PauseIcon className="size-5 text-ctp-latte-peach dark:text-ctp-mocha-peach" />
      </Button>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={reset}
        aria-label="Reset timer">
        <RotateCcwIcon className="size-5 text-ctp-latte-red dark:text-ctp-mocha-red" />
      </Button>
    </div>
  );
}
