import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function PlaceholderCard({ titleWidth }: { titleWidth: string }) {
  return (
    <Card className="lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <CardHeader className="lg:px-6 xl:px-8">
        <CardTitle className="lg:text-lg">
          <Skeleton className={`h-4 ${titleWidth}`} />
        </CardTitle>
        <CardDescription className="lg:text-base/relaxed">
          <Skeleton className="h-3 w-56" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 lg:px-6 xl:px-8 lg:text-base/relaxed">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-full" />
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
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <div className="flex flex-col gap-4">
        <PlaceholderCard titleWidth="w-28" />
        <PlaceholderCard titleWidth="w-32" />
        <PlaceholderCard titleWidth="w-40" />
      </div>
      <Card className="lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
        <CardHeader className="lg:px-6 xl:px-8">
          <CardTitle className="lg:text-lg">
            <Skeleton className="h-4 w-28" />
          </CardTitle>
          <CardDescription className="lg:text-base/relaxed">
            <Skeleton className="h-3 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 lg:px-6 xl:px-8 lg:text-base/relaxed">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
