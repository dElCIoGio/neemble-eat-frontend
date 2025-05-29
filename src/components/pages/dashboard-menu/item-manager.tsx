
import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, GripVertical, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Menu } from "@/types/menu"
import type { Category } from "@/types/category"
import type { Item } from "@/types/item"

interface ItemManagerProps {
  menu: Menu
  categories: Category[]
  items: Item[]
  onCreateItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => void
  onUpdateItem: (item: Item) => void
  onDeleteItem: (itemId: string) => void
  onReorderItems: (categoryId: string, itemIds: string[]) => void
}

export function ItemManager({
  menu,
  categories,
  items,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
  onReorderItems,
}: ItemManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [draggedItem, setDraggedItem] = useState<Item | null>(null)

  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    imageUrl: "",
    restaurantId: menu.restaurantId,
    categoryId: categories[0]?.id || "",
    description: "",
    isAvailable: true,
    customizations: [],
  })

  const filteredItems =
    selectedCategory === "all" ? items : items.filter((item) => item.categoryId === selectedCategory)

  const handleCreateItem = () => {
    onCreateItem(newItem)
    setNewItem({
      name: "",
      price: 0,
      imageUrl: "",
      restaurantId: menu.restaurantId,
      categoryId: categories[0]?.id || "",
      description: "",
      isAvailable: true,
      customizations: [],
    })
    setIsCreateDialogOpen(false)
  }

  const handleUpdateItem = (item: Item) => {
    onUpdateItem(item)
    setEditingItem(null)
  }

  const handleDeleteItem = (itemId: string) => {
    onDeleteItem(itemId)
  }

  const handleDragStart = (item: Item) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetItem: Item) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetItem.id || draggedItem.categoryId !== targetItem.categoryId) return

    const categoryItems = items.filter((item) => item.categoryId === targetItem.categoryId)
    const reorderedItems = [...categoryItems]
    const draggedIndex = reorderedItems.findIndex((i) => i.id === draggedItem.id)
    const targetIndex = reorderedItems.findIndex((i) => i.id === targetItem.id)

    reorderedItems.splice(draggedIndex, 1)
    reorderedItems.splice(targetIndex, 0, draggedItem)

    const newItemIds = reorderedItems.map((i) => i.id)
    onReorderItems(targetItem.categoryId, newItemIds)
    setDraggedItem(null)
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown Category"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Menu Items</h2>
          <p className="text-muted-foreground">Manage items for {menu.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Menu Item</DialogTitle>
                <DialogDescription>Add a new item to your menu.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      id="item-name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g., Grilled Chicken Breast"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-price">Price ($)</Label>
                    <Input
                      id="item-price"
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-category">Category</Label>
                  <Select
                    value={newItem.categoryId}
                    onValueChange={(value) => setNewItem({ ...newItem, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-description">Description</Label>
                  <Textarea
                    id="item-description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Describe the item, ingredients, preparation method..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-image">Image URL</Label>
                  <Input
                    id="item-image"
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newItem.isAvailable}
                    onCheckedChange={(checked) => setNewItem({ ...newItem, isAvailable: checked })}
                  />
                  <Label>Available</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateItem} disabled={!newItem.name.trim() || !newItem.categoryId}>
                    Create Item
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Items by Category */}
      {selectedCategory === "all" ? (
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryItems = items.filter((item) => item.categoryId === category.id)
            if (categoryItems.length === 0) return null

            return (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <Badge variant="outline">{categoryItems.length} items</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categoryItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      category={category}
                      onEdit={setEditingItem}
                      onDelete={handleDeleteItem}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      isEditing={editingItem?.id === item.id}
                      onSave={handleUpdateItem}
                      onCancelEdit={() => setEditingItem(null)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{getCategoryName(selectedCategory)}</h3>
            <Badge variant="outline">{filteredItems.length} items</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const category = categories.find((c) => c.id === item.categoryId)!
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  category={category}
                  onEdit={setEditingItem}
                  onDelete={handleDeleteItem}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isEditing={editingItem?.id === item.id}
                  onSave={handleUpdateItem}
                  onCancelEdit={() => setEditingItem(null)}
                />
              )
            })}
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No items yet</h3>
              <p className="text-muted-foreground mb-4">
                {selectedCategory === "all"
                  ? "Create your first menu item to get started."
                  : "No items in this category yet."}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface ItemCardProps {
  item: Item
  category: Category
  onEdit: (item: Item) => void
  onDelete: (itemId: string) => void
  onDragStart: (item: Item) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, item: Item) => void
  isEditing: boolean
  onSave: (item: Item) => void
  onCancelEdit: () => void
}

function ItemCard({
  item,
  category,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isEditing,
  onSave,
  onCancelEdit,
}: ItemCardProps) {
  const [editedItem, setEditedItem] = useState(item)

  const handleSave = () => {
    onSave(editedItem)
  }

  if (isEditing) {
    return (
      <Card className="border-primary">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Edit Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-item-name">Name</Label>
            <Input
              id="edit-item-name"
              value={editedItem.name}
              onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-item-price">Price ($)</Label>
            <Input
              id="edit-item-price"
              type="number"
              step="0.01"
              value={editedItem.price}
              onChange={(e) => setEditedItem({ ...editedItem, price: Number.parseFloat(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-item-description">Description</Label>
            <Textarea
              id="edit-item-description"
              value={editedItem.description || ""}
              onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-item-image">Image URL</Label>
            <Input
              id="edit-item-image"
              value={editedItem.imageUrl}
              onChange={(e) => setEditedItem({ ...editedItem, imageUrl: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={editedItem.isAvailable}
              onCheckedChange={(checked) => setEditedItem({ ...editedItem, isAvailable: checked })}
            />
            <Label>Available</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={onCancelEdit}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={() => onDragStart(item)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, item)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Item
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Item
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Item</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{item.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(item.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <CardDescription className="line-clamp-2">{item.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-green-600">${item.price.toFixed(2)}</span>
            <Badge variant={item.isAvailable ? "default" : "secondary"}>
              {item.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">Category: {category.name}</div>
          {item.customizations.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {item.customizations.length} customizations
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
