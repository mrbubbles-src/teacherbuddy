"use client"

import { useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Keep for debugging in case a runtime error occurs in production.
    console.error("TeacherBuddy error boundary:", error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Something went wrong
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          We couldn&apos;t load this page.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again, or return to the dashboard and pick a different workflow.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={reset} className="sm:min-w-32">
          Try Again
        </Button>
        <Button
          variant="secondary"
          className="sm:min-w-32"
          render={<Link href="/" />}
        >
          Dashboard
        </Button>
      </div>
    </div>
  )
}
