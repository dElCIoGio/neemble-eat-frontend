import { useState, useEffect } from "react"
import {
    Plus,
    Trash2,
    Search,
    Download
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    showErrorToast,
    showSuccessToast,
    showInfoToast,
    showPromiseToast,
} from "@/utils/notifications/toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

// Types
import {
    StockItem,
    Supplier,
    Recipe,
    Movement, movementSerializer,
} from "@/types/stock"
import {useDashboardContext} from "@/context/dashboard-context";
import {
    useCreateStockItem,
    useUpdateStockItem,
    useDeleteStockItem,
    useAddStock,
} from "@/api/endpoints/stock/hooks";
import { useCreateRecipe, useDeleteRecipe, useUpdateRecipe} from "@/api/endpoints/recipes/hooks";
import {useGetRestaurantMenus} from "@/api/endpoints/menu/hooks";
import {menuApi} from "@/api/endpoints/menu/requests";
import type {Item} from "@/types/item";
import {useRegisterSale} from "@/api/endpoints/sales/hooks";
import {useCreateMovement} from "@/api/endpoints/movements/hooks";
import type {MovementCreate} from "@/types/stock";
import {formatIsosDate} from "@/lib/helpers/format-isos-date";
import {usePaginatedQuery} from "@/hooks/use-paginate";
import {recipesClient, stockItemClient, stockMovementClient} from "@/api";
import {formatCurrency} from "@/utils/format-currency";

import { useQueryClient } from "@tanstack/react-query"
import PaginationManager from "@/components/ui/pagination-manager";
import {PermissionGate} from "@/components/ui/permission-gate";
import {Sections} from "@/types/role";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {StockCard} from "./components/stock-card";
import {RecipeCard} from "./components/recipe-card";
import {MovementCard} from "./components/movement-card";
import {StockSummary} from "./components/stock-summary";
import {StockContext} from "@/context/stock-context";


interface PaginatedStockResponse {
    items: StockItem[]
    nextCursor: string | null
    totalCount: number
    hasMore: boolean
}


export default function StockManagement() {

    const convertDisplayToBase = (value: string, unit: string, displayUnit: string) => {
        if (!value) return ""
        const num = Number.parseFloat(value)
        if (Number.isNaN(num)) return ""
        if (unit === "Kg" && displayUnit === "g") return (num / 1000).toString()
        if (unit === "L" && displayUnit === "ml") return (num / 1000).toString()
        return value
    }

    const convertBaseToDisplay = (value: string, unit: string, displayUnit: string) => {
        if (!value) return ""
        const num = Number.parseFloat(value)
        if (Number.isNaN(num)) return value
        if (unit === "Kg" && displayUnit === "g") return (num * 1000).toString()
        if (unit === "L" && displayUnit === "ml") return (num * 1000).toString()
        return value
    }

    // State management
    // const [activeTab, setActiveTab] = useState("stock")
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("Todas")
    const [statusFilter, setStatusFilter] = useState("Todos")
    const [newCategoryName, setNewCategoryName] = useState("")
    const [tempCategories, setTempCategories] = useState<string[]>([])

    const { restaurant, user } = useDashboardContext()

    const filter = {
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter
    }

    const paginatedStockItems = usePaginatedQuery<StockItem>(
        stockItemClient,
        10,
        `/restaurant/${restaurant._id}/paginate`,
        filter)
    const {
        data: stockItems,
        isLoading: isStockLoading,
    } = paginatedStockItems

    const queryClient = useQueryClient()
    const paginatedQueryKey = [
        'paginated',
        stockItemClient.defaults.baseURL,
        `/restaurant/${restaurant._id}/paginate`
    ] as const

    const createStockItemMutation = useCreateStockItem(restaurant._id)
    const updateStockItemMutation = useUpdateStockItem(restaurant._id)
    const deleteStockItemMutation = useDeleteStockItem(restaurant._id)
    const addStockMutation = useAddStock(restaurant._id)

    // Recipes data

    const recipesPagination = usePaginatedQuery<Recipe>(recipesClient, 10, undefined, {restaurantId: restaurant._id})
    const { data: recipes = [] } = recipesPagination
    const createRecipeMutation = useCreateRecipe(restaurant._id)
    const updateRecipeMutation = useUpdateRecipe(restaurant._id)
    const deleteRecipeMutation = useDeleteRecipe(restaurant._id)

    const {data: menus = []} = useGetRestaurantMenus(restaurant._id)
    const [menuItems, setMenuItems] = useState<Item[]>([])

    // Sales data
    const registerSaleMutation = useRegisterSale(restaurant._id)

    const movementsPagination = usePaginatedQuery<Movement, Movement>(
        stockMovementClient, 10, undefined, {restaurantId: restaurant._id}, movementSerializer
    )
    const { data: movements = [], isLoading: isMovementsLoading  } = movementsPagination;

    const createMovementMutation = useCreateMovement(restaurant._id)

    // Modal states
    const [isAddProductOpen, setIsAddProductOpen] = useState(false)
    const [isEditProductOpen, setIsEditProductOpen] = useState(false)
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
    const [isAddStockOpen, setIsAddStockOpen] = useState(false)
    const [isReplenishOpen, setIsReplenishOpen] = useState(false)
    const [isRecipeOpen, setIsRecipeOpen] = useState(false)
    const [isSaleSimulatorOpen, setIsSaleSimulatorOpen] = useState(false)
    const [isAddMovementOpen, setIsAddMovementOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
    const [selectedSupplier, ] = useState<Supplier | null>(null)

    // Selected item states
    const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
    const [itemToDelete, setItemToDelete] = useState<StockItem | null>(null)

    // Form states
    const [newProduct, setNewProduct] = useState({
        name: "",
        unit: "",
        category: "",
        quantity: "",
        minQuantity: "",
        maxQuantity: "",
        supplier: "",
        notes: "",
        cost: "",
        expiryDate: "",
        location: "",
        autoReorder: false,
        reorderPoint: "",
        reorderQuantity: "",
    })

    const [editProduct, setEditProduct] = useState<StockItem | null>(null)
    const [addStockQuantity, setAddStockQuantity] = useState("")
    const [replenishQuantity, setReplenishQuantity] = useState("")

    // Recipe form
    const [newRecipe, setNewRecipe] = useState({
        menuItemId: "new",
        dishName: "",
        servings: "1",
        ingredients: [{ productId: "", quantity: "", unit: "", displayUnit: "" }],
    })

    const [editRecipe, setEditRecipe] = useState<typeof newRecipe & { _id?: string } | null>(null)
    const [isEditRecipeOpen, setIsEditRecipeOpen] = useState(false)

    useEffect(() => {
        async function loadItems() {
            if (menus.length === 0) return;
            const all: Item[] = [];
            for (const menu of menus) {
                try {
                    const items = await menuApi.getMenuItemsBySlug(menu.slug);
                    all.push(...items);
                } catch (err) {
                    console.error(err);
                }
            }
            setMenuItems(all);
        }
        loadItems();
    }, [menus]);

    // Sale simulator
    const [saleForm, setSaleForm] = useState({
        dishId: "",
        quantity: "1",
    })

    const [movementForm, setMovementForm] = useState({
        productId: "",
        type: "entrada" as MovementCreate["type"],
        quantity: "",
        reason: "",
    })

    // Loading state
    const isLoading = isStockLoading

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10


    // Pagination helpers
    const paginatedItems = stockItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "Todas" || item.category === categoryFilter
        const matchesStatus = statusFilter === "Todos" || item.status === statusFilter
        return matchesSearch && matchesCategory && matchesStatus
    }).slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )
    const totalPages = Math.ceil(stockItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "Todas" || item.category === categoryFilter
        const matchesStatus = statusFilter === "Todos" || item.status === statusFilter
        return matchesSearch && matchesCategory && matchesStatus
    }).length / itemsPerPage)

    const getCurrentDate = () => {
        return new Date()
    }


    // Filter logic
    const filteredItems = stockItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "Todas" || item.category === categoryFilter
        const matchesStatus = statusFilter === "Todos" || item.status === statusFilter
        return matchesSearch && matchesCategory && matchesStatus
    })


    // Simulate sale and reduce stock
    const simulateSale = () => {
        const recipe = recipes.find((r) => r._id === saleForm.dishId)
        if (!recipe) {
            showErrorToast("Erro", "Prato não encontrado.")
            return
        }

        const quantity = Number.parseInt(saleForm.quantity)
        let canMakeDish = true
        const insufficientIngredients: string[] = []

        // Check if we have enough ingredients
        recipe.ingredients.forEach((ingredient) => {
            const stockItem = stockItems.find((item) => item._id === ingredient.productId.toString())
            if (!stockItem || stockItem.currentQuantity < ingredient.quantity * quantity) {
                canMakeDish = false
                insufficientIngredients.push(ingredient.productName)
            }
        })

        if (!canMakeDish) {
            showErrorToast("Stock Insuficiente", `Não há stock suficiente para: ${insufficientIngredients.join(", ")}`)
            return
        }

        showPromiseToast(
            registerSaleMutation.mutateAsync({ recipeId: recipe._id, quantity }).then(() => {
                setSaleForm({ dishId: "", quantity: "1" })
                setIsSaleSimulatorOpen(false)
            }),
            {
                loading: "Processando venda...",
                success: "Venda registada com sucesso",
                error: "Erro ao processar venda",
            }
        )
    }

    // Add new recipe
    const handleAddRecipe = () => {
        if (
            !newRecipe.menuItemId ||
            newRecipe.ingredients.some((ing) => !ing.productId || !ing.quantity)
        ) {
            showErrorToast("Erro", "Por favor, preencha todos os campos da receita.")
            return
        }

        if (
            Number.parseInt(newRecipe.servings) <= 0 ||
            newRecipe.ingredients.some((ing) => Number.parseFloat(ing.quantity) <= 0)
        ) {
            showErrorToast("Erro", "As porções e quantidades devem ser maiores que zero.")
            return
        }

        // Validar se há stock suficiente para todos os ingredientes
        const insufficientStock: string[] = []

        newRecipe.ingredients.forEach((ing) => {
            const product = stockItems.find((item) => item._id === ing.productId)
            const requiredQuantity = Number.parseFloat(ing.quantity)

            if (!product) {
                insufficientStock.push(`Produto não encontrado`)
            } else if (product.currentQuantity < requiredQuantity) {
                insufficientStock.push(
                    `${product.name} (disponível: ${product.currentQuantity} ${product.unit}, necessário: ${requiredQuantity} ${product.unit})`,
                )
            }
        })

        if (insufficientStock.length > 0) {
            showErrorToast("Stock Insuficiente", `Não há stock suficiente para: ${insufficientStock.join(", ")}`)
            return
        }

        const ingredients = newRecipe.ingredients.map((ing) => {
            const product = stockItems.find((item) => item._id === ing.productId)
            return {
                productId: ing.productId,
                productName: product?.name || "",
                quantity: Number.parseFloat(ing.quantity),
                unit: product?.unit || "",
            }
        })

        const cost = ingredients.reduce((total, ing) => {
            const product = stockItems.find((item) => item._id === ing.productId.toString())
            return total + ing.quantity * (product?.cost || 0)
        }, 0)

        const selectedItem = menuItems.find(i => i._id === newRecipe.menuItemId)
        const recipeData = {
            dishName: selectedItem?.name || newRecipe.dishName,
            menuItemId: newRecipe.menuItemId,
            ingredients,
            servings: Number.parseInt(newRecipe.servings),
            cost,
            restaurantId: restaurant._id,
        }

        showPromiseToast(
            createRecipeMutation.mutateAsync(recipeData).then(() => {
                setNewRecipe({
                    menuItemId: "",
                    dishName: "",
                    servings: "1",
                    ingredients: [{ productId: "", quantity: "", unit: "", displayUnit: "" }],
                })
                setIsRecipeOpen(false)
            }),
            {
                loading: `Criando receita ${selectedItem?.name || newRecipe.dishName}...`,
                success: "Receita criada com sucesso",
                error: "Falha ao criar receita",
            }
        )
    }

    // Add ingredient to recipe
    const addIngredientToRecipe = () => {
        setNewRecipe({
            ...newRecipe,
            ingredients: [...newRecipe.ingredients, { productId: "", quantity: "", unit: "", displayUnit: "" }],
        })
    }

    // Remove ingredient from recipe
    const removeIngredientFromRecipe = (index: number) => {
        const updatedIngredients = newRecipe.ingredients.filter((_, i) => i !== index)
        setNewRecipe({ ...newRecipe, ingredients: updatedIngredients })
    }


    // Previous functions (handleAddProduct, handleEditProduct, etc.) remain the same...
    // [Previous CRUD functions would go here - keeping them as they were]

    const handleAddProduct = () => {
        if (
            !newProduct.name ||
            !newProduct.unit ||
            !newProduct.category ||
            !newProduct.quantity ||
            !newProduct.minQuantity
        ) {
            showErrorToast("Erro", "Por favor, preencha todos os campos obrigatórios.")
            return
        }

        const quantity = Number.parseFloat(newProduct.quantity)
        const minQuantity = Number.parseFloat(newProduct.minQuantity)
        const maxQuantity = newProduct.maxQuantity ? Number.parseFloat(newProduct.maxQuantity) : undefined
        const cost = Number.parseFloat(newProduct.cost) || 0
        const reorderPoint = newProduct.reorderPoint ? Number.parseFloat(newProduct.reorderPoint) : undefined
        const reorderQuantity = newProduct.reorderQuantity ? Number.parseFloat(newProduct.reorderQuantity) : undefined

        if (
            quantity < 0 ||
            minQuantity < 0 ||
            (maxQuantity !== undefined && maxQuantity < 0) ||
            cost < 0 ||
            (reorderPoint !== undefined && reorderPoint < 0) ||
            (reorderQuantity !== undefined && reorderQuantity < 0)
        ) {
            showErrorToast("Erro", "Os valores numéricos não podem ser negativos.")
            return
        }

        if (newProduct.expiryDate) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const expiry = new Date(newProduct.expiryDate)
            if (expiry < today) {
                showErrorToast("Erro", "A data de validade não pode ser anterior à data atual.")
                return
            }
        }

        const data = {
            name: newProduct.name,
            unit: newProduct.unit,
            category: newProduct.category,
            currentQuantity: quantity,
            minQuantity,
            maxQuantity,
            supplier: newProduct.supplier,
            lastEntry: getCurrentDate().toISOString(),
            notes: newProduct.notes,
            cost,
            expiryDate: newProduct.expiryDate,
            location: newProduct.location,
            autoReorder: newProduct.autoReorder,
            reorderPoint,
            reorderQuantity,
            status: "OK" as const,
            restaurantId: restaurant._id,
        }

        showPromiseToast(
            createStockItemMutation.mutateAsync(data).then(() => {
                setNewProduct({
                    name: "",
                    unit: "",
                    category: "",
                    quantity: "",
                    minQuantity: "",
                    maxQuantity: "",
                    supplier: "",
                    notes: "",
                    cost: "",
                    expiryDate: "",
                    location: "",
                    autoReorder: false,
                    reorderPoint: "",
                    reorderQuantity: "",
                })
                setIsAddProductOpen(false)
            }),
            {
                loading: `Adicionando ${newProduct.name}...`,
                success: "Produto adicionado com sucesso",
                error: "Erro ao adicionar produto",
            }
        )

        // Reset form
        setNewProduct({
            name: "",
            unit: "",
            category: "",
            quantity: "",
            minQuantity: "",
            maxQuantity: "",
            supplier: "",
            notes: "",
            cost: "",
            expiryDate: "",
            location: "",
            autoReorder: false,
            reorderPoint: "",
            reorderQuantity: "",
        })

        // handled in toast
    }

    const handleAddStock = () => {
        if (!selectedItem || !addStockQuantity) return

        const quantity = Number.parseFloat(addStockQuantity)
        if (quantity <= 0) {
            showErrorToast("Erro", "A quantidade deve ser maior que zero.")
            return
        }

        showPromiseToast(
            addStockMutation.mutateAsync({ id: selectedItem._id, data: { quantity, reason: "Reposição manual" } }).then(() => {
                setIsAddStockOpen(false)
                setAddStockQuantity("")
                setSelectedItem(null)
            }),
            {
                loading: "Adicionando stock...",
                success: "Stock adicionado",
                error: "Erro ao adicionar stock",
            }
        )
    }

    // Export data
    const handleExportData = () => {
        const csvContent = [
            [
                "Nome",
                "Categoria",
                "Unidade",
                "Quantidade Atual",
                "Quantidade Mínima",
                "Última Entrada",
                "Fornecedor",
                "Estado",
                "Custo",
            ],
            ...filteredItems.map((item) => [
                item.name,
                item.category,
                item.unit,
                item.currentQuantity.toString(),
                item.minQuantity.toString(),
                item.lastEntry,
                item.supplier,
                item.status,
                item.cost?.toString() || "0",
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `stock_${getCurrentDate()}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        showSuccessToast("Dados exportados com sucesso")
    }

    // View details
    const handleViewDetails = (item: StockItem) => {
        setSelectedItem(item)
        setIsViewDetailsOpen(true)
    }

    // Edit item
    const handleEditItem = (item: StockItem) => {
        setEditProduct({ ...item })
        setIsEditProductOpen(true)
    }

    // Add stock to item
    const handleAddStockToItem = (item: StockItem) => {
        setSelectedItem(item)
        setIsAddStockOpen(true)
    }

    // Delete item
    const handleDeleteItem = (item: StockItem) => {
        setItemToDelete(item)
        setDeleteDialogOpen(true)
    }

    const handleEditProduct = () => {
        if (!editProduct) return
        if (
            editProduct.currentQuantity < 0 ||
            editProduct.minQuantity < 0 ||
            (editProduct.cost || 0) < 0
        ) {
            showErrorToast("Erro", "Os valores numéricos não podem ser negativos.")
            return
        }

        showPromiseToast(
            updateStockItemMutation
                .mutateAsync({ id: editProduct._id, data: editProduct })
                .then((updated) => {
                    queryClient.setQueriesData<PaginatedStockResponse>(
                        { queryKey: paginatedQueryKey },
                        (old) =>
                            old
                                ? { ...old, items: old.items.map(i => i._id === updated._id ? updated : i) }
                                : old
                    )
                    setIsEditProductOpen(false)
                    setEditProduct(null)
                }),
            {
                loading: "Atualizando produto...",
                success: "Produto atualizado com sucesso",
                error: "Erro ao atualizar produto",
            }
        )
    }

    const confirmReplenishStock = () => {
        if (!selectedItem || !replenishQuantity) return

        const quantity = Number.parseFloat(replenishQuantity)
        if (quantity <= 0) {
            showErrorToast("Erro", "A quantidade deve ser maior que zero.")
            return
        }

        showPromiseToast(
            addStockMutation.mutateAsync({ id: selectedItem._id, data: { quantity, reason: "Reposição manual" } }).then(() => {
                setIsReplenishOpen(false)
                setReplenishQuantity("")
                setSelectedItem(null)
            }),
            {
                loading: "Repondo stock...",
                success: "Stock reposto",
                error: "Erro ao repor stock",
            }
        )
    }

    const handleAddMovement = () => {
        const product = stockItems.find(i => i._id === movementForm.productId)
        if (!product || !movementForm.quantity) {
            showErrorToast("Erro", "Preencha todos os campos")
            return
        }

        const quantity = Number.parseFloat(movementForm.quantity)
        if (quantity <= 0) {
            showErrorToast("Erro", "A quantidade deve ser maior que zero.")
            return
        }
        const data: MovementCreate = {
            productId: product._id,
            productName: product.name,
            type: movementForm.type,
            quantity,
            unit: product.unit,
            date: new Date(),
            reason: movementForm.reason,
            user: `${user.firstName} ${user.lastName}`,
            cost: product.cost,
        }

        showPromiseToast(
            createMovementMutation.mutateAsync(data).then(() => {
                setIsAddMovementOpen(false)
                setMovementForm({ productId: "", type: "entrada", quantity: "", reason: "" })
            }),
            {
                loading: "Adicionando registro...",
                success: "Registro adicionado",
                error: "Erro ao adicionar registro",
            }
        )
    }

    const handleDeleteProduct = () => {
        if (!itemToDelete) return

        showPromiseToast(
            deleteStockItemMutation.mutateAsync(itemToDelete._id).then(() => {
                setDeleteDialogOpen(false)
                setItemToDelete(null)
            }),
            {
                loading: "Eliminando produto...",
                success: "Produto eliminado",
                error: "Erro ao eliminar produto",
            }
        )
    }

    const handleDeleteRecipe = (recipeId: string) => {
        showPromiseToast(
            deleteRecipeMutation.mutateAsync(recipeId),
            {
                loading: 'Eliminando receita...',
                success: 'Receita eliminada',
                error: 'Erro ao eliminar receita'
            }
        )
    }

    const handleOpenEditRecipe = (recipe: Recipe) => {
        setEditRecipe({
            _id: recipe._id,
            menuItemId: recipe.menuItemId,
            dishName: recipe.dishName,
            servings: recipe.servings.toString(),
            ingredients: recipe.ingredients.map(ing => ({
                productId: ing.productId,
                quantity: ing.quantity.toString(),
                unit: ing.unit,
                displayUnit: ing.unit,
            }))
        })
        setIsEditRecipeOpen(true)
    }

    const addIngredientToEditRecipe = () => {
        if (!editRecipe) return
        setEditRecipe({
            ...editRecipe,
            ingredients: [...editRecipe.ingredients, { productId: "", quantity: "", unit: "", displayUnit: "" }]
        })
    }

    const removeIngredientFromEditRecipe = (index: number) => {
        if (!editRecipe) return
        const updated = editRecipe.ingredients.filter((_, i) => i !== index)
        setEditRecipe({ ...editRecipe, ingredients: updated })
    }

    const handleUpdateRecipe = () => {
        if (!editRecipe) return
        if (
            !editRecipe.menuItemId ||
            editRecipe.ingredients.some(ing => !ing.productId || !ing.quantity)
        ) {
            showErrorToast("Erro", "Por favor, preencha todos os campos da receita.")
            return
        }

        if (
            Number.parseInt(editRecipe.servings) <= 0 ||
            editRecipe.ingredients.some(ing => Number.parseFloat(ing.quantity) <= 0)
        ) {
            showErrorToast("Erro", "As porções e quantidades devem ser maiores que zero.")
            return
        }

        const ingredients = editRecipe.ingredients.map(ing => {
            const product = stockItems.find(item => item._id === ing.productId)
            return {
                productId: ing.productId,
                productName: product?.name || "",
                quantity: Number.parseFloat(ing.quantity),
                unit: product?.unit || ing.unit,
            }
        })

        const cost = ingredients.reduce((total, ing) => {
            const product = stockItems.find(item => item._id === ing.productId)
            return total + ing.quantity * (product?.cost || 0)
        }, 0)

        const selectedItem = menuItems.find(i => i._id === editRecipe.menuItemId)

        const recipeData = {
            dishName: selectedItem?.name || editRecipe.dishName,
            menuItemId: editRecipe.menuItemId,
            ingredients,
            servings: Number.parseInt(editRecipe.servings),
            cost,
            restaurantId: restaurant._id
        }

        showPromiseToast(
            updateRecipeMutation.mutateAsync({ id: editRecipe._id!, data: recipeData }).then(() => {
                setIsEditRecipeOpen(false)
                setEditRecipe(null)
            }),
            {
                loading: 'Atualizando receita...',
                success: 'Receita atualizada',
                error: 'Falha ao atualizar receita'
            }
        )
    }


    return (
        <StockContext.Provider value={{ stockItems, recipes }}>
                <div className="mx-auto w-full space-y-6">
            {/* Header */}
            <div className="flex justify-end items-center">
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                    </Button>
                    <Button onClick={() => setIsAddProductOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Produto
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <StockSummary />

            {/* Main Content */}
            <Tabs defaultValue="stock" className="space-y-4">
                <TabsList className="w-full">
                    <PermissionGate section={Sections.STOCK_ITEMS} operation={"view"} mode={"hide"}>
                        <TabsTrigger value="stock">Stock</TabsTrigger>
                    </PermissionGate>
                    <PermissionGate section={Sections.STOCK_RECIPES} operation={"view"} mode={"hide"}>
                        <TabsTrigger value="recipes">Receitas</TabsTrigger>
                    </PermissionGate>
                    <PermissionGate section={Sections.STOCK_MOVEMENTS} operation={"view"} mode={"hide"}>
                        <TabsTrigger value="movements">Registros</TabsTrigger>
                    </PermissionGate>
                    <TabsTrigger className="hidden" value="suppliers">Fornecedores</TabsTrigger>
                </TabsList>

                <TabsContent value="stock" className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Pesquisar produtos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todas">Todas as Categorias</SelectItem>
                                    {Array.from(new Set(stockItems.map(item => item.category)))
                                        .sort()
                                        .map(category => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todos">Todos os Estados</SelectItem>
                                    <SelectItem value="OK">Normal</SelectItem>
                                    <SelectItem value="Baixo">Baixo</SelectItem>
                                    <SelectItem value="Crítico">Crítico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Stock Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Produtos em Stock</CardTitle>
                            <CardDescription>
                                Lista de todos os produtos no inventário
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="hidden sm:block">
                                <ScrollArea>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nome</TableHead>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead>Quantidade</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Última Entrada</TableHead>
                                            <TableHead className="text-right pr-8">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                                    <TableCell className="text-right"><Skeleton className="h-4 w-[100px]" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : paginatedItems.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-6">
                                                    Nenhum produto encontrado
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedItems.map((item) => (
                                                <TableRow key={item._id}>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell>{item.category}</TableCell>
                                                    <TableCell>
                                                        {item.currentQuantity} {item.unit}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                item.status === "OK"
                                                                    ? "default"
                                                                    : item.status === "Baixo"
                                                                    ? "secondary"
                                                                    : "destructive"
                                                            }
                                                        >
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                {formatIsosDate(new Date(item.lastEntry))}
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {`${new Date(item.lastEntry).getHours() < 10 ? "0": ""}`}{new Date(item.lastEntry).getHours()}:{`${new Date(item.lastEntry).getMinutes() < 10 ? "0": ""}`}{new Date(item.lastEntry).getMinutes()}
                                                            </TooltipContent>
                                                        </Tooltip>


                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewDetails(item)}
                                                            >
                                                                Detalhes
                                                            </Button>

                                                            <PermissionGate section={Sections.STOCK_ITEMS} operation="update" mode="hide">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleEditItem(item)}
                                                                >
                                                                    Editar
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleAddStockToItem(item)}
                                                                >
                                                                    Adicionar
                                                                </Button>
                                                            </PermissionGate>
                                                            <PermissionGate section={Sections.STOCK_ITEMS} operation="delete" mode={"hide"}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteItem(item)}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </PermissionGate>

                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                            <div className="sm:hidden space-y-2">
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <Card key={i} className="p-4">
                                            <Skeleton className="h-4 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </Card>
                                    ))
                                ) : paginatedItems.length === 0 ? (
                                    <div className="text-center py-6">Nenhum produto encontrado</div>
) : (
                                    paginatedItems.map((item) => (
                                        <StockCard
                                            key={item._id}
                                            item={item}
                                            onView={handleViewDetails}
                                            onEdit={handleEditItem}
                                            onAdd={handleAddStockToItem}
                                            onDelete={handleDeleteItem}
                                        />
                                    ))
                                )}
                            </div>
                            <div className="w-1/2 mt-6 mx-auto">
                                <PaginationManager {...paginatedStockItems}/>
                            </div>


                            {/* Pagination */}
                            {!isLoading && totalPages > 1 && (
                                <div className="flex items-center justify-end space-x-2 py-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Anterior
                                    </Button>
                                    <div className="text-sm text-muted-foreground">
                                        Página {currentPage} de {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="recipes" className="space-y-4">
                    <div className="flex justify-end">
                        <PermissionGate section={Sections.STOCK_RECIPES} operation="update" mode="hide">
                            <Button onClick={() => setIsRecipeOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Nova Receita
                            </Button>
                        </PermissionGate>

                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Receitas</CardTitle>
                            <CardDescription>Listagem de receitas cadastradas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="hidden sm:block">
                                <ScrollArea>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Prato</TableHead>
                                                <TableHead>Porções</TableHead>
                                                <TableHead>Custo</TableHead>
                                                <TableHead>Lucro</TableHead>
                                                <PermissionGate section={Sections.STOCK_RECIPES} operation="update"
                                                                mode="hide">
                                                    <TableHead className="text-right">Ações</TableHead>
                                                </PermissionGate>

                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recipes.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-6">Nenhuma receita
                                                        cadastrada</TableCell>
                                                </TableRow>
                                            ) : (
                                                recipes.map((recipe) => {
                                                    const item = menuItems.find(i => i._id === recipe.menuItemId);
                                                    const profit = (item?.price ?? 0) - recipe.cost;
                                                    return (
                                                        <TableRow key={recipe._id}>
                                                            <TableCell>{item?.name || recipe.dishName}</TableCell>
                                                            <TableCell>{recipe.servings}</TableCell>
                                                            <TableCell>{formatCurrency(recipe.cost)}</TableCell>
                                                            <TableCell className={profit < 0 ? "text-red-500" : undefined}>{formatCurrency(profit)}</TableCell>
                                                            <PermissionGate section={Sections.STOCK_RECIPES}
                                                                            operation="update" mode="hide">
                                                                <TableCell className="text-right">
                                                                    <div className="flex justify-end gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleOpenEditRecipe(recipe)}
                                                                        >
                                                                            Editar
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm"
                                                                                onClick={() => handleDeleteRecipe(recipe._id)}>
                                                                            <Trash2 className="h-4 w-4"/>
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </PermissionGate>

                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                            <div className="sm:hidden space-y-2">
                                {recipes.length === 0 ? (
                                    <div className="text-center py-6">Nenhuma receita cadastrada</div>
                                ) : (
                                    recipes.map((recipe) => (
                                        <RecipeCard
                                            key={recipe._id}
                                            recipe={recipe}
                                            menuItems={menuItems}
                                            onEdit={handleOpenEditRecipe}
                                            onDelete={handleDeleteRecipe}
                                        />
                                    ))
                                )}
                            </div>

                        </CardContent>
                        <div className="w-1/2 mt-6 mx-auto">
                            <PaginationManager {...recipesPagination}/>
                        </div>
                    </Card>

                </TabsContent>

                <TabsContent value="movements" className="space-y-4">
                    <div className="flex justify-end">
                        <PermissionGate section={Sections.STOCK_MOVEMENTS} operation={"update"} mode={"disable"}>
                            <Button onClick={() => setIsAddMovementOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Novo Registro
                            </Button>
                        </PermissionGate>

                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Registros</CardTitle>
                            <CardDescription>Lista de movimentos de stock</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="hidden sm:block">
                                <ScrollArea>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Produto</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Quantidade</TableHead>
                                                <TableHead>Data</TableHead>
                                                <TableHead>Utilizador</TableHead>
                                                <TableHead>Razão</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isMovementsLoading ? (
                                                Array.from({length: 5}).map((_, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell><Skeleton className="h-4 w-[150px]"/></TableCell>
                                                        <TableCell><Skeleton className="h-4 w-[80px]"/></TableCell>
                                                        <TableCell><Skeleton className="h-4 w-[80px]"/></TableCell>
                                                        <TableCell><Skeleton className="h-4 w-[100px]"/></TableCell>
                                                        <TableCell><Skeleton className="h-4 w-[120px]"/></TableCell>
                                                        <TableCell><Skeleton className="h-4 w-[150px]"/></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : movements.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-6">Nenhum registro
                                                        encontrado</TableCell>
                                                </TableRow>
                                            ) : (
                                                movements.map((mv) => (
                                                    <TableRow key={mv._id}>
                                                        <TableCell>{mv.productName}</TableCell>
                                                        <TableCell
                                                            className={`capitalize font-semibold ${mv.type == "entrada" ? "text-green-600" : mv.type == "saida" ? "text-red-600" : ""}`}>{mv.type}</TableCell>
                                                        <TableCell>{mv.quantity} <span
                                                            className="italic text-zinc-600 font-semibold">{mv.unit}</span></TableCell>
                                                        <TableCell>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    {formatIsosDate(mv.createdAt)}
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {`${mv.createdAt.getHours() < 10 ? "0" : ""}`}{mv.createdAt.getHours()}:{`${mv.createdAt.getMinutes() < 10 ? "0" : ""}`}{mv.createdAt.getMinutes()}
                                                                </TooltipContent>

                                                            </Tooltip>

                                                        </TableCell>
                                                        <TableCell>{mv.user}</TableCell>
                                                        <TableCell>{mv.reason}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                            <div className="sm:hidden space-y-2">
                                {isMovementsLoading ? (
                                    Array.from({length: 5}).map((_, i) => (
                                        <Card key={i} className="p-4 space-y-2">
                                            <Skeleton className="h-4 w-3/4"/>
                                            <Skeleton className="h-4 w-1/2"/>
                                            <Skeleton className="h-4 w-2/3"/>
                                        </Card>
                                    ))
                                ) : movements.length === 0 ? (
                                    <div className="text-center py-6">Nenhum registro encontrado</div>
                                ) : (
                                    movements.map((mv) => (
                                        <MovementCard key={mv._id} movement={mv}/>
                                    ))
                                )}
                            </div>
                        </CardContent>
                        <div className="w-1/2 mt-6 mx-auto">
                            <PaginationManager {...movementsPagination}/>
                        </div>
                    </Card>
                </TabsContent>

                {/* Other tabs content would go here */}
            </Tabs>

            {/* Add Product Modal */}
            <Dialog
                open={isAddProductOpen}
                onOpenChange={(open) => {
                    setIsAddProductOpen(open)
                    if (!open) {
                        setNewCategoryName("")
                        setTempCategories([])
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Produto</DialogTitle>
                        <DialogDescription>Registe um novo produto no inventário com todas as configurações.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="productName">Nome do Produto *</Label>
                                <Input
                                    id="productName"
                                    placeholder="Ex: Batata"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="category">Categoria *</Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={newProduct.category}
                                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Selecionar categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(new Set([
                                                ...stockItems.map((item) => item.category),
                                                ...tempCategories,
                                            ]))
                                                .sort()
                                                .map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button type="button" variant="outline" size="icon">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Nova Categoria</DialogTitle>
                                                <DialogDescription>Crie uma nova categoria para organizar os produtos.</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="newCategoryName">Nome da Categoria</Label>
                                                    <Input
                                                        id="newCategoryName"
                                                        placeholder="Ex: Bebidas"
                                                        value={newCategoryName}
                                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pt-4">
                                                <DialogClose asChild>
                                                    <Button variant="outline" className="flex-1">
                                                        Cancelar
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    onClick={() => {
                                                        const name = newCategoryName.trim()
                                                        if (name) {
                                                            setTempCategories(prev => [...prev, name])
                                                            setNewProduct({ ...newProduct, category: name })
                                                            setNewCategoryName("")
                                                            showSuccessToast(`Categoria "${name}" criada e selecionada.`)
                                                        }
                                                    }}
                                                    className="flex-1"
                                                >
                                                    Criar e Selecionar
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="unit">Unidade *</Label>
                                <Select
                                    value={newProduct.unit}
                                    onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Kg">Kg</SelectItem>
                                        <SelectItem value="L">L</SelectItem>
                                        <SelectItem value="Unid">Unidades</SelectItem>
                                        <SelectItem value="g">Gramas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="quantity">Quantidade Inicial *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    value={newProduct.quantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="cost">Custo por Unidade (Kz)</Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    min="0"
                                    value={newProduct.cost}
                                    onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="minQuantity">Quantidade Mínima *</Label>
                                <Input
                                    id="minQuantity"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    value={newProduct.minQuantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, minQuantity: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="maxQuantity">Quantidade Máxima</Label>
                                <Input
                                    id="maxQuantity"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    value={newProduct.maxQuantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, maxQuantity: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="supplier">Fornecedor</Label>
                                <Input
                                    id="supplier"
                                    placeholder="Nome do fornecedor"
                                    value={newProduct.supplier}
                                    onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Localização</Label>
                                <Input
                                    id="location"
                                    placeholder="Ex: Armazém A"
                                    value={newProduct.location}
                                    onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="expiryDate">Data de Validade</Label>
                                <Input
                                    id="expiryDate"
                                    type="date"
                                    min={getCurrentDate().toISOString().split("T")[0]}
                                    value={newProduct.expiryDate}
                                    onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                <Switch
                                    id="autoReorder"
                                    checked={newProduct.autoReorder}
                                    onCheckedChange={(checked) => setNewProduct({ ...newProduct, autoReorder: checked })}
                                />
                                <Label htmlFor="autoReorder">Reposição Automática</Label>
                            </div>
                        </div>

                        {newProduct.autoReorder && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <Label htmlFor="reorderPoint">Ponto de Reposição</Label>
                                <Input
                                    id="reorderPoint"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    value={newProduct.reorderPoint}
                                    onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: e.target.value })}
                                />
                                </div>
                                <div>
                                    <Label htmlFor="reorderQuantity">Quantidade a Repor</Label>
                                <Input
                                    id="reorderQuantity"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    value={newProduct.reorderQuantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, reorderQuantity: e.target.value })}
                                />
                                </div>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="notes">Observações</Label>
                            <Textarea
                                id="notes"
                                placeholder="Notas adicionais..."
                                value={newProduct.notes}
                                onChange={(e) => setNewProduct({ ...newProduct, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button onClick={() => setIsAddProductOpen(false)} variant="outline" className="flex-1">
                            Cancelar
                        </Button>
                        <Button onClick={handleAddProduct} className="flex-1">
                            Adicionar Produto
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Movement Modal */}
            <Dialog open={isAddMovementOpen} onOpenChange={setIsAddMovementOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Novo Registro</DialogTitle>
                        <DialogDescription>Crie manualmente um movimento de stock.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Produto</Label>
                            <Select value={movementForm.productId} onValueChange={(value) => setMovementForm({ ...movementForm, productId: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecionar produto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {stockItems.map(item => (
                                        <SelectItem key={item._id} value={item._id}>{item.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Tipo</Label>
                                <Select value={movementForm.type} onValueChange={(value) => setMovementForm({ ...movementForm, type: value as MovementCreate["type"] })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entrada">Entrada</SelectItem>
                                        <SelectItem value="saida">Saída</SelectItem>
                                        <SelectItem value="ajuste">Ajuste</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Quantidade</Label>
                                <Input
                                    type="number"
                                    min="0.01"
                                    value={movementForm.quantity}
                                    onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Razão</Label>
                            <Input value={movementForm.reason} onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button onClick={() => setIsAddMovementOpen(false)} variant="outline" className="flex-1">Cancelar</Button>
                        <Button onClick={handleAddMovement} className="flex-1">Adicionar</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Recipe Modal */}
            <Dialog open={isEditRecipeOpen} onOpenChange={setIsEditRecipeOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Receita</DialogTitle>
                        <DialogDescription>Altere os detalhes da receita.</DialogDescription>
                    </DialogHeader>
                    {editRecipe && (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Prato *</Label>
                                    <Select
                                        value={editRecipe.menuItemId}
                                        onValueChange={(value) => {
                                            const item = menuItems.find(i => i._id === value)
                                            setEditRecipe({ ...editRecipe, menuItemId: value, dishName: item?.name || "" })
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecionar item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {menuItems.map(item => (
                                                <SelectItem key={item._id} value={item._id}>{item.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="editServings">Porções *</Label>
                                    <Input
                                        id="editServings"
                                        type="number"
                                        placeholder="1"
                                        min={1}
                                        value={editRecipe.servings}
                                        onChange={(e) => setEditRecipe({ ...editRecipe, servings: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Ingredientes*</Label>
                                <div className="space-y-2">
                                    {editRecipe.ingredients.map((ingredient, index) => (
                                        <div key={index} className="flex space-x-2 items-start">
                                            <div>
                                                <Select
                                                    value={ingredient.productId}
                                                    onValueChange={(value) => {
                                                        const updated = [...editRecipe.ingredients]
                                                        const product = stockItems.find((item) => item._id === value)
                                                        updated[index] = { ...ingredient, productId: value, unit: product?.unit || "", displayUnit: product?.unit || ingredient.displayUnit }
                                                        setEditRecipe({ ...editRecipe, ingredients: updated })
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecionar produto" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {stockItems.filter(item => item.currentQuantity > 0).map(item => (
                                                            <SelectItem key={item._id} value={item._id}>
                                                                {item.name} ({item.unit}) - Stock: {item.currentQuantity}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                placeholder="Quantidade"
                                                value={convertBaseToDisplay(ingredient.quantity, ingredient.unit, ingredient.displayUnit || ingredient.unit)}
                                                onChange={(e) => {
                                                    const updated = [...editRecipe.ingredients]
                                                    updated[index] = { ...ingredient, quantity: convertDisplayToBase(e.target.value, ingredient.unit, ingredient.displayUnit || ingredient.unit) }
                                                    setEditRecipe({ ...editRecipe, ingredients: updated })
                                                }}
                                                className={(() => {
                                                    const product = stockItems.find((item) => item._id === ingredient.productId)
                                                    const quantity = Number.parseFloat(ingredient.quantity)
                                                    return product && quantity > product.currentQuantity ? "border-red-500 bg-red-50" : ""
                                                })()}
                                            />
                                                {(() => {
                                                    const product = stockItems.find((item) => item._id === ingredient.productId)
                                                    const quantity = Number.parseFloat(ingredient.quantity)
                                                    if (product && quantity > product.currentQuantity) {
                                                        return (
                                                            <p className="text-xs text-red-600 mt-1">
                                                                Stock insuficiente! Disponível: {product.currentQuantity} {product.unit}
                                                            </p>
                                                        )
                                                    }
                                                    if (product && ingredient.quantity) {
                                                        return (
                                                            <p className="text-xs text-green-600 mt-1">
                                                                Disponível: {product.currentQuantity} {product.unit}
                                                            </p>
                                                        )
                                                    }
                                                    return null
                                                })()}
                                            </div>
                                            <div className="flex gap-1">
                                               {ingredient.productId && (
                                                   <Select
                                                       value={ingredient.displayUnit || ingredient.unit}
                                                       onValueChange={(value) => {
                                                           const updated = [...editRecipe.ingredients]
                                                           updated[index] = { ...ingredient, displayUnit: value }
                                                           setEditRecipe({ ...editRecipe, ingredients: updated })
                                                       }}
                                                   >
                                                       <SelectTrigger>
                                                           <SelectValue />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                           {ingredient.unit && (
                                                               <SelectItem value={ingredient.unit}>{ingredient.unit}</SelectItem>
                                                           )}
                                                           {ingredient.unit === "Kg" && <SelectItem value="g">g</SelectItem>}
                                                           {ingredient.unit === "L" && <SelectItem value="ml">ml</SelectItem>}
                                                       </SelectContent>
                                                   </Select>
                                               )}
                                                {editRecipe.ingredients.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeIngredientFromEditRecipe(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addIngredientToEditRecipe} className="mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Adicionar Ingrediente
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-2 pt-4">
                        <Button onClick={() => setIsEditRecipeOpen(false)} variant="outline" className="flex-1">
                            Cancelar
                        </Button>
                        <Button onClick={handleUpdateRecipe} className="flex-1">
                            Atualizar Receita
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Recipe Modal */}
            <Dialog open={isRecipeOpen} onOpenChange={setIsRecipeOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Nova Receita</DialogTitle>
                        <DialogDescription>Crie uma receita e associe ingredientes aos pratos.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Prato *</Label>
                                <Select
                                    value={newRecipe.menuItemId}
                                    onValueChange={(value) => {
                                        const item = menuItems.find(i => i._id === value)
                                        setNewRecipe({ ...newRecipe, menuItemId: value, dishName: item?.name || "" })
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {menuItems.map(item => (
                                            <SelectItem key={item._id} value={item._id}>{item.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="servings">Porções *</Label>
                                <Input
                                    id="servings"
                                    type="number"
                                    placeholder="1"
                                    min={1}
                                    value={newRecipe.servings}
                                    onChange={(e) => setNewRecipe({ ...newRecipe, servings: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Ingredientes *</Label>
                            <div className="space-y-2">
                                {newRecipe.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex gap-2 items-start justify-between">
                                        <div>
                                            <Select
                                                value={ingredient.productId}
                                                onValueChange={(value) => {
                                                    const updatedIngredients = [...newRecipe.ingredients]
                                                    const product = stockItems.find((item) => item._id === value)
                                                    updatedIngredients[index] = {
                                                        ...ingredient,
                                                        productId: value,
                                                        unit: product?.unit || "",
                                                        displayUnit: product?.unit || "",
                                                    }
                                                    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients })
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecionar produto" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {stockItems
                                                        .filter((item) => item.currentQuantity > 0) // Apenas produtos com stock disponível
                                                        .map((item) => (
                                                            <SelectItem key={item._id} value={item._id}>
                                                                {item.name} ({item.unit}) - Stock: {item.currentQuantity}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                placeholder="Quantidade"
                                                value={convertBaseToDisplay(ingredient.quantity, ingredient.unit, ingredient.displayUnit || ingredient.unit)}
                                                onChange={(e) => {
                                                    const updatedIngredients = [...newRecipe.ingredients]
                                                    updatedIngredients[index] = { ...ingredient, quantity: convertDisplayToBase(e.target.value, ingredient.unit, ingredient.displayUnit || ingredient.unit) }
                                                    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients })
                                                }}
                                                className={(() => {
                                                    const product = stockItems.find((item) => item._id === ingredient.productId)
                                                    const quantity = Number.parseFloat(ingredient.quantity)
                                                    return product && quantity > product.currentQuantity ? "border-red-500 bg-red-50" : ""
                                                })()}
                                            />
                                            {(() => {
                                                const product = stockItems.find((item) => item._id === ingredient.productId)
                                                const quantity = Number.parseFloat(ingredient.quantity)
                                                if (product && quantity > product.currentQuantity) {
                                                    return (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            Stock insuficiente! Disponível: {product.currentQuantity} {product.unit}
                                                        </p>
                                                    )
                                                }
                                                if (product && ingredient.quantity) {
                                                    return (
                                                        <p className="text-xs text-green-600 mt-1">
                                                            Disponível: {product.currentQuantity} {product.unit}
                                                        </p>
                                                    )
                                                }
                                                return null
                                            })()}
                                        </div>
                                        <div className="flex gap-1">
                                            {ingredient.productId && (
                                                <Select
                                                    value={ingredient.displayUnit || ingredient.unit}
                                                    onValueChange={(value) => {
                                                        const updatedIngredients = [...newRecipe.ingredients]
                                                        updatedIngredients[index] = { ...ingredient, displayUnit: value }
                                                        setNewRecipe({ ...newRecipe, ingredients: updatedIngredients })
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ingredient.unit && (
                                                            <SelectItem value={ingredient.unit}>{ingredient.unit}</SelectItem>
                                                        )}
                                                        {ingredient.unit === "Kg" && <SelectItem value="g">g</SelectItem>}
                                                        {ingredient.unit === "L" && <SelectItem value="ml">ml</SelectItem>}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            {newRecipe.ingredients.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeIngredientFromRecipe(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addIngredientToRecipe} className="mt-2">
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar Ingrediente
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button onClick={() => setIsRecipeOpen(false)} variant="outline" className="flex-1">
                            Cancelar
                        </Button>
                        <Button onClick={handleAddRecipe} className="flex-1">
                            Criar Receita
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Sale Simulator Modal */}
            <Dialog open={isSaleSimulatorOpen} onOpenChange={setIsSaleSimulatorOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Simulador de Vendas</DialogTitle>
                        <DialogDescription>Simule uma venda e veja a redução automática do stock.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="dishSelect">Selecionar Prato</Label>
                            <Select value={saleForm.dishId} onValueChange={(value) => setSaleForm({ ...saleForm, dishId: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Escolher prato" />
                                </SelectTrigger>
                                {recipes.filter((recipe) => {
                                    return recipe.ingredients.every((ingredient) => {
                                        const stockItem = stockItems.find((item) => item._id === ingredient.productId.toString())
                                        return stockItem && stockItem.currentQuantity >= ingredient.quantity
                                    })
                                }).length === 0 && (
                                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                                        <p className="text-sm text-yellow-800">
                                            ⚠️ Nenhuma receita pode ser preparada com o stock atual. Reponha os ingredientes necessários ou
                                            crie novas receitas.
                                        </p>
                                    </div>
                                )}
                                <SelectContent>
                                    {recipes
                                        .filter((recipe) => {
                                            // Verificar se todos os ingredientes têm stock suficiente
                                            return recipe.ingredients.every((ingredient) => {
                                                const stockItem = stockItems.find((item) => item._id === ingredient.productId.toString())
                                                return stockItem && stockItem.currentQuantity >= ingredient.quantity
                                            })
                                        })
                                        .map((recipe) => (
                                            <SelectItem key={recipe._id} value={recipe._id}>
                                                {recipe.dishName} - Kz {recipe.cost.toFixed(2)}
                                                <span className="text-xs text-green-600 ml-2">✓ Stock disponível</span>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="saleQuantity">Quantidade</Label>
                            <Input
                                id="saleQuantity"
                                type="number"
                                min="1"
                                value={saleForm.quantity}
                                onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                            />
                        </div>
                        {saleForm.dishId && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <Label className="text-sm font-medium">Ingredientes necessários:</Label>
                                {recipes
                                    .find((r) => r._id === saleForm.dishId)
                                    ?.ingredients.map((ing, index) => (
                                        <div key={index} className="flex justify-between text-sm mt-1">
                                            <span>{ing.productName}</span>
                                            <span>
                        {(ing.quantity * Number.parseInt(saleForm.quantity)).toFixed(2)} {ing.unit}
                      </span>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button onClick={() => setIsSaleSimulatorOpen(false)} variant="outline" className="flex-1">
                            Cancelar
                        </Button>
                        <Button onClick={simulateSale} className="flex-1">
                            Processar Venda
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Stock Modal */}
            <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Adicionar Stock</DialogTitle>
                        <DialogDescription>Adicione quantidade ao produto "{selectedItem?.name}".</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="addStockQuantity">Quantidade a Adicionar</Label>
                            <Input
                                id="addStockQuantity"
                                type="number"
                                placeholder="0"
                                min="0.01"
                                value={addStockQuantity}
                                onChange={(e) => setAddStockQuantity(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">Unidade: {selectedItem?.unit}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button onClick={() => setIsAddStockOpen(false)} variant="outline" className="flex-1">
                            Cancelar
                        </Button>
                        <Button onClick={handleAddStock} className="flex-1">
                            Adicionar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Details Modal */}
            <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Produto</DialogTitle>
                        <DialogDescription>Informações completas do produto.</DialogDescription>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Nome</Label>
                                    <p className="text-sm">{selectedItem.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Categoria</Label>
                                    <p className="text-sm">{selectedItem.category}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Quantidade Atual</Label>
                                    <p className="text-sm">
                                        {selectedItem.currentQuantity} {selectedItem.unit}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Quantidade Mínima</Label>
                                    <p className="text-sm">
                                        {selectedItem.minQuantity} {selectedItem.unit}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Localização</Label>
                                    <p className="text-sm">{selectedItem.location || "N/A"}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Validade</Label>
                                    <p className="text-sm">{selectedItem.expiryDate || "N/A"}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Fornecedor</Label>
                                    <p className="text-sm">{selectedItem.supplier}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Custo por Unidade</Label>
                                    <p className="text-sm">Kz {selectedItem.cost?.toFixed(2) || "0.00"}</p>
                                </div>
                            </div>
                            {selectedItem.autoReorder && (
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <Label className="text-sm font-medium text-blue-800">Reposição Automática Ativa</Label>
                                    <p className="text-xs text-blue-600">
                                        Ponto: {selectedItem.reorderPoint} {selectedItem.unit} | Quantidade: {selectedItem.reorderQuantity}{" "}
                                        {selectedItem.unit}
                                    </p>
                                </div>
                            )}
                            {selectedItem.notes && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Observações</Label>
                                    <p className="text-sm">{selectedItem.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="pt-4">
                        <Button onClick={() => setIsViewDetailsOpen(false)} className="w-full">
                            Fechar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Product Modal */}
            <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Produto</DialogTitle>
                        <DialogDescription>Atualize as informações do produto.</DialogDescription>
                    </DialogHeader>
                    {editProduct && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="editName">Nome do Produto</Label>
                                <Input
                                    id="editName"
                                    value={editProduct.name}
                                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="editUnit">Unidade</Label>
                                    <Select
                                        value={editProduct.unit}
                                        onValueChange={(value) => setEditProduct({ ...editProduct, unit: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Kg">Kg</SelectItem>
                                            <SelectItem value="L">L</SelectItem>
                                            <SelectItem value="Unid">Unidades</SelectItem>
                                            <SelectItem value="g">Gramas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="editCategory">Categoria</Label>
                                    <Select
                                        value={editProduct.category}
                                        onValueChange={(value) => setEditProduct({ ...editProduct, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Vegetais">Vegetais</SelectItem>
                                            <SelectItem value="Carnes">Carnes</SelectItem>
                                            <SelectItem value="Laticínios">Laticínios</SelectItem>
                                            <SelectItem value="Condimentos">Condimentos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="editCurrentQuantity">Quantidade Atual</Label>
                                    <Input
                                        id="editCurrentQuantity"
                                        type="number"
                                        min="0"
                                        value={editProduct.currentQuantity}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, currentQuantity: Number.parseFloat(e.target.value) || 0 })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="editMinQuantity">Quantidade Mínima</Label>
                                    <Input
                                        id="editMinQuantity"
                                        type="number"
                                        min="0"
                                        value={editProduct.minQuantity}
                                        onChange={(e) =>
                                            setEditProduct({ ...editProduct, minQuantity: Number.parseFloat(e.target.value) || 0 })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="editSupplier">Fornecedor</Label>
                                    <Input
                                        id="editSupplier"
                                        value={editProduct.supplier}
                                        onChange={(e) => setEditProduct({ ...editProduct, supplier: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="editCost">Custo por Unidade (Kz )</Label>
                                    <Input
                                        id="editCost"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editProduct.cost || 0}
                                        onChange={(e) => setEditProduct({ ...editProduct, cost: Number.parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="editNotes">Observações</Label>
                                <Textarea
                                    id="editNotes"
                                    value={editProduct.notes || ""}
                                    onChange={(e) => setEditProduct({ ...editProduct, notes: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button onClick={() => setIsEditProductOpen(false)} variant="outline" className="flex-1">
                                    Cancelar
                                </Button>
                                <Button onClick={handleEditProduct} className="flex-1">
                                    Atualizar
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Replenish Stock Modal */}
            <Dialog open={isReplenishOpen} onOpenChange={setIsReplenishOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Repor Stock</DialogTitle>
                        <DialogDescription>Reponha o stock do produto "{selectedItem?.name}".</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <p className="text-sm text-orange-800">
                                <strong>Stock atual:</strong> {selectedItem?.currentQuantity} {selectedItem?.unit}
                            </p>
                            <p className="text-sm text-orange-800">
                                <strong>Stock mínimo:</strong> {selectedItem?.minQuantity} {selectedItem?.unit}
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="replenishQuantity">Quantidade a Adicionar</Label>
                            <Input
                                id="replenishQuantity"
                                type="number"
                                placeholder="0"
                                min="0.01"
                                value={replenishQuantity}
                                onChange={(e) => setReplenishQuantity(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">Unidade: {selectedItem?.unit}</p>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button onClick={() => setIsReplenishOpen(false)} variant="outline" className="flex-1">
                                Cancelar
                            </Button>
                            <Button onClick={confirmReplenishStock} className="flex-1">
                                Repor Stock
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar Produto</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem a certeza que deseja eliminar o produto "{itemToDelete?.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* New Order Modal */}
            <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Nova Encomenda - {selectedSupplier?.name}</DialogTitle>
                        <DialogDescription>Crie uma nova encomenda para o fornecedor selecionado.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Produtos Sugeridos para Reposição</h4>
                            {selectedSupplier &&
                                stockItems
                                    .filter(
                                        (item) =>
                                            selectedSupplier.products.includes(item._id) &&
                                            (item.currentQuantity <= item.minQuantity ||
                                                (item.autoReorder && item.reorderPoint && item.currentQuantity <= item.reorderPoint)),
                                    )
                                    .map((item) => (
                                        <div key={item._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                            <div>
                                                <span className="font-medium">{item.name}</span>
                                                <span className="text-sm text-gray-500 ml-2">
                          Stock: {item.currentQuantity} {item.unit}
                        </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm">
                                                    Sugestão: {item.reorderQuantity || item.minQuantity * 2} {item.unit}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Kz {((item.reorderQuantity || item.minQuantity * 2) * (item.cost || 0)).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Contacto</Label>
                                <p className="text-sm">{selectedSupplier?.contact}</p>
                            </div>
                            <div>
                                <Label>Email</Label>
                                <p className="text-sm">{selectedSupplier?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button onClick={() => setIsNewOrderOpen(false)} variant="outline" className="flex-1">
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                if (selectedSupplier) {
                                    const orderItems = stockItems
                                        .filter(
                                            (item) =>
                                                selectedSupplier.products.includes(item._id) &&
                                                (item.currentQuantity <= item.minQuantity ||
                                                    (item.autoReorder && item.reorderPoint && item.currentQuantity <= item.reorderPoint)),
                                        )
                                        .map((item) => ({
                                            product: item.name,
                                            currentStock: item.currentQuantity,
                                            suggestedQuantity: item.reorderQuantity || item.minQuantity * 2,
                                            estimatedCost: (item.reorderQuantity || item.minQuantity * 2) * (item.cost || 0),
                                        }))

                                    const csvContent = [
                                        ["Encomenda para:", selectedSupplier.name],
                                        ["Contacto:", selectedSupplier.contact],
                                        ["Email:", selectedSupplier.email],
                                        ["Data:", getCurrentDate()],
                                        [""],
                                        ["Produto", "Stock Atual", "Quantidade Sugerida", "Custo Estimado"],
                                        ...orderItems.map((item) => [
                                            item.product,
                                            item.currentStock.toString(),
                                            item.suggestedQuantity.toString(),
                                            `Kz ${item.estimatedCost.toFixed(2)}`,
                                        ]),
                                    ]
                                        .map((row) => row.join(","))
                                        .join("\n")

                                    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
                                    const link = document.createElement("a")
                                    const url = URL.createObjectURL(blob)
                                    link.setAttribute("href", url)
                                    link.setAttribute(
                                        "download",
                                        `encomenda_${selectedSupplier.name.replace(/\s+/g, "_")}_${getCurrentDate()}.csv`,
                                    )
                                    link.style.visibility = "hidden"
                                    document.body.appendChild(link)
                                    link.click()
                                    document.body.removeChild(link)

                                    setIsNewOrderOpen(false)
                                    showInfoToast(`Ficheiro de encomenda para ${selectedSupplier.name} foi descarregado.`)
                                }
                            }}
                            className="flex-1"
                        >
                            Gerar Encomenda
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </StockContext.Provider>
)
}


