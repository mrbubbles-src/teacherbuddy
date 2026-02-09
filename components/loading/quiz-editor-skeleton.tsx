import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Renders one placeholder card matching the merged quiz builder form card.
 */
function BuilderPlaceholderCard() {
  return (
    <Card className="relative overflow-hidden rounded-xl border-border/50 lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ backgroundColor: 'var(--chart-3)', opacity: 0.6 }} />
      <CardHeader className="lg:px-6 xl:px-8">
        <CardTitle className="lg:text-lg">
          <Skeleton className="h-4 w-32" />
        </CardTitle>
        <CardDescription className="lg:text-base/relaxed">
          <Skeleton className="h-3 w-72" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 lg:px-6 xl:px-8 lg:text-base/relaxed">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-5/12" />
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-7 w-6/12" />
        <Skeleton className="h-2.5 w-14" />
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  )
}

/**
 * Displays loading placeholders for the quiz editor split layout.
 * Mirrors the editor and question table structure before hydration.
 */
export default function QuizEditorSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <BuilderPlaceholderCard />
      <Card className="relative overflow-hidden rounded-xl border-border/50 lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ backgroundColor: 'var(--chart-3)', opacity: 0.6 }} />
        <CardHeader className="lg:px-6 xl:px-8">
          <CardTitle className="lg:text-lg">
            <Skeleton className="h-4 w-28" />
          </CardTitle>
          <CardDescription className="lg:text-base/relaxed">
            <Skeleton className="h-3 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 lg:px-6 xl:px-8 lg:text-base/relaxed">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
