import { useState, useEffect } from "react"
import { Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {useNavigate, useParams, useSearchParams} from "react-router";
import { useGetMenuCategoriesBySlug } from "@/api/endpoints/categories/hooks";
import {Loader} from "@/components/ui/loader";
import {showPromiseToast} from "@/utils/notifications/toast";
import {categoryApi} from "@/api/endpoints/categories/requests";
import {Category} from "@/types/category";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"



export function CategoriesTab() {

    const { menuId } = useParams() as unknown as { menuId: string }

    const { data: categories, isLoading, removeCategory, setCategoryActive } = useGetMenuCategoriesBySlug(menuId)

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get("categoriesSearch") || "")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

    useEffect(() => {
        const term = searchParams.get("categoriesSearch") || ""
        if (term !== searchTerm) {
            setSearchTerm(term)
        }
    }, [searchParams])

    const filteredCategories = categories ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : []

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev.toString())
            if (value) newParams.set("categoriesSearch", value)
            else newParams.delete("categoriesSearch")
            return newParams
        })
    }

    const clearFilters = () => {
        setSearchTerm("")
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev.toString())
            newParams.delete("categoriesSearch")
            return newParams
        })
    }

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

    const confirmDeleteCategory = () => {
        if (!categoryToDelete) return

        try {
            const id = categoryToDelete._id
            showPromiseToast(
                categoryApi.deleteCategory(id).then(() => {
                    removeCategory(id)
                }),
                {
                    loading: "Apagando menu...",
                    success: "RestaurantMenu apagado com sucesso!",
                    error: "Falha ao apagar o menu. Tente novamente."
                }
            )
            setSelectedCategories(selectedCategories.filter((sel) => sel !== id))
        } catch (error) {
            console.error("Error deleting menu:", error)
        } finally {
            setDeleteDialogOpen(false)
            setCategoryToDelete(null)
        }
    }

    const confirmBulkDelete = async () => {
        await Promise.all(selectedCategories.map(id => categoryApi.deleteCategory(id).then(() => removeCategory(id))))
        setSelectedCategories([])
        setBulkDeleteDialogOpen(false)
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
                            <SelectItem value="all-menus">Todos os cardápios</SelectItem>
                            <SelectItem value="current-menu">Cardápio atual</SelectItem>
                        </SelectContent>
                    </Select>

                </div>

                <div className="relative w-full sm:w-auto flex items-center gap-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Buscar categorias"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 w-full sm:w-[300px]"
                    />
                    <Button variant="ghost" onClick={clearFilters} className="whitespace-nowrap">Limpar filtros</Button>
                </div>
                {selectedCategories.length > 1 && (
                    <Button variant="destructive" size="sm" onClick={() => setBulkDeleteDialogOpen(true)}>
                        Excluir selecionados
                    </Button>
                )}
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
                                <TableHead>Nome da Categoria</TableHead>
                                <TableHead className="hidden md:table-cell">Contém</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-zinc-200">
                            {filteredCategories.map((category) => (
                                <CategoryRow
                                    category={category}
                                    setCategoryToDelete={setCategoryToDelete}
                                    setSelectedCategories={setSelectedCategories}
                                    handleToggleStatus={handleToggleStatus}
                                    setDeleteDialogOpen={setDeleteDialogOpen}
                                    handleSelectCategory={handleSelectCategory}
                                    selectedCategories={selectedCategories}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {filteredCategories.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma categoria encontrada com sua busca.</p>
                </div>
            )}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem a certeza que deseja excluir a categoria "{categoryToDelete?.name}"?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteCategory} className="bg-red-600 hover:bg-red-700">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir categorias selecionadas</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem a certeza que deseja excluir {selectedCategories.length} categorias?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setBulkDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}


interface CategoryRowProps {
    category: Category
    selectedCategories: string[]
    setSelectedCategories: (selectedCategory: string[]) => void
    handleSelectCategory: (categoryId: string, checked: boolean) => void
    handleToggleStatus: (category: Category) => void
    setCategoryToDelete: (category: Category | null) => void
    setDeleteDialogOpen: (isOpen: boolean) => void
}

function CategoryRow({category, selectedCategories, handleSelectCategory, handleToggleStatus, setDeleteDialogOpen, setCategoryToDelete}: CategoryRowProps){

    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState<boolean>(false)

    const navigate = useNavigate()
    const [, setSearchParams] = useSearchParams()

    return (
        <TableRow
            key={category._id}
            onClick={() => navigate(`categories/${category.slug}`)}
            className=""
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
                            {category.itemIds.length} itens
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell className="hidden md:table-cell">
                                      <span className="text-sm text-gray-600">
                                        {category.itemIds.length} itens
                                      </span>
            </TableCell>

            <TableCell className="hidden sm:table-cell">
                <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Ativo" : "Inativo"}
                </Badge>
            </TableCell>

            {/* Prevent dropdown from triggering navigation */}
            <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu open={isDropdownMenuOpen} onOpenChange={setIsDropdownMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => {
                            setIsDropdownMenuOpen(false)
                            setSearchParams(prev => {
                                const newParams = new URLSearchParams(prev.toString())
                                newParams.set("tab", "items")
                                newParams.set("itemCategory", category._id)
                                return newParams
                            })
                        }}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver itens
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`categories/${category.slug}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleToggleStatus(category)}
                        >
                            {category.isActive ? "Desativar" : "Ativar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setIsDropdownMenuOpen(false)
                                setCategoryToDelete(category)
                                setDeleteDialogOpen(true)
                            }}
                            className="text-red-600"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}
