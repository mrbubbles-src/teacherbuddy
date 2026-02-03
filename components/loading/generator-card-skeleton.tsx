import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GeneratorCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-3 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center">
          <Skeleton className="mx-auto h-3 w-32" />
          <Skeleton className="mx-auto mt-3 h-8 w-48" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-7 w-full sm:flex-1" />
          <Skeleton className="h-7 w-full sm:flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}
