import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-3 w-72" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-7 w-full sm:w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-3 w-56" />
        </div>
      </CardContent>
    </Card>
  )
}
