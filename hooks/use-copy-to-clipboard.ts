"use client"

import { useCallback, useRef, useState } from "react"

export type UseCopyToClipboardReturn = {
  copy: (text: string) => Promise<boolean>
  isCopied: boolean
  reset: () => void
}

/**
 * Provides clipboard copy helpers with temporary copied-state feedback.
 * Pass an optional reset delay in milliseconds and call `copy(text)` to copy.
 */
export function useCopyToClipboard(
  resetDelay: number = 2000
): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const reset = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsCopied(false)
  }, [])

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false

      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)

        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current)
        }

        if (resetDelay > 0) {
          timeoutRef.current = window.setTimeout(() => {
            setIsCopied(false)
            timeoutRef.current = null
          }, resetDelay)
        }

        return true
      } catch (error) {
        console.error("Failed to copy to clipboard", error)
        return false
      }
    },
    [resetDelay]
  )

  return { copy, isCopied, reset }
}
