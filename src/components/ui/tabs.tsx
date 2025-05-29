import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import {cn} from "@/lib/utils"

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
  // The bg was set on the className below
  return (
      <TabsPrimitive.List
          data-slot="tabs-list"
          className={cn(
              " text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-none p-[3px]",
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
              "data-[state=active]:text-black-500 data-[state=active]:text-black data-[state=active]:border-black hover:!border-gray-600 text-zinc-400 dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-none border-b border-gray-300 px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow,border-color] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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

export {Tabs, TabsList, TabsTrigger, TabsContent}
