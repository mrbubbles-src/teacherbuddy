"use client"

import { useRouter } from "next/navigation"
import { LayoutGridIcon, UsersIcon, ShuffleIcon, ClipboardListIcon, PlayCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const cards = [
  {
    title: "Students",
    description: "Add students, mark absences, and keep your roster tidy.",
    href: "/students",
    icon: UsersIcon,
    badge: "Roster",
  },
  {
    title: "Generator",
    description: "Randomly pick a student without repeats until reset.",
    href: "/generator",
    icon: ShuffleIcon,
    badge: "Random",
  },
  {
    title: "Quiz Builder",
    description: "Create quizzes with custom questions and answers.",
    href: "/quizzes",
    icon: ClipboardListIcon,
    badge: "Create",
  },
  {
    title: "Quiz Play",
    description: "Draw a student + question, then reveal the answer.",
    href: "/play",
    icon: PlayCircleIcon,
    badge: "Live",
  },
]

export default function DashboardCards() {
  const router = useRouter()

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGridIcon className="size-4" />
            Central Dashboard
          </CardTitle>
          <CardDescription>
            Choose a workflow to manage students or run your next quiz.
          </CardDescription>
        </CardHeader>
      </Card>
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <CardTitle className="text-base">{card.title}</CardTitle>
              </div>
              <Badge variant="secondary">{card.badge}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">{card.description}</p>
              <Button
                onClick={() => router.push(card.href)}
                className="w-fit"
                size="sm"
              >
                Open {card.title}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
