import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Displays loading placeholders for the student roster table.
 * Preserves table dimensions while roster data hydrates.
 */
export default function StudentTableSkeleton() {
  return (
    <Card className="relative overflow-hidden rounded-xl border-border/50 lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ backgroundColor: 'var(--chart-1)', opacity: 0.6 }} />
      <CardHeader className="lg:px-6 xl:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle className="lg:text-lg">
              <Skeleton className="h-4 w-32" />
            </CardTitle>
            <CardDescription className="lg:text-base/relaxed">
              <Skeleton className="h-3 w-40" />
            </CardDescription>
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>
      <CardContent className="lg:px-6 xl:px-8 lg:text-base/relaxed">
        <div className="space-y-3">
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[2fr_1fr_1fr] gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
