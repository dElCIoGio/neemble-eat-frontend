import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, GripVertical, Eye, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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

interface CategoryManagerProps {
    menu: Menu
    categories: Category[]
    items: Item[]
    onCreateCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => void
    onUpdateCategory: (category: Category) => void
    onDeleteCategory: (categoryId: string) => void
    onReorderCategories: (categoryIds: string[]) => void
}

export function CategoryManager({
                                    menu,
                                    categories,
                                    items,
                                    onCreateCategory,
                                    onUpdateCategory,
                                    onDeleteCategory,
                                    onReorderCategories,
                                }: CategoryManagerProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [draggedCategory, setDraggedCategory] = useState<Category | null>(null)

    const [newCategory, setNewCategory] = useState({
        name: "",
        description: "",
        restaurantId: menu.restaurantId,
        menuId: menu.id,
        itemIds: [],
        imageUrl: "",
        position: categories.length + 1,
        isActive: true,
        tags: [],
        slug: "",
    })

    const handleCreateCategory = () => {
        onCreateCategory({
            ...newCategory,
            slug: newCategory.name.toLowerCase().replace(/\s+/g, "-"),
        })
        setNewCategory({
            name: "",
            description: "",
            restaurantId: menu.restaurantId,
            menuId: menu.id,
            itemIds: [],
            imageUrl: "",
            position: categories.length + 1,
            isActive: true,
            tags: [],
            slug: "",
        })
        setIsCreateDialogOpen(false)
    }

    const handleUpdateCategory = (category: Category) => {
        onUpdateCategory(category)
        setEditingCategory(null)
    }

    const handleDeleteCategory = (categoryId: string) => {
        onDeleteCategory(categoryId)
    }

    const handleDragStart = (category: Category) => {
        setDraggedCategory(category)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent, targetCategory: Category) => {
        e.preventDefault()
        if (!draggedCategory || draggedCategory.id === targetCategory.id) return

        const reorderedCategories = [...categories]
        const draggedIndex = reorderedCategories.findIndex((c) => c.id === draggedCategory.id)
        const targetIndex = reorderedCategories.findIndex((c) => c.id === targetCategory.id)

        reorderedCategories.splice(draggedIndex, 1)
        reorderedCategories.splice(targetIndex, 0, draggedCategory)

        const newCategoryIds = reorderedCategories.map((c) => c.id)
        onReorderCategories(newCategoryIds)
        setDraggedCategory(null)
    }

    const getCategoryItems = (categoryId: string) => {
        return items.filter((item) => item.categoryId === categoryId)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">Manage categories for {menu.name}</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>Add a new category to organize your menu items.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category-name">Category Name</Label>
                                <Input
                                    id="category-name"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    placeholder="e.g., Appetizers, Main Courses"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category-description">Description</Label>
                                <Textarea
                                    id="category-description"
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    placeholder="Brief description of this category"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category-image">Image URL</Label>
                                <Input
                                    id="category-image"
                                    value={newCategory.imageUrl}
                                    onChange={(e) => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={newCategory.isActive}
                                    onCheckedChange={(checked) => setNewCategory({ ...newCategory, isActive: checked })}
                                />
                                <Label>Active</Label>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateCategory} disabled={!newCategory.name.trim()}>
                                    Create Category
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
                {categories.map((category) => {
                    const categoryItems = getCategoryItems(category.id)
                    const isEditing = editingCategory?.id === category.id

                    return (
                        <Card
                            key={category.id}
                            className="transition-all duration-200 hover:shadow-md"
                            draggable
                            onDragStart={() => handleDragStart(category)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, category)}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                        <div className="flex items-center gap-2">
                                            {category.imageUrl && (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                                    <img
                                                        src={category.imageUrl || "/placeholder.svg"}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <CardTitle className="text-lg">{category.name}</CardTitle>
                                                <CardDescription>{category.description}</CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={category.isActive ? "default" : "secondary"}>
                                            {category.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                        <Badge variant="outline">{categoryItems.length} items</Badge>
                                        <Badge variant="outline">Position {category.position}</Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Category
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Items
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete Category
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "{category.name}"? This action cannot be undone and will
                                                                remove all items in this category.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteCategory(category.id)}
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
                                </div>
                            </CardHeader>
                            {isEditing && (
                                <CardContent>
                                    <CategoryEditForm
                                        category={category}
                                        onSave={handleUpdateCategory}
                                        onCancel={() => setEditingCategory(null)}
                                    />
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
            </div>

            {categories.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-2">No categories yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first category to start organizing your menu items.
                            </p>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

interface CategoryEditFormProps {
    category: Category
    onSave: (category: Category) => void
    onCancel: () => void
}

function CategoryEditForm({ category, onSave, onCancel }: CategoryEditFormProps) {
    const [editedCategory, setEditedCategory] = useState(category)

    const handleSave = () => {
        onSave({
            ...editedCategory,
            slug: editedCategory.name.toLowerCase().replace(/\s+/g, "-"),
        })
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="edit-name">Category Name</Label>
                    <Input
                        id="edit-name"
                        value={editedCategory.name}
                        onChange={(e) => setEditedCategory({ ...editedCategory, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-position">Position</Label>
                    <Input
                        id="edit-position"
                        type="number"
                        value={editedCategory.position}
                        onChange={(e) => setEditedCategory({ ...editedCategory, position: Number.parseInt(e.target.value) })}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                    id="edit-description"
                    value={editedCategory.description || ""}
                    onChange={(e) => setEditedCategory({ ...editedCategory, description: e.target.value })}
                    rows={3}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                    id="edit-image"
                    value={editedCategory.imageUrl || ""}
                    onChange={(e) => setEditedCategory({ ...editedCategory, imageUrl: e.target.value })}
                />
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    checked={editedCategory.isActive}
                    onCheckedChange={(checked) => setEditedCategory({ ...editedCategory, isActive: checked })}
                />
                <Label>Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
                <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </Button>
            </div>
        </div>
    )
}
