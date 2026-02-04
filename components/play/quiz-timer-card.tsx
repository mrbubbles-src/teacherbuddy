"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { ChevronDownIcon, PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react"

import { clearTimer, loadTimer, saveTimer } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const clampToRange = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const normalizeTimeValue = (value: string, max: number) => {
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return 0
  return clampToRange(parsed, 0, max)
}

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

const alertThresholds = [600, 300, 60, 0]

export default function QuizTimerCard() {
  const [hoursInput, setHoursInput] = useState("0")
  const [minutesInput, setMinutesInput] = useState("0")
  const [secondsInput, setSecondsInput] = useState("0")
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isAlerting, setIsAlerting] = useState(false)
  const timerId = useId()
  const alertTimeoutRef = useRef<number | null>(null)
  const alertedThresholdsRef = useRef(new Set<number>())
  const remainingSecondsRef = useRef<number | null>(null)

  useEffect(() => {
    remainingSecondsRef.current = remainingSeconds
  }, [remainingSeconds])

  const configuredTotalSeconds = useMemo(() => {
    const hours = normalizeTimeValue(hoursInput, 99)
    const minutes = normalizeTimeValue(minutesInput, 59)
    const seconds = normalizeTimeValue(secondsInput, 59)
    return hours * 3600 + minutes * 60 + seconds
  }, [hoursInput, minutesInput, secondsInput])

  const displaySeconds =
    remainingSeconds === null ? configuredTotalSeconds : remainingSeconds

  // Restore timer from localStorage on mount
  useEffect(() => {
    const stored = loadTimer()
    if (!stored) return
    const total = stored.configuredTotalSeconds
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const seconds = total % 60
    let remaining = stored.remainingSeconds
    if (stored.isRunning && stored.savedAt) {
      const elapsed = Math.floor((Date.now() - stored.savedAt) / 1000)
      remaining = Math.max(0, stored.remainingSeconds - elapsed)
    }
    queueMicrotask(() => {
      setHoursInput(String(hours))
      setMinutesInput(String(minutes))
      setSecondsInput(String(seconds))
      setRemainingSeconds(remaining <= 0 ? null : remaining)
      setIsRunning(remaining > 0 && stored.isRunning)
      if (remaining <= 0) clearTimer()
    })
  }, [])

  useEffect(() => {
    if (!isRunning) return
    if (remainingSeconds === null) {
      queueMicrotask(() => setRemainingSeconds(configuredTotalSeconds))
      return
    }
    if (remainingSeconds <= 0) {
      queueMicrotask(() => {
        setIsRunning(false)
        clearTimer()
      })
      return
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => (current === null ? null : current - 1))
    }, 1000)

    const saveInterval = window.setInterval(() => {
      const current = remainingSecondsRef.current
      if (current !== null && current > 0) {
        saveTimer({
          configuredTotalSeconds,
          remainingSeconds: current,
          isRunning: true,
          savedAt: Date.now(),
        })
      }
    }, 60_000)

    return () => {
      window.clearInterval(interval)
      window.clearInterval(saveInterval)
    }
  }, [configuredTotalSeconds, isRunning, remainingSeconds])

  useEffect(() => {
    if (remainingSeconds === null) return
    if (!alertThresholds.includes(remainingSeconds)) return
    if (alertedThresholdsRef.current.has(remainingSeconds)) return
    alertedThresholdsRef.current.add(remainingSeconds)
    queueMicrotask(() => setIsAlerting(true))

    if (alertTimeoutRef.current !== null) {
      window.clearTimeout(alertTimeoutRef.current)
    }

    alertTimeoutRef.current = window.setTimeout(() => {
      setIsAlerting(false)
      alertTimeoutRef.current = null
    }, 5000)
  }, [remainingSeconds])

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current !== null) {
        window.clearTimeout(alertTimeoutRef.current)
      }
    }
  }, [])

  const hasTimeConfigured = configuredTotalSeconds > 0

  const resetAlerts = () => {
    alertedThresholdsRef.current.clear()
    if (alertTimeoutRef.current !== null) {
      window.clearTimeout(alertTimeoutRef.current)
      alertTimeoutRef.current = null
    }
    setIsAlerting(false)
  }

  const handleStart = () => {
    if (!hasTimeConfigured) return
    const startFrom = remainingSeconds === null || remainingSeconds === 0 ? configuredTotalSeconds : remainingSeconds
    if (remainingSeconds === null || remainingSeconds === 0) {
      resetAlerts()
      setRemainingSeconds(configuredTotalSeconds)
    }
    setIsRunning(true)
    saveTimer({
      configuredTotalSeconds,
      remainingSeconds: startFrom,
      isRunning: true,
      savedAt: Date.now(),
    })
  }

  const handlePause = () => {
    setIsRunning(false)
    if (remainingSeconds !== null && remainingSeconds > 0) {
      saveTimer({
        configuredTotalSeconds,
        remainingSeconds,
        isRunning: false,
        savedAt: Date.now(),
      })
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setRemainingSeconds(null)
    resetAlerts()
    clearTimer()
  }

  const handleHoursChange = (value: string) => {
    setHoursInput(value)
    setIsRunning(false)
    setRemainingSeconds(null)
    resetAlerts()
    clearTimer()
  }

  const handleMinutesChange = (value: string) => {
    setMinutesInput(value)
    setIsRunning(false)
    setRemainingSeconds(null)
    resetAlerts()
    clearTimer()
  }

  const handleSecondsChange = (value: string) => {
    setSecondsInput(value)
    setIsRunning(false)
    setRemainingSeconds(null)
    resetAlerts()
    clearTimer()
  }

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-4 py-2 text-lg font-semibold tabular-nums shadow-xs">
          <span
            className={cn(
              "text-foreground",
              isAlerting && "text-destructive animate-ping"
            )}
          >
            {formatTime(displaySeconds)}
          </span>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-96 p-4">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-0 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Set timer
            </DropdownMenuLabel>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${timerId}-hours`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Hours
                </label>
                <Input
                  id={`${timerId}-hours`}
                  type="number"
                  min={0}
                  max={99}
                  value={hoursInput}
                  onChange={(event) => handleHoursChange(event.target.value)}
                  placeholder="0"
                  className="h-9 text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${timerId}-minutes`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Minutes
                </label>
                <Input
                  id={`${timerId}-minutes`}
                  type="number"
                  min={0}
                  max={59}
                  value={minutesInput}
                  onChange={(event) => handleMinutesChange(event.target.value)}
                  placeholder="0"
                  className="h-9 text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${timerId}-seconds`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Seconds
                </label>
                <Input
                  id={`${timerId}-seconds`}
                  type="number"
                  min={0}
                  max={59}
                  value={secondsInput}
                  onChange={(event) => handleSecondsChange(event.target.value)}
                  placeholder="0"
                  className="h-9 text-base"
                />
              </div>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={handleStart}
        disabled={!hasTimeConfigured || isRunning}
        aria-label="Start timer"
      >
        <PlayIcon className="size-5" />
      </Button>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={handlePause}
        disabled={!isRunning}
        aria-label="Pause timer"
      >
        <PauseIcon className="size-5" />
      </Button>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={handleReset}
        aria-label="Reset timer"
      >
        <RotateCcwIcon className="size-5" />
      </Button>
    </div>
  )
}
