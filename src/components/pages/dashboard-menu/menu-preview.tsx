
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface NewMenu {
  name: string
  description: string
  restaurantId: string
  isActive: boolean
  position: number
  preferences: {
    highlightFeaturedItems: boolean
    showPrices: boolean
    showItemImages: boolean
  }
}

interface NewCategory {
  name: string
  description: string
  imageUrl: string
  position: number
  isActive: boolean
  tags: string[]
  tempId: string
}

interface NewItem {
  name: string
  description: string
  price: number
  imageUrl: string
  categoryTempId: string
  isAvailable: boolean
  tempId: string
}

interface MenuPreviewProps {
  menu: NewMenu
  categories: NewCategory[]
  items: NewItem[]
}

export function MenuPreview({ menu, categories, items }: MenuPreviewProps) {
  const getCategoryItems = (categoryTempId: string) => {
    return items.filter((item) => item.categoryTempId === categoryTempId)
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Menu Preview</CardTitle>
        <CardDescription>See how your menu will look to customers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Menu Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{menu.name || "Menu Name"}</h3>
            <Badge variant={menu.isActive ? "default" : "secondary"}>{menu.isActive ? "Active" : "Inactive"}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{menu.description || "Menu description will appear here..."}</p>
        </div>

        <Separator />

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold">{categories.length}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
          <div>
            <div className="text-lg font-bold">{items.length}</div>
            <div className="text-xs text-muted-foreground">Items</div>
          </div>
          <div>
            <div className="text-lg font-bold">
              $
              {items.length > 0 ? (items.reduce((sum, item) => sum + item.price, 0) / items.length).toFixed(2) : "0.00"}
            </div>
            <div className="text-xs text-muted-foreground">Avg. Price</div>
          </div>
        </div>

        <Separator />

        {/* Categories Preview */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No categories added yet</p>
            </div>
          ) : (
            categories.map((category) => {
              const categoryItems = getCategoryItems(category.tempId)
              return (
                <div key={category.tempId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{category.name || "Category Name"}</h4>
                    <Badge variant="outline" className="text-xs">
                      {categoryItems.length} items
                    </Badge>
                  </div>

                  {category.description && <p className="text-xs text-muted-foreground">{category.description}</p>}

                  <div className="space-y-2 pl-4">
                    {categoryItems.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No items yet</p>
                    ) : (
                      categoryItems.map((item) => (
                        <div key={item.tempId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {menu.preferences.showItemImages && item.imageUrl && (
                              <div className="w-6 h-6 rounded bg-muted"></div>
                            )}
                            <div>
                              <div className="font-medium">{item.name || "Item Name"}</div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                              )}
                            </div>
                          </div>
                          {menu.preferences.showPrices && (
                            <div className="text-xs font-medium text-green-600">${item.price.toFixed(2)}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Preferences Summary */}
        <Separator />
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Display Settings</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Show Prices</span>
              <Badge variant={menu.preferences.showPrices ? "default" : "secondary"} className="text-xs">
                {menu.preferences.showPrices ? "On" : "Off"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Show Images</span>
              <Badge variant={menu.preferences.showItemImages ? "default" : "secondary"} className="text-xs">
                {menu.preferences.showItemImages ? "On" : "Off"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Highlight Featured</span>
              <Badge variant={menu.preferences.highlightFeaturedItems ? "default" : "secondary"} className="text-xs">
                {menu.preferences.highlightFeaturedItems ? "On" : "Off"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
