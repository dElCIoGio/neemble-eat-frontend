
import { useState } from "react"
import { Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Menu } from "@/types/menu"
import type { Category } from "@/types/category"
import type { Item } from "@/types/item"

interface MenuOverviewProps {
  menu: Menu
  categories: Category[]
  items: Item[]
  isEditing: boolean
  onUpdateMenu: (menu: Menu) => void
}

export function MenuOverview({ menu, categories, items, isEditing, onUpdateMenu }: MenuOverviewProps) {
  const [editedMenu, setEditedMenu] = useState(menu)

  const handleSave = () => {
    onUpdateMenu(editedMenu)
  }

  const handleCancel = () => {
    setEditedMenu(menu)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Menu Information */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Information</CardTitle>
            <CardDescription>Basic details about this menu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="menu-name">Menu Name</Label>
                  <Input
                    id="menu-name"
                    value={editedMenu.name}
                    onChange={(e) => setEditedMenu({ ...editedMenu, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menu-description">Description</Label>
                  <Textarea
                    id="menu-description"
                    value={editedMenu.description}
                    onChange={(e) => setEditedMenu({ ...editedMenu, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menu-position">Position</Label>
                  <Input
                    id="menu-position"
                    type="number"
                    value={editedMenu.position}
                    onChange={(e) => setEditedMenu({ ...editedMenu, position: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">{menu.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{menu.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Position</Label>
                  <p className="text-sm text-muted-foreground">{menu.position}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge variant={menu.isActive ? "default" : "secondary"}>
                      {menu.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Menu Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Statistics</CardTitle>
            <CardDescription>Overview of menu content and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Total Categories</Label>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Active Categories</Label>
                <p className="text-2xl font-bold">{categories.filter((c) => c.isActive).length}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Total Items</Label>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Available Items</Label>
                <p className="text-2xl font-bold">{items.filter((i) => i.isAvailable).length}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Price Range</Label>
              <p className="text-sm text-muted-foreground">
                ${Math.min(...items.map((i) => i.price)).toFixed(2)} - $
                {Math.max(...items.map((i) => i.price)).toFixed(2)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Average Price</Label>
              <p className="text-sm text-muted-foreground">
                $
                {items.length > 0
                  ? (items.reduce((sum, item) => sum + item.price, 0) / items.length).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Categories Overview</CardTitle>
          <CardDescription>Quick view of all categories in this menu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryItems = items.filter((item) => category.itemIds.includes(item.id))
              return (
                <Card key={category.id} className="border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{category.name}</h4>
                      <Badge variant={category.isActive ? "default" : "secondary"} className="text-xs">
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{categoryItems.length} items</span>
                      <span>Position {category.position}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
