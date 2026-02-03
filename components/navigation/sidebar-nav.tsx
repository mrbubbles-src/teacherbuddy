"use client"

import Link from "next/link"
import { LayoutGridIcon, UsersIcon, ShuffleIcon, ClipboardListIcon, PlayCircleIcon } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutGridIcon,
  },
  {
    title: "Students",
    href: "/students",
    icon: UsersIcon,
  },
  {
    title: "Generator",
    href: "/generator",
    icon: ShuffleIcon,
  },
  {
    title: "Quizzes",
    href: "/quizzes",
    icon: ClipboardListIcon,
  },
  {
    title: "Play",
    href: "/play",
    icon: PlayCircleIcon,
  },
]

export function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              render={<Link href={item.href} />}
              isActive={isActive}
              title={item.title}
            >
              <Icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
