"use client"

import { useId } from "react"
import { ChevronDownIcon, PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react"

import { useTimer } from "@/hooks/use-timer"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function QuizTimerCard() {
  const timerId = useId()
  const {
    formattedTime,
    isRunning,
    isAlerting,
    hours,
    minutes,
    seconds,
    setHours,
    setMinutes,
    setSeconds,
    start,
    pause,
    reset,
    hasTimeConfigured,
  } = useTimer()

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-4 py-2 text-lg font-semibold tabular-nums shadow-xs">
          <span
            className={cn(
              "text-foreground",
              isAlerting && "text-destructive animate-ping"
            )}
          >
            {formattedTime}
          </span>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-96 p-4">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-0 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Set timer
            </DropdownMenuLabel>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${timerId}-hours`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Hours
                </label>
                <Input
                  id={`${timerId}-hours`}
                  type="number"
                  min={0}
                  max={99}
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  placeholder="0"
                  className="h-9 text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${timerId}-minutes`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Minutes
                </label>
                <Input
                  id={`${timerId}-minutes`}
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  placeholder="0"
                  className="h-9 text-base"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${timerId}-seconds`}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Seconds
                </label>
                <Input
                  id={`${timerId}-seconds`}
                  type="number"
                  min={0}
                  max={59}
                  value={seconds}
                  onChange={(event) => setSeconds(event.target.value)}
                  placeholder="0"
                  className="h-9 text-base"
                />
              </div>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={start}
        disabled={!hasTimeConfigured || isRunning}
        aria-label="Start timer"
      >
        <PlayIcon className="size-5" />
      </Button>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={pause}
        disabled={!isRunning}
        aria-label="Pause timer"
      >
        <PauseIcon className="size-5" />
      </Button>
      <Button
        size="icon-lg"
        variant="ghost"
        onClick={reset}
        aria-label="Reset timer"
      >
        <RotateCcwIcon className="size-5" />
      </Button>
    </div>
  )
}
