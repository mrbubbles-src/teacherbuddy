"use client"

import { useEffect, useState } from "react"

const DEFAULT_BREAKPOINT = 768

export function useIsMobile(breakpoint = DEFAULT_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const query = `(max-width: ${breakpoint - 1}px)`
    const media = window.matchMedia(query)

    const update = () => setIsMobile(media.matches)
    update()

    if (media.addEventListener) {
      media.addEventListener("change", update)
      return () => media.removeEventListener("change", update)
    }

    media.addListener(update)
    return () => media.removeListener(update)
  }, [breakpoint])

  return isMobile
}
