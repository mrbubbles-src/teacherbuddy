import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Displays loading placeholders for the random generator card layout.
 * Use while generator state hydrates on the client.
 */
export default function GeneratorCardSkeleton() {
  return (
    <Card className="relative overflow-hidden rounded-xl border-border/50 lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ backgroundColor: 'var(--chart-2)', opacity: 0.6 }} />
      <CardHeader className="lg:px-6 xl:px-8">
        <CardTitle className="flex items-center gap-2 lg:text-lg">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </CardTitle>
        <CardDescription className="lg:text-base/relaxed">
          <Skeleton className="h-3 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 lg:px-6 xl:px-8 lg:text-base/relaxed">
        <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center h-[160px] flex flex-col justify-center">
          <Skeleton className="mx-auto h-3 w-32" />
          <Skeleton className="mx-auto mt-3 h-6 w-48" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-7 w-full sm:min-w-32" />
          <Skeleton className="h-7 w-full sm:min-w-32" />
        </div>
      </CardContent>
    </Card>
  )
}
