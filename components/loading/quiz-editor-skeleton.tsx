import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function PlaceholderCard({ titleWidth }: { titleWidth: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className={`h-4 ${titleWidth}`} />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-3 w-56" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-full" />
      </CardContent>
    </Card>
  )
}

export default function QuizEditorSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <div className="flex flex-col gap-4">
        <PlaceholderCard titleWidth="w-28" />
        <PlaceholderCard titleWidth="w-32" />
        <PlaceholderCard titleWidth="w-40" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-4 w-28" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-3 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
