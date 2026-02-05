import Link from "next/link"

import { Button } from "@/components/ui/button"

/**
 * Renders the application 404 page for unknown routes.
 * Guides users back to the dashboard to continue their workflow.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-12 text-center">
      <p className="text-8xl font-semibold tabular-nums tracking-tight text-muted-foreground/40">
        404
      </p>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Page not found
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          This page doesn&apos;t exist or was moved.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Head back to the dashboard to manage students, quizzes, or pick a
          workflow.
        </p>
      </div>
      <Button className="sm:min-w-32" render={<Link href="/" />}>
        Back to Dashboard
      </Button>
    </div>
  )
}
