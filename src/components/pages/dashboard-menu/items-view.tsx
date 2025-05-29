
import { MoreHorizontal, Edit, Trash2, Eye, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import type { Item } from "@/types/item"
import type { Category } from "@/types/category"

interface ItemsViewProps {
  items: Item[]
  categories: Category[]
  viewMode: "grid" | "list"
}

export function ItemsView({ items, categories, viewMode }: ItemsViewProps) {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || "Unknown Category"
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={item.isAvailable ? "default" : "secondary"}>
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                      <span className="text-sm font-medium text-green-600">${item.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">• {getCategoryName(item.categoryId)}</span>
                      {item.customizations.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {item.customizations.length} customizations
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={item.isAvailable} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Item
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Customizations
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="w-full h-48 rounded-lg overflow-hidden bg-muted mb-3">
              <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Item
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Customizations
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className="line-clamp-2">{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-lg font-semibold text-green-600">${item.price.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center space-x-2">
                  <Switch checked={item.isAvailable} />
                  <Badge variant={item.isAvailable ? "default" : "secondary"}>
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm font-medium">{getCategoryName(item.categoryId)}</span>
              </div>

              {item.customizations.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Customizations</span>
                  <Badge variant="outline" className="text-xs">
                    {item.customizations.length} options
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
