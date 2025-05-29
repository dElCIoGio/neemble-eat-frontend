
import { useState } from "react"
import { Plus, Search, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category as CategoryType } from "@/types/category"
import type { Item as ItemType } from "@/types/item"
import {Menu} from "@/types/menu";
import MenuDetailView from "@/components/pages/dashboard-menu/menu-detail-view";
import {MenuFilters} from "@/components/pages/dashboard-menu/menu-filters";
import {ItemsView} from "@/components/pages/dashboard-menu/items-view";
import {CategoriesView} from "@/components/pages/dashboard-menu/categories-view";
import {MenusView} from "@/components/pages/dashboard-menu/menus-view";

// Mock data for demonstration
const mockMenus: Menu[] = [
    {
        id: "menu-1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        restaurantId: "rest-1",
        name: "Main Menu",
        description: "Our signature dishes and favorites",
        categoryIds: ["cat-1", "cat-2", "cat-3"],
        isActive: true,
        position: 1,
        preferences: {
            id: "pref-1",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            highlightFeaturedItems: true,
            showPrices: true,
            showItemImages: true,
        },
    },
    {
        id: "menu-2",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        restaurantId: "rest-1",
        name: "Drinks Menu",
        description: "Beverages, cocktails, and more",
        categoryIds: ["cat-4", "cat-5"],
        isActive: true,
        position: 2,
        preferences: {
            id: "pref-2",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            highlightFeaturedItems: false,
            showPrices: true,
            showItemImages: false,
        },
    },
]

const mockCategories: CategoryType[] = [
    {
        id: "cat-1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        name: "Appetizers",
        restaurantId: "rest-1",
        itemIds: ["item-1", "item-2"],
        description: "Start your meal with these delicious appetizers",
        imageUrl: "/placeholder.svg?height=200&width=300",
        position: 1,
        isActive: true,
        tags: ["starter", "light"],
        slug: "appetizers",
        menuId: ""
    },
    {
        id: "cat-2",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        name: "Main Courses",
        restaurantId: "rest-1",
        itemIds: ["item-3", "item-4", "item-5"],
        description: "Hearty main dishes to satisfy your hunger",
        imageUrl: "/placeholder.svg?height=200&width=300",
        position: 2,
        isActive: true,
        tags: ["main", "hearty"],
        slug: "main-courses",
        menuId: ""
    },
]

const mockItems: ItemType[] = [
    {
        id: "item-1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        name: "Caesar Salad",
        price: 12.99,
        imageUrl: "/placeholder.svg?height=200&width=300",
        restaurantId: "rest-1",
        categoryId: "cat-1",
        description: "Fresh romaine lettuce with parmesan cheese and croutons",
        isAvailable: true,
        customizations: [],
    },
    {
        id: "item-2",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        name: "Grilled Chicken",
        price: 18.99,
        imageUrl: "/placeholder.svg?height=200&width=300",
        restaurantId: "rest-1",
        categoryId: "cat-2",
        description: "Tender grilled chicken breast with herbs",
        isAvailable: true,
        customizations: [],
    },
]

export default function MenuPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedMenuId, setSelectedMenuId] = useState<string>("all")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
    const [showDetailView, setShowDetailView] = useState(false)

    const filteredMenus = mockMenus.filter(
        (menu) =>
            menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            menu.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const filteredCategories = mockCategories.filter((category) => {
        const matchesSearch =
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesMenu =
            selectedMenuId === "all" ||
            mockMenus.find((menu) => menu.id === selectedMenuId)?.categoryIds.includes(category.id)
        return matchesSearch && matchesMenu
    })

    const filteredItems = mockItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory
        const matchesMenu =
            selectedMenuId === "all" ||
            mockMenus.find((menu) => menu.id === selectedMenuId)?.categoryIds.includes(item.categoryId)
        return matchesSearch && matchesCategory && matchesMenu
    })

    const handleViewMenuDetails = (menu: Menu) => {
        setSelectedMenu(menu)
        setShowDetailView(true)
    }

    const handleBackToMenus = () => {
        setShowDetailView(false)
        setSelectedMenu(null)
    }

    const handleEditMenu = (menu: Menu) => {
        // TODO: Implement edit functionality
        console.log("Edit menu:", menu)
    }

    const handleToggleMenuStatus = (menuId: string, isActive: boolean) => {
        // TODO: Implement status toggle
        console.log("Toggle menu status:", menuId, isActive)
    }

    const handleUpdateMenu = (menu: Menu) => {
        // TODO: Implement menu update
        console.log("Update menu:", menu)
    }

    const handleCreateCategory = (category: Omit<CategoryType, "id" | "createdAt" | "updatedAt">) => {
        // TODO: Implement category creation
        console.log("Create category:", category)
    }

    const handleUpdateCategory = (category: CategoryType) => {
        // TODO: Implement category update
        console.log("Update category:", category)
    }

    const handleDeleteCategory = (categoryId: string) => {
        // TODO: Implement category deletion
        console.log("Delete category:", categoryId)
    }

    const handleReorderCategories = (categoryIds: string[]) => {
        // TODO: Implement category reordering
        console.log("Reorder categories:", categoryIds)
    }

    const handleCreateItem = (item: Omit<ItemType, "id" | "createdAt" | "updatedAt">) => {
        // TODO: Implement item creation
        console.log("Create item:", item)
    }

    const handleUpdateItem = (item: ItemType) => {
        // TODO: Implement item update
        console.log("Update item:", item)
    }

    const handleDeleteItem = (itemId: string) => {
        // TODO: Implement item deletion
        console.log("Delete item:", itemId)
    }

    const handleReorderItems = (categoryId: string, itemIds: string[]) => {
        // TODO: Implement item reordering
        console.log("Reorder items:", categoryId, itemIds)
    }

    if (showDetailView && selectedMenu) {
        return (
            <div className="flex flex-1 flex-col gap-6 p-6">
                <MenuDetailView
                    menu={selectedMenu}
                    categories={mockCategories}
                    items={mockItems}
                    onBack={handleBackToMenus}
                    onEdit={handleEditMenu}
                    onToggleStatus={handleToggleMenuStatus}
                    onUpdateMenu={handleUpdateMenu}
                    onCreateCategory={handleCreateCategory}
                    onUpdateCategory={handleUpdateCategory}
                    onDeleteCategory={handleDeleteCategory}
                    onReorderCategories={handleReorderCategories}
                    onCreateItem={handleCreateItem}
                    onUpdateItem={handleUpdateItem}
                    onDeleteItem={handleDeleteItem}
                    onReorderItems={handleReorderItems}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                        {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Search and Quick Filters */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search menus, categories, or items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by menu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Menus</SelectItem>
                            {mockMenus.map((menu) => (
                                <SelectItem key={menu.id} value={menu.id}>
                                    {menu.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {filteredCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {showFilters && (
                    <MenuFilters
                        menus={mockMenus}
                        categories={mockCategories}
                        onFiltersChange={(filters) => {
                            // Handle advanced filters
                            console.log("Filters changed:", filters)
                        }}
                    />
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Menus</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockMenus.length}</div>
                        <p className="text-xs text-muted-foreground">{mockMenus.filter((m) => m.isActive).length} active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockCategories.length}</div>
                        <p className="text-xs text-muted-foreground">{mockCategories.filter((c) => c.isActive).length} active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockItems.length}</div>
                        <p className="text-xs text-muted-foreground">{mockItems.filter((i) => i.isAvailable).length} available</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${(mockItems.reduce((sum, item) => sum + item.price, 0) / mockItems.length).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">Per item</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="items" className="flex-1">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="items">Items ({filteredItems.length})</TabsTrigger>
                        <TabsTrigger value="categories">Categories ({filteredCategories.length})</TabsTrigger>
                        <TabsTrigger value="menus">Menus ({filteredMenus.length})</TabsTrigger>
                    </TabsList>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                    </Button>
                </div>

                <TabsContent value="items" className="mt-6">
                    <ItemsView items={filteredItems} categories={mockCategories} viewMode={viewMode} />
                </TabsContent>

                <TabsContent value="categories" className="mt-6">
                    <CategoriesView categories={filteredCategories} menus={mockMenus} viewMode={viewMode} />
                </TabsContent>

                <TabsContent value="menus" className="mt-6">
                    <MenusView menus={filteredMenus} viewMode={viewMode} onViewDetails={handleViewMenuDetails} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
