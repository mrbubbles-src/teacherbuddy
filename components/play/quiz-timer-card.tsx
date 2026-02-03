"use client"

import { useEffect, useId, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const clampToRange = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const normalizeTimeValue = (value: string, max: number) => {
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return 0
  return clampToRange(parsed, 0, max)
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}

type QuizTimerCardProps = {
  variant?: "card" | "sidebar"
  className?: string
}

export default function QuizTimerCard({ variant = "card", className }: QuizTimerCardProps) {
  const [minutesInput, setMinutesInput] = useState("0")
  const [secondsInput, setSecondsInput] = useState("0")
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const timerId = useId()
  const isSidebar = variant === "sidebar"

  const configuredTotalSeconds = useMemo(() => {
    const minutes = normalizeTimeValue(minutesInput, 180)
    const seconds = normalizeTimeValue(secondsInput, 59)
    return minutes * 60 + seconds
  }, [minutesInput, secondsInput])

  const displaySeconds =
    remainingSeconds === null ? configuredTotalSeconds : remainingSeconds

  useEffect(() => {
    if (!isRunning) return
    if (remainingSeconds === null) {
      setRemainingSeconds(configuredTotalSeconds)
      return
    }
    if (remainingSeconds <= 0) {
      setIsRunning(false)
      return
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => (current === null ? null : current - 1))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [configuredTotalSeconds, isRunning, remainingSeconds])

  const hasTimeConfigured = configuredTotalSeconds > 0

  const handleStartPause = () => {
    if (!hasTimeConfigured && remainingSeconds === null) return
    if (!isRunning && remainingSeconds === 0) {
      setRemainingSeconds(null)
    }
    setIsRunning((prev) => !prev)
  }

  const handleReset = () => {
    setIsRunning(false)
    setRemainingSeconds(null)
  }

  const handleMinutesChange = (value: string) => {
    setMinutesInput(value)
    setRemainingSeconds(null)
  }

  const handleSecondsChange = (value: string) => {
    setSecondsInput(value)
    setRemainingSeconds(null)
  }

  return (
    <Card className={className}>
      <CardHeader className={isSidebar ? "pb-2" : undefined}>
        <CardTitle className={isSidebar ? "text-sm" : undefined}>Quick Timer</CardTitle>
        {!isSidebar ? (
          <CardDescription>
            Set a countdown timer for practice rounds or timed quizzes.
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className={isSidebar ? "flex flex-col gap-3" : "flex flex-col gap-4"}>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
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
              max={180}
              value={minutesInput}
              onChange={(event) => handleMinutesChange(event.target.value)}
              placeholder="0"
            />
          </div>
          <div className="hidden text-center text-sm font-semibold text-muted-foreground sm:block">
            :
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
            />
          </div>
        </div>

        <div
          className={
            isSidebar
              ? "rounded-lg border border-dashed border-border/60 bg-background/60 px-3 py-4 text-center"
              : "rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center"
          }
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Remaining
          </p>
          <p
            className={
              isSidebar
                ? "mt-2 text-2xl font-semibold tabular-nums"
                : "mt-2 text-3xl font-semibold tabular-nums"
            }
          >
            {formatTime(displaySeconds)}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={handleStartPause}
            disabled={!hasTimeConfigured && remainingSeconds === null}
            className="sm:flex-1"
          >
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant="secondary" onClick={handleReset} className="sm:flex-1">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
