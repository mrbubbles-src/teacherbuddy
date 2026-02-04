import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("initializes with isCopied as false", () => {
    const { result } = renderHook(() => useCopyToClipboard())

    expect(result.current.isCopied).toBe(false)
  })

  it("copy returns true on success", async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    let success: boolean = false
    await act(async () => {
      success = await result.current.copy("test text")
    })

    expect(success).toBe(true)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test text")
  })

  it("copy returns false on empty string", async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    let success: boolean = true
    await act(async () => {
      success = await result.current.copy("")
    })

    expect(success).toBe(false)
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
  })

  it("copy returns false on error", async () => {
    const mockError = new Error("Clipboard error")
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(mockError)

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const { result } = renderHook(() => useCopyToClipboard())

    let success: boolean = true
    await act(async () => {
      success = await result.current.copy("test text")
    })

    expect(success).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith("Failed to copy to clipboard", mockError)

    consoleSpy.mockRestore()
  })

  it("isCopied becomes true after successful copy", async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    expect(result.current.isCopied).toBe(false)

    await act(async () => {
      await result.current.copy("test text")
    })

    expect(result.current.isCopied).toBe(true)
  })

  it("isCopied resets after delay", async () => {
    const resetDelay = 2000
    const { result } = renderHook(() => useCopyToClipboard(resetDelay))

    await act(async () => {
      await result.current.copy("test text")
    })

    expect(result.current.isCopied).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(resetDelay)
    })

    expect(result.current.isCopied).toBe(false)
  })

  it("isCopied does not auto-reset when delay is 0", async () => {
    const { result } = renderHook(() => useCopyToClipboard(0))

    await act(async () => {
      await result.current.copy("test text")
    })

    expect(result.current.isCopied).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.isCopied).toBe(true)
  })

  it("reset manually clears isCopied", async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy("test text")
    })

    expect(result.current.isCopied).toBe(true)

    act(() => {
      result.current.reset()
    })

    expect(result.current.isCopied).toBe(false)
  })

  it("reset clears pending timeout", async () => {
    const resetDelay = 2000
    const { result } = renderHook(() => useCopyToClipboard(resetDelay))

    await act(async () => {
      await result.current.copy("test text")
    })

    act(() => {
      result.current.reset()
    })

    // Advance past the delay
    await act(async () => {
      vi.advanceTimersByTime(resetDelay + 100)
    })

    // Should still be false (reset was called)
    expect(result.current.isCopied).toBe(false)
  })

  it("multiple copies reset the timeout", async () => {
    const resetDelay = 2000
    const { result } = renderHook(() => useCopyToClipboard(resetDelay))

    await act(async () => {
      await result.current.copy("first text")
    })

    expect(result.current.isCopied).toBe(true)

    // Wait 1500ms (not enough to reset)
    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    expect(result.current.isCopied).toBe(true)

    // Copy again
    await act(async () => {
      await result.current.copy("second text")
    })

    // Wait another 1500ms (total 3000ms from first, but only 1500ms from second)
    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    expect(result.current.isCopied).toBe(true)

    // Wait another 600ms (now 2100ms from second copy)
    await act(async () => {
      vi.advanceTimersByTime(600)
    })

    expect(result.current.isCopied).toBe(false)
  })

  it("uses default resetDelay of 2000ms", async () => {
    const { result } = renderHook(() => useCopyToClipboard())

    await act(async () => {
      await result.current.copy("test text")
    })

    expect(result.current.isCopied).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(1999)
    })

    expect(result.current.isCopied).toBe(true)

    await act(async () => {
      vi.advanceTimersByTime(2)
    })

    expect(result.current.isCopied).toBe(false)
  })
})
