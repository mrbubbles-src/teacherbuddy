import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { formatTime, useTimer } from "@/hooks/use-timer"

describe("formatTime", () => {
  it("formats 0 seconds as 00:00:00", () => {
    expect(formatTime(0)).toBe("00:00:00")
  })

  it("formats 1 second as 00:00:01", () => {
    expect(formatTime(1)).toBe("00:00:01")
  })

  it("formats 59 seconds as 00:00:59", () => {
    expect(formatTime(59)).toBe("00:00:59")
  })

  it("formats 60 seconds as 00:01:00", () => {
    expect(formatTime(60)).toBe("00:01:00")
  })

  it("formats 61 seconds as 00:01:01", () => {
    expect(formatTime(61)).toBe("00:01:01")
  })

  it("formats 3599 seconds as 00:59:59", () => {
    expect(formatTime(3599)).toBe("00:59:59")
  })

  it("formats 3600 seconds as 01:00:00", () => {
    expect(formatTime(3600)).toBe("01:00:00")
  })

  it("formats 3661 seconds as 01:01:01", () => {
    expect(formatTime(3661)).toBe("01:01:01")
  })

  it("pads single digits with zeros", () => {
    expect(formatTime(3723)).toBe("01:02:03")
  })

  it("handles large values", () => {
    expect(formatTime(36000)).toBe("10:00:00")
    expect(formatTime(86399)).toBe("23:59:59")
    expect(formatTime(90061)).toBe("25:01:01")
  })
})

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("initialization", () => {
    it("initializes with default values", () => {
      const { result } = renderHook(() => useTimer())

      expect(result.current.hours).toBe("0")
      expect(result.current.minutes).toBe("0")
      expect(result.current.seconds).toBe("0")
      expect(result.current.isRunning).toBe(false)
      expect(result.current.displaySeconds).toBe(0)
      expect(result.current.formattedTime).toBe("00:00:00")
      expect(result.current.hasTimeConfigured).toBe(false)
      expect(result.current.isAlerting).toBe(false)
    })
  })

  describe("setHours/setMinutes/setSeconds", () => {
    it("updates hours input value", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setHours("2")
      })

      expect(result.current.hours).toBe("2")
    })

    it("updates minutes input value", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setMinutes("30")
      })

      expect(result.current.minutes).toBe("30")
    })

    it("updates seconds input value", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setSeconds("45")
      })

      expect(result.current.seconds).toBe("45")
    })

    it("calculates configuredTotalSeconds from inputs", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setHours("1")
        result.current.setMinutes("30")
        result.current.setSeconds("15")
      })

      expect(result.current.displaySeconds).toBe(5415) // 1*3600 + 30*60 + 15
    })

    it("hasTimeConfigured is true when time > 0", () => {
      const { result } = renderHook(() => useTimer())

      expect(result.current.hasTimeConfigured).toBe(false)

      act(() => {
        result.current.setMinutes("1")
      })

      expect(result.current.hasTimeConfigured).toBe(true)
    })
  })

  describe("start", () => {
    it("sets isRunning to true", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setMinutes("5")
      })

      act(() => {
        result.current.start()
      })

      expect(result.current.isRunning).toBe(true)
    })

    it("does nothing when no time configured", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.start()
      })

      expect(result.current.isRunning).toBe(false)
    })

    it("saves state to localStorage", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setMinutes("5")
      })

      act(() => {
        result.current.start()
      })

      expect(localStorage.setItem).toHaveBeenCalled()
    })
  })

  describe("pause", () => {
    it("sets isRunning to false", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setMinutes("5")
      })

      act(() => {
        result.current.start()
      })

      expect(result.current.isRunning).toBe(true)

      act(() => {
        result.current.pause()
      })

      expect(result.current.isRunning).toBe(false)
    })

    it("saves paused state to localStorage", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setMinutes("5")
      })

      act(() => {
        result.current.start()
      })

      vi.clearAllMocks()

      act(() => {
        result.current.pause()
      })

      expect(localStorage.setItem).toHaveBeenCalled()
    })
  })

  describe("reset", () => {
    it("clears running state", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setMinutes("5")
      })

      act(() => {
        result.current.start()
      })

      expect(result.current.isRunning).toBe(true)

      act(() => {
        result.current.reset()
      })

      expect(result.current.isRunning).toBe(false)
    })

    it("clears localStorage", () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setMinutes("5")
      })

      act(() => {
        result.current.start()
      })

      vi.clearAllMocks()

      act(() => {
        result.current.reset()
      })

      expect(localStorage.removeItem).toHaveBeenCalled()
    })
  })

  describe("countdown behavior", () => {
    it("decrements remainingSeconds every second when running", async () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setSeconds("10")
      })

      act(() => {
        result.current.start()
      })

      const initialSeconds = result.current.displaySeconds

      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.displaySeconds).toBe(initialSeconds - 1)

      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.displaySeconds).toBe(initialSeconds - 2)
    })

    it("stops at 0", async () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setSeconds("3")
      })

      act(() => {
        result.current.start()
      })

      // Advance time in steps to allow state updates to propagate
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.displaySeconds).toBe(0)
      expect(result.current.isRunning).toBe(false)
    })
  })

  describe("input change resets timer", () => {
    it("resets timer when hours input changes", async () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setMinutes("5")
      })

      act(() => {
        result.current.start()
      })

      await act(async () => {
        vi.advanceTimersByTime(2000)
      })

      act(() => {
        result.current.setHours("1")
      })

      expect(result.current.isRunning).toBe(false)
    })

    it("resets timer when minutes input changes", async () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setMinutes("5")
      })

      act(() => {
        result.current.start()
      })

      await act(async () => {
        vi.advanceTimersByTime(2000)
      })

      act(() => {
        result.current.setMinutes("10")
      })

      expect(result.current.isRunning).toBe(false)
    })

    it("resets timer when seconds input changes", async () => {
      const { result } = renderHook(() => useTimer())

      act(() => {
        result.current.setMinutes("5")
      })

      act(() => {
        result.current.start()
      })

      await act(async () => {
        vi.advanceTimersByTime(2000)
      })

      act(() => {
        result.current.setSeconds("30")
      })

      expect(result.current.isRunning).toBe(false)
    })
  })
})
