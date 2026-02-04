'use client';

import { cn } from '@/lib/utils';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import {
  ChevronDownIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTimer } from '@/hooks/use-timer';

const TICKING_SRC = '/sounds/alarm-clock-ticking.mp3';
const ALARM_SRC = '/sounds/alarm.mp3';
const DEFAULT_VOLUME = 0.05;

export default function QuizTimerCard() {
  const timerId = useId();
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
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

    // Stop both sounds when paused or reset (displaySeconds no longer 0 = reset)
    if (!isRunning) {
      ticking.pause();
      ticking.currentTime = 0;
    }
    if (displaySeconds !== 0) {
      alarm.pause();
      alarm.currentTime = 0;
    }

    // Ticking: play while alerting and running
    if (isAlerting && isRunning) {
      ticking.loop = true;
      ticking.play().catch(() => {});
    } else {
      ticking.pause();
      ticking.currentTime = 0;
    }

    // Alarm: play once when transitioning from >0 to 0
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
          className="w-[min(92vw,24rem)] p-4 md:w-96 lg:w-[26rem] xl:w-[28rem] 2xl:w-[30rem]">
          <div>
            <p className="px-0 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-sm">
              Set timer
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${timerId}-hours`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-sm">
                  Hours
                </label>
                <Input
                  id={`${timerId}-hours`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={99}
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  placeholder="0"
                  className="h-9 text-base md:text-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${timerId}-minutes`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-sm">
                  Minutes
                </label>
                <Input
                  id={`${timerId}-minutes`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  placeholder="0"
                  className="h-9 text-base md:text-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${timerId}-seconds`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-sm">
                  Seconds
                </label>
                <Input
                  id={`${timerId}-seconds`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={59}
                  value={seconds}
                  onChange={(event) => setSeconds(event.target.value)}
                  placeholder="0"
                  className="h-9 text-base md:text-lg"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="px-0 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-sm">
              Volume
            </p>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(volume * 100)}
                onChange={handleVolumeChange}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
                aria-label="Timer volume"
              />
              <span className="w-8 text-right text-sm tabular-nums text-muted-foreground md:text-base">
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
        <PlayIcon className="size-5" />
      </Button>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={pause}
        disabled={!isRunning}
        aria-label="Pause timer">
        <PauseIcon className="size-5" />
      </Button>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={reset}
        aria-label="Reset timer">
        <RotateCcwIcon className="size-5" />
      </Button>
    </div>
  );
}
