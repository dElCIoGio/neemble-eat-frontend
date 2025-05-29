
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MenuBreadcrumbProps {
  items: Array<{
    label: string
    onClick?: () => void
    isActive?: boolean
  }>
}

export function MenuBreadcrumb({ items }: MenuBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {item.onClick ? (
            <Button
              variant="ghost"
              size="sm"
              className={`h-auto p-0 font-normal ${
                item.isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={item.onClick}
            >
              {item.label}
            </Button>
          ) : (
            <span className={item.isActive ? "text-foreground font-medium" : ""}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
