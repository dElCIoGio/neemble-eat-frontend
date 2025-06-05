"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
                className,
                ...props
              }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
      <TabsPrimitive.Root
          data-slot="tabs"
          className={cn("flex flex-col gap-2", className)}
          {...props}
      />
  )
}

function TabsList({
                    className,
                    ...props
                  }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
      <TabsPrimitive.List
          data-slot="tabs-list"
          className={cn(
              "bg-transparent space-x-2 text-muted-foreground inline-flex justify-start h-9 w-fit items-center rounded-lg p-[3px]",
              className
          )}
          {...props}
      />
  )
}

function TabsTrigger({
                       className,
                       ...props
                     }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
      <TabsPrimitive.Trigger
          data-slot="tabs-trigger"
          className={cn(
              "border-[1.5px] data-[state=inactive]:bg-zinc-100 data-[state=inactive]:text-zinc-600 items-center data-[state=active]:bg-purple-100 data-[state=active]:text-purple-600 data-[state=active]:border-purple-200 w-fit dark:data-[state=active]:text-foreground focus-visible:border-ring rounded-full focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:text-muted-foreground justify-center px-4 py-1 h-fit text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              className
          )}
          {...props}
      />
  )
}

function TabsContent({
                       className,
                       ...props
                     }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
      <TabsPrimitive.Content
          data-slot="tabs-content"
          className={cn("flex-1 outline-none", className)}
          {...props}
      />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
