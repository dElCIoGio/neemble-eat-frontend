
import { useState } from "react"
import { ArrowLeft, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MenuBreadcrumb } from "./menu-breadcrumb"
import { CategoryManager } from "./category-manager"
import { ItemManager } from "./item-manager"
import { MenuPreferencesEditor } from "./menu-preferences-editor"
import { MenuOverview } from "./menu-overview"
import type { Menu } from "@/types/menu"
import type { Category } from "@/types/category"
import type { Item } from "@/types/item"

interface MenuDetailViewProps {
  menu: Menu
  categories: Category[]
  items: Item[]
  onBack: () => void
  onEdit: (menu: Menu) => void
  onToggleStatus: (menuId: string, isActive: boolean) => void
  onUpdateMenu: (menu: Menu) => void
  onCreateCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => void
  onUpdateCategory: (category: Category) => void
  onDeleteCategory: (categoryId: string) => void
  onReorderCategories: (categoryIds: string[]) => void
  onCreateItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => void
  onUpdateItem: (item: Item) => void
  onDeleteItem: (itemId: string) => void
  onReorderItems: (categoryId: string, itemIds: string[]) => void
}

export default function MenuDetailView({
  menu,
  categories,
  items,
  onBack,
  onToggleStatus,
  onUpdateMenu,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
  onReorderItems,
}: MenuDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)

  // Filter categories and items for this menu
  const menuCategories = categories
    .filter((category) => menu.categoryIds.includes(category.id))
    .sort((a, b) => a.position - b.position)

  const menuItems = items.filter((item) => menuCategories.some((category) => category.itemIds.includes(item.id)))

  const totalItems = menuItems.length
  const activeItems = menuItems.filter((item) => item.isAvailable).length
  const averagePrice =
    menuItems.length > 0 ? menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length : 0

  const handleToggleMenuStatus = () => {
    onToggleStatus(menu.id, !menu.isActive)
  }

  const handleEditMenu = () => {
    setIsEditing(true)
  }

  const handleSaveMenu = () => {
    setIsEditing(false)
    // Menu updates would be handled by the parent component
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <MenuBreadcrumb
        items={[
          { label: "Menu Management", onClick: onBack },
          { label: "Menus", onClick: onBack },
          { label: menu.name, isActive: true },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menus
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{menu.name}</h1>
            <p className="text-muted-foreground">{menu.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Switch checked={menu.isActive} onCheckedChange={handleToggleMenuStatus} />
            <Badge variant={menu.isActive ? "default" : "secondary"}>{menu.isActive ? "Active" : "Inactive"}</Badge>
          </div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveMenu}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleEditMenu}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Menu
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuCategories.length}</div>
            <p className="text-xs text-muted-foreground">{menuCategories.filter((c) => c.isActive).length} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">{activeItems} available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per item</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menu.position}</div>
            <p className="text-xs text-muted-foreground">Menu order</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories ({menuCategories.length})</TabsTrigger>
          <TabsTrigger value="items">Items ({totalItems})</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <MenuOverview
            menu={menu}
            categories={menuCategories}
            items={menuItems}
            isEditing={isEditing}
            onUpdateMenu={onUpdateMenu}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryManager
            menu={menu}
            categories={menuCategories}
            items={menuItems}
            onCreateCategory={onCreateCategory}
            onUpdateCategory={onUpdateCategory}
            onDeleteCategory={onDeleteCategory}
            onReorderCategories={onReorderCategories}
          />
        </TabsContent>

        <TabsContent value="items" className="mt-6">
          <ItemManager
            menu={menu}
            categories={menuCategories}
            items={menuItems}
            onCreateItem={onCreateItem}
            onUpdateItem={onUpdateItem}
            onDeleteItem={onDeleteItem}
            onReorderItems={onReorderItems}
          />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <MenuPreferencesEditor menu={menu} onUpdateMenu={onUpdateMenu} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
