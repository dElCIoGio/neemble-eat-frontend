
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import type { Category } from "@/types/category"
import type { Menu } from "@/types/menu"

interface CategoriesViewProps {
    categories: Category[]
    menus: Menu[]
    viewMode: "grid" | "list"
}

export function CategoriesView({ categories, menus, viewMode }: CategoriesViewProps) {
    const getMenuName = (categoryId: string) => {
        const menu = menus.find((m) => m.categoryIds.includes(categoryId))
        return menu?.name || "Unknown Menu"
    }

    if (viewMode === "list") {
        return (
            <div className="space-y-4">
                {categories.map((category) => (
                    <Card key={category.id}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {category.imageUrl && (
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                                            <img
                                                src={category.imageUrl || "/placeholder.svg"}
                                                alt={category.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{category.name}</h3>
                                        <p className="text-sm text-muted-foreground">{category.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant={category.isActive ? "default" : "secondary"}>
                                                {category.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">{category.itemIds.length} items</span>
                                            <span className="text-sm text-muted-foreground">• {getMenuName(category.id)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch checked={category.isActive} />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Items
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Category
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
            {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Items
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Category
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {category.imageUrl && (
                                <div className="w-full h-32 rounded-lg overflow-hidden bg-muted">
                                    <img
                                        src={category.imageUrl || "/placeholder.svg"}
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <div className="flex items-center space-x-2">
                                    <Switch checked={category.isActive} />
                                    <Badge variant={category.isActive ? "default" : "secondary"}>
                                        {category.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Items</span>
                                <span className="text-sm font-medium">{category.itemIds.length}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Position</span>
                                <span className="text-sm font-medium">{category.position}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Menu</span>
                                <span className="text-sm font-medium">{getMenuName(category.id)}</span>
                            </div>

                            {category.tags && category.tags.length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-sm text-muted-foreground">Tags</span>
                                    <div className="flex flex-wrap gap-1">
                                        {category.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
