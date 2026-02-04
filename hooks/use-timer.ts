"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { clearTimer, loadTimer, saveTimer } from "@/lib/storage"

const clampToRange = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const normalizeTimeValue = (value: string, max: number) => {
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return 0
  return clampToRange(parsed, 0, max)
}

export const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

const DEFAULT_ALERT_THRESHOLDS = [600, 300, 60, 0]

export type UseTimerOptions = {
  alertThresholds?: number[]
  alertDuration?: number
}

export type UseTimerReturn = {
  displaySeconds: number
  formattedTime: string
  isRunning: boolean
  isAlerting: boolean

  hours: string
  minutes: string
  seconds: string
  setHours: (value: string) => void
  setMinutes: (value: string) => void
  setSeconds: (value: string) => void

  start: () => void
  pause: () => void
  reset: () => void

  hasTimeConfigured: boolean
}

export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const {
    alertThresholds = DEFAULT_ALERT_THRESHOLDS,
    alertDuration = 5000,
  } = options

  const [hoursInput, setHoursInput] = useState("0")
  const [minutesInput, setMinutesInput] = useState("0")
  const [secondsInput, setSecondsInput] = useState("0")
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isAlerting, setIsAlerting] = useState(false)

  const alertTimeoutRef = useRef<number | null>(null)
  const alertedThresholdsRef = useRef(new Set<number>())
  const remainingSecondsRef = useRef<number | null>(null)

  // Keep ref in sync for use in interval callbacks
  // This effect is necessary because we need to read the current value
  // inside interval callbacks without triggering re-renders
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

  const hasTimeConfigured = configuredTotalSeconds > 0

  const clearAlertTimeout = useCallback(() => {
    if (alertTimeoutRef.current !== null) {
      window.clearTimeout(alertTimeoutRef.current)
      alertTimeoutRef.current = null
    }
  }, [])

  const resetAlerts = useCallback(() => {
    alertedThresholdsRef.current.clear()
    clearAlertTimeout()
    setIsAlerting(false)
  }, [clearAlertTimeout])

  const triggerAlert = useCallback(() => {
    setIsAlerting(true)
    clearAlertTimeout()
    alertTimeoutRef.current = window.setTimeout(() => {
      setIsAlerting(false)
      alertTimeoutRef.current = null
    }, alertDuration)
  }, [alertDuration, clearAlertTimeout])

  const checkAlertThreshold = useCallback(
    (seconds: number) => {
      if (!alertThresholds.includes(seconds)) return
      if (alertedThresholdsRef.current.has(seconds)) return
      alertedThresholdsRef.current.add(seconds)
      triggerAlert()
    },
    [alertThresholds, triggerAlert]
  )

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

  // Main timer effect - handles interval and alert checking
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
      setRemainingSeconds((current) => {
        if (current === null) return null
        const next = current - 1
        // Check alert threshold inline
        checkAlertThreshold(next)
        return next
      })
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
  }, [configuredTotalSeconds, isRunning, remainingSeconds, checkAlertThreshold])

  // Cleanup alert timeout on unmount
  useEffect(() => {
    return () => {
      clearAlertTimeout()
    }
  }, [clearAlertTimeout])

  const handleTimeInputChange = useCallback(
    (setter: (value: string) => void, value: string) => {
      setter(value)
      setIsRunning(false)
      setRemainingSeconds(null)
      resetAlerts()
      clearTimer()
    },
    [resetAlerts]
  )

  const start = useCallback(() => {
    if (!hasTimeConfigured) return
    const startFrom =
      remainingSeconds === null || remainingSeconds === 0
        ? configuredTotalSeconds
        : remainingSeconds
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
  }, [hasTimeConfigured, remainingSeconds, configuredTotalSeconds, resetAlerts])

  const pause = useCallback(() => {
    setIsRunning(false)
    if (remainingSeconds !== null && remainingSeconds > 0) {
      saveTimer({
        configuredTotalSeconds,
        remainingSeconds,
        isRunning: false,
        savedAt: Date.now(),
      })
    }
  }, [configuredTotalSeconds, remainingSeconds])

  const reset = useCallback(() => {
    setIsRunning(false)
    setRemainingSeconds(null)
    resetAlerts()
    clearTimer()
  }, [resetAlerts])

  return {
    displaySeconds,
    formattedTime: formatTime(displaySeconds),
    isRunning,
    isAlerting,

    hours: hoursInput,
    minutes: minutesInput,
    seconds: secondsInput,
    setHours: (value: string) => handleTimeInputChange(setHoursInput, value),
    setMinutes: (value: string) => handleTimeInputChange(setMinutesInput, value),
    setSeconds: (value: string) => handleTimeInputChange(setSecondsInput, value),

    start,
    pause,
    reset,

    hasTimeConfigured,
  }
}
