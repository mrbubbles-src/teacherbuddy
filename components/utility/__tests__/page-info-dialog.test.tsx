import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import PageInfoDialog from "@/components/utility/page-info-dialog"
import { PAGE_INFOS } from "@/lib/page-info"

/**
 * Mocks window.matchMedia with a static viewport width for responsive tests.
 */
function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  })

  const matchMedia = (query: string): MediaQueryList => {
    const maxWidthMatch = query.match(/\(max-width:\s*(\d+)px\)/)
    const minWidthMatch = query.match(/\(min-width:\s*(\d+)px\)/)

    let matches = false

    if (maxWidthMatch) {
      matches = width <= Number(maxWidthMatch[1])
    }

    if (minWidthMatch) {
      matches = width >= Number(minWidthMatch[1])
    }

    const modernListenerSet = new Set<EventListenerOrEventListenerObject>()
    const legacyListenerSet = new Set<
      (this: MediaQueryList, event: MediaQueryListEvent) => void
    >()

    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: (
        _type: string,
        listener: EventListenerOrEventListenerObject | null,
      ) => {
        if (listener) modernListenerSet.add(listener)
      },
      removeEventListener: (
        _type: string,
        listener: EventListenerOrEventListenerObject | null,
      ) => {
        if (listener) modernListenerSet.delete(listener)
      },
      addListener: (
        listener: (this: MediaQueryList, event: MediaQueryListEvent) => void,
      ) => {
        legacyListenerSet.add(listener)
      },
      removeListener: (
        listener: (this: MediaQueryList, event: MediaQueryListEvent) => void,
      ) => {
        legacyListenerSet.delete(listener)
      },
      dispatchEvent: () => true,
    }
  }

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn(matchMedia),
  })
}

describe("PageInfoDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setViewportWidth(1280)
  })

  it("opens from trigger and closes from top-right X", async () => {
    const user = userEvent.setup()

    render(<PageInfoDialog currentPath="/" pages={PAGE_INFOS} />)

    await user.click(screen.getByRole("button", { name: /open page info/i }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /close info dialog/i }))

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })

  it("closes when clicking outside the dialog", async () => {
    const user = userEvent.setup()

    render(<PageInfoDialog currentPath="/" pages={PAGE_INFOS} />)

    await user.click(screen.getByRole("button", { name: /open page info/i }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    const overlay = document.querySelector("[data-slot='dialog-overlay']")
    expect(overlay).toBeInstanceOf(HTMLElement)

    await user.click(overlay as HTMLElement)

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })

  it("closes on Escape key", async () => {
    const user = userEvent.setup()

    render(<PageInfoDialog currentPath="/" pages={PAGE_INFOS} />)

    await user.click(screen.getByRole("button", { name: /open page info/i }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })

  it("uses dropdown workflow selector on small screens (<lg)", async () => {
    const user = userEvent.setup()
    setViewportWidth(900)

    render(<PageInfoDialog currentPath="/" pages={PAGE_INFOS} />)

    await user.click(screen.getByRole("button", { name: /open page info/i }))

    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument()

    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "Quiz Play" }))

    expect(
      screen.getByText((content) =>
        content.includes("live classroom view for running quizzes"),
      ),
    ).toBeInTheDocument()
  })

  it("uses tabs workflow selector on large screens (>=lg)", async () => {
    const user = userEvent.setup()
    setViewportWidth(1280)

    render(<PageInfoDialog currentPath="/" pages={PAGE_INFOS} />)

    await user.click(screen.getByRole("button", { name: /open page info/i }))

    expect(screen.getByRole("tablist")).toBeInTheDocument()
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument()

    await user.click(screen.getByRole("tab", { name: "Quiz Play" }))

    expect(
      screen.getByText((content) =>
        content.includes("live classroom view for running quizzes"),
      ),
    ).toBeInTheDocument()
  })
})
