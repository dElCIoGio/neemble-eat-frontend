
import { useState } from "react"
import { Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {useNavigate, useParams} from "react-router";
import { useGetMenuCategoriesBySlug } from "@/api/endpoints/categories/hooks";
import {Loader} from "@/components/ui/loader";
import {showPromiseToast} from "@/utils/notifications/toast";
import {categoryApi} from "@/api/endpoints/categories/requests";
import {Category} from "@/types/category";



export function CategoriesTab() {

    const navigate = useNavigate();

    const { menuId } = useParams() as unknown as { menuId: string }

    const { data: categories, isLoading, removeCategory, setCategoryActive } = useGetMenuCategoriesBySlug(menuId)

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    const filteredCategories = categories? categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) : []

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCategories(categories? categories.map((cat) => cat._id): [])
        } else {
            setSelectedCategories([])
        }
    }

    const handleSelectCategory = (categoryId: string, checked: boolean) => {
        if (checked) {
            setSelectedCategories([...selectedCategories, categoryId])
        } else {
            setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
        }
    }

    const handleDeleteCategory = (categoryId: string) => {

        try {
            showPromiseToast(
                categoryApi.deleteCategory(categoryId).then(() => {
                    removeCategory(categoryId)
                }),
                {
                    loading: "Apagando menu...",
                    success: "Menu apagado com sucesso!",
                    error: "Falha ao apagar o menu. Tente novamente."
                }
            );
        } catch (error) {
            console.error("Error deleting menu:", error);
        }


        setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }

    const handleToggleStatus = (category: Category) => {
        showPromiseToast(
            categoryApi.switchCategoryAvailability(category._id, !category.isActive).then(() => {
                setCategoryActive(category._id, !category.isActive)
            }),
            {
                loading: "Atualizando categoria...",
                success: `A categoria "${category.name} foi atualizada com sucesso!"`,
                error: "Houve uma falha ao atualizar a categoria, tente novamente."
            }
        );
    }

    if (isLoading){
        return <div className="flex-1 flex justify-center items-center">
            <Loader/>
        </div>
    }


    if (!categories){
        return <div className="flex-1 flex justify-center items-center">
            There was an error while fetching the data
        </div>
    }

    return (
        <div className="space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Select defaultValue="all-menus">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-menus">All menus</SelectItem>
                            <SelectItem value="current-menu">Current menu</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="otter-late-night">
                        <SelectTrigger className="w-[280px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="otter-late-night">Otter Late Night Snacks - Michigan Ave</SelectItem>
                            <SelectItem value="other-location">Other Location</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search categories"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-[300px]"
                    />
                </div>
            </div>

            {/* Categories Table */}
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="rounded-none">
                            <TableRow className="bg-white rounded-none">
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedCategories.length === categories.length}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Category name</TableHead>
                                <TableHead className="hidden sm:table-cell">Appears in</TableHead>
                                <TableHead className="hidden md:table-cell">Contains</TableHead>
                                <TableHead className="hidden lg:table-cell">Locations</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-zinc-200">
                            {filteredCategories.map((category) => (
                                <TableRow
                                    key={category._id}
                                    onClick={() => navigate(`categories/${category.slug}`)}
                                    className="contents"
                                >
                                    {/* Prevent checkbox from triggering navigation */}
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selectedCategories.includes(category._id)}
                                            onCheckedChange={(checked) =>
                                                handleSelectCategory(category._id, !!checked)
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="font-medium">{category.name}</div>
                                                <div className="text-sm text-gray-500 sm:hidden">
                                                    {category.itemIds.length} items
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell">
                                        <span className="text-sm text-gray-600">2 menus</span>
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell">
                                  <span className="text-sm text-gray-600">
                                    {category.itemIds.length} items
                                  </span>
                                    </TableCell>

                                    <TableCell className="hidden lg:table-cell">
                                        <span className="text-sm text-gray-600">1 location</span>
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant={category.isActive ? "default" : "secondary"}>
                                            {category.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>

                                    {/* Prevent dropdown from triggering navigation */}
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View items
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleToggleStatus(category)}
                                                >
                                                    {category.isActive ? "Deactivate" : "Activate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteCategory(category._id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {filteredCategories.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No categories found matching your search.</p>
                </div>
            )}
        </div>
    )
}
