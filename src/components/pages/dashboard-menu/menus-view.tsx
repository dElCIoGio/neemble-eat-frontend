
import { MoreHorizontal, Edit, Trash2, Eye, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import type { Menu } from "@/types/menu"

interface MenusViewProps {
  menus: Menu[]
  viewMode: "grid" | "list"
  onViewDetails: (menu: Menu) => void
}

export function MenusView({ menus, viewMode, onViewDetails }: MenusViewProps) {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {menus.map((menu) => (
          <Card key={menu.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold">{menu.name}</h3>
                    <p className="text-sm text-muted-foreground">{menu.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={menu.isActive ? "default" : "secondary"}>
                        {menu.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{menu.categoryIds.length} categories</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={menu.isActive} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(menu)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Menu
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Preferences
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
      {menus.map((menu) => (
        <Card key={menu.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg cursor-pointer hover:text-primary" onClick={() => onViewDetails(menu)}>
                {menu.name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetails(menu)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Menu
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>{menu.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center space-x-2">
                  <Switch checked={menu.isActive} />
                  <Badge variant={menu.isActive ? "default" : "secondary"}>
                    {menu.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Categories</span>
                <span className="text-sm font-medium">{menu.categoryIds.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Position</span>
                <span className="text-sm font-medium">{menu.position}</span>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Preferences</span>
                <div className="flex flex-wrap gap-1">
                  {menu.preferences.showPrices && (
                    <Badge variant="outline" className="text-xs">
                      Show Prices
                    </Badge>
                  )}
                  {menu.preferences.showItemImages && (
                    <Badge variant="outline" className="text-xs">
                      Show Images
                    </Badge>
                  )}
                  {menu.preferences.highlightFeaturedItems && (
                    <Badge variant="outline" className="text-xs">
                      Highlight Featured
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
