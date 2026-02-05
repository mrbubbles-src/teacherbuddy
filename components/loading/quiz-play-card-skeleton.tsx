import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function QuizPlayCardSkeleton() {
  return (
    <Card className="lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <CardHeader className="lg:px-6 xl:px-8">
        <CardTitle className="lg:text-lg">
          <Skeleton className="h-4 w-32" />
        </CardTitle>
        <CardDescription className="lg:text-base/relaxed">
          <Skeleton className="h-3 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 lg:px-6 xl:px-8 lg:text-base/relaxed">
        <Skeleton className="h-7 w-full" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-6 w-40" />
            <Skeleton className="mt-2 h-5 w-24 rounded-full" />
          </div>
          <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-6 w-44" />
            <Skeleton className="mt-2 h-5 w-24 rounded-full" />
          </div>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/60 p-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-7 w-full sm:min-w-32" />
          <Skeleton className="h-7 w-full sm:min-w-32" />
          <Skeleton className="h-7 w-full sm:min-w-32" />
        </div>
      </CardContent>
    </Card>
  )
}
