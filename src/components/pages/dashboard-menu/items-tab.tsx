import { useState } from "react"
import { Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, useParams } from "react-router";
import { useGetMenuItemsBySlug } from "@/api/endpoints/menu/hooks";
import { useGetMenuCategoriesBySlug } from "@/api/endpoints/categories/hooks";
import { showPromiseToast } from "@/utils/notifications/toast";
import { itemsApi } from "@/api/endpoints/item/requests";
import { Loader } from "@/components/ui/loader";
import type { Item } from "@/types/item";
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


export function ItemsTab() {

    const { menuId } = useParams() as unknown as { menuId: string }


    const { data: categories, isLoading: isCategoriesLoading } = useGetMenuCategoriesBySlug(menuId)
    const { data: items, removeItem, isLoading: isItemsLoading } = useGetMenuItemsBySlug(menuId)

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null)

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false)
        setItemToDelete(null)
    }

    const filteredItems = items? items.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || item.categoryId === categoryFilter
        return matchesSearch && matchesCategory
    }) : []

    const getCategoryName = (categoryId: string) => {
        const category = categories? categories.find((cat) => cat._id === categoryId): undefined
        return category?.name || "Unknown"
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(filteredItems.map((item) => item._id))
        } else {
            setSelectedItems([])
        }
    }

    const handleSelectItem = (itemId: string, checked: boolean) => {
        if (checked) {
            setSelectedItems([...selectedItems, itemId])
        } else {
            setSelectedItems(selectedItems.filter((id) => id !== itemId))
        }
    }

    const confirmDeleteItem = () => {
        if (!itemToDelete) return

        const id = itemToDelete._id

        showPromiseToast(
            itemsApi.deleteItem(id).then(() => {
                removeItem(id)
            }),
            {
                loading: "Deleting menu...",
                success: "RestaurantMenu deleted successfully!",
                error: "Failed to delete menu. Please try again."
            }
        )

        setSelectedItems(selectedItems.filter((selected) => selected !== id))
        setDeleteDialogOpen(false)
        setItemToDelete(null)
    }

    const handleToggleAvailability = (itemId: string) => {

        console.log(itemId)
    }

    if (isItemsLoading || isCategoriesLoading){
        return <div className="flex-1 flex justify-center items-center">
            <Loader/>
        </div>
    }

    if (!categories || !items) {
        return <div className="flex-1 flex justify-center items-center">
            There was an error while fetching the data
        </div>
    }

    return (
        <div className="space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as categorias</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select defaultValue="available">
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os itens</SelectItem>
                            <SelectItem value="available">Disponíveis</SelectItem>
                            <SelectItem value="unavailable">Indisponíveis</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Buscar itens"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-[300px]"
                    />
                </div>
            </div>

            {/* Items Table */}
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Nome do Item</TableHead>
                                <TableHead className="hidden sm:table-cell">Categoria</TableHead>
                                <TableHead className="hidden md:table-cell">Preço</TableHead>
                                <TableHead className="hidden lg:table-cell">Personalizações</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.map((item) => (
                                <Link
                                    key={item._id}
                                    to={`items/${item.slug}`}
                                    className="contents"
                                >
                                    <ItemRow
                                        item={item}
                                        setItemToDelete={setItemToDelete}
                                        itemToDelete={itemToDelete}
                                        getCategoryName={getCategoryName}
                                        handleSelectItem={handleSelectItem}
                                        handleToggleAvailability={handleToggleAvailability}
                                        selectedItems={selectedItems}
                                        setDeleteDialogOpen={setDeleteDialogOpen}
                                    />
                                </Link>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        {searchTerm || categoryFilter !== "all"
                            ? "Nenhum item encontrado com seus filtros."
                            : "Ainda não há itens neste cardápio."}
                    </p>
                </div>
            )}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) setItemToDelete(null)
                    setDeleteDialogOpen(open)
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem a certeza que deseja excluir o item "{itemToDelete?.name}"?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelDelete}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteItem} className="bg-red-600 hover:bg-red-700">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

function ItemRow({
    item,
    selectedItems,
    getCategoryName,
    handleSelectItem,
    setItemToDelete,
    setDeleteDialogOpen,
    handleToggleAvailability
                 }: {
    item: Item,
    selectedItems: string[]
    getCategoryName: (categoryId: string) => string
    handleSelectItem: (itemId: string, checked: boolean) => void
    setItemToDelete: (item: Item | null) => void
    itemToDelete: Item | null
    setDeleteDialogOpen: (isOpen: boolean) => void
    handleToggleAvailability: (itemId: string) => void
}) {

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

    return (
        <TableRow>
            {/* Checkbox (no navigation) */}
            <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    checked={selectedItems.includes(item._id)}
                    onCheckedChange={(checked) => handleSelectItem(item._id, !!checked)}
                />
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-3">
                    <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500 sm:hidden">
                            Kz {item.price.toFixed(2)} • {getCategoryName(item.categoryId)}
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell className="hidden sm:table-cell">
                <Badge variant="outline">{getCategoryName(item.categoryId)}</Badge>
            </TableCell>

            <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                    Kz
                    <span>{item.price.toFixed(2)}</span>
                </div>
            </TableCell>

            <TableCell className="hidden lg:table-cell">
                                          <span className="text-sm text-gray-600">
                                            {item.customizations.length} Personalização{item.customizations.length !== 1 ? "s" : ""}
                                          </span>
            </TableCell>

            <TableCell className="hidden sm:table-cell">
                <Badge variant={item.isAvailable ? "default" : "secondary"}>
                    {item.isAvailable ? "Disponível" : "Indisponível"}
                </Badge>
            </TableCell>

            {/* Dropdown menu (no navigation) */}
            <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleAvailability(item._id)}>
                            {item.isAvailable ? "Marcar como indisponível" : "Marcar como disponível"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={() => {
                                setIsDropdownOpen(false)
                                setItemToDelete(item)
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
