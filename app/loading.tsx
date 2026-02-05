import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
        <CardHeader className="lg:px-6 xl:px-8">
          <CardTitle className="lg:text-lg">
            <Skeleton className="h-4 w-32" />
          </CardTitle>
          <CardDescription className="lg:text-base/relaxed">
            <Skeleton className="h-3 w-60" />
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="lg:py-6 xl:py-8 lg:gap-6 xl:gap-8">
            <CardHeader className="flex flex-row items-start justify-between gap-2 lg:px-6 xl:px-8">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3 lg:px-6 xl:px-8 lg:text-base/relaxed">
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-7 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
