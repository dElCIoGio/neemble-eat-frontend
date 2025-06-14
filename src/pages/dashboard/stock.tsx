import { useState, useEffect } from "react"
import {
    Plus,
    Trash2,
    Search,
    Download,
    AlertTriangle,
    Package,
    ChefHat,
    BarChart3,
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
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

// Types
interface StockItem {
    id: number
    name: string
    unit: string
    currentQuantity: number
    minQuantity: number
    maxQuantity?: number
    lastEntry: string
    supplier: string
    status: "OK" | "Baixo" | "Crítico"
    category: string
    notes?: string
    cost?: number
    expiryDate?: string
    barcode?: string
    location?: string
    autoReorder?: boolean
    reorderPoint?: number
    reorderQuantity?: number
}

interface Movement {
    id: number
    productId: number
    productName: string
    type: "entrada" | "saída" | "ajuste"
    quantity: number
    unit: string
    date: string
    reason: string
    user: string
    cost?: number
}

interface Recipe {
    id: number
    dishName: string
    ingredients: Array<{
        productId: number
        productName: string
        quantity: number
        unit: string
    }>
    servings: number
    cost: number
}

interface Supplier {
    id: number
    name: string
    contact: string
    email: string
    phone: string
    address: string
    products: number[]
    rating: number
    lastOrder?: string
}

interface Sale {
    id: number
    dishName: string
    quantity: number
    date: string
    total: number
}

export default function StockManagement() {

    // State management
    // const [activeTab, setActiveTab] = useState("stock")
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("Todas")
    const [statusFilter, setStatusFilter] = useState("Todos")
    const [newCategoryName, setNewCategoryName] = useState("")

    // Stock data
    const [stockItems, setStockItems] = useState<StockItem[]>([
        {
            id: 1,
            name: "Batata",
            unit: "Kg",
            currentQuantity: 15,
            minQuantity: 5,
            maxQuantity: 50,
            lastEntry: "10/06/2025",
            supplier: "Fornecedor A",
            status: "OK",
            category: "Vegetais",
            notes: "Batatas para fritar e cozer",
            cost: 1.2,
            expiryDate: "20/06/2025",
            barcode: "1234567890123",
            location: "Armazém A",
            autoReorder: true,
            reorderPoint: 8,
            reorderQuantity: 30,
        },
        {
            id: 2,
            name: "Cebola",
            unit: "Kg",
            currentQuantity: 3,
            minQuantity: 5,
            maxQuantity: 25,
            lastEntry: "10/06/2025",
            supplier: "Fornecedor A",
            status: "Baixo",
            category: "Vegetais",
            notes: "Cebolas brancas",
            cost: 0.8,
            expiryDate: "25/06/2025",
            location: "Armazém A",
            autoReorder: true,
            reorderPoint: 7,
            reorderQuantity: 20,
        },
        {
            id: 3,
            name: "Carne de Vaca",
            unit: "Kg",
            currentQuantity: 8,
            minQuantity: 3,
            maxQuantity: 20,
            lastEntry: "12/06/2025",
            supplier: "Talho Central",
            status: "OK",
            category: "Carnes",
            notes: "Carne para bifes",
            cost: 12.5,
            expiryDate: "15/06/2025",
            location: "Frigorífico",
            autoReorder: false,
        },
        {
            id: 4,
            name: "Ovos",
            unit: "Unid",
            currentQuantity: 24,
            minQuantity: 12,
            maxQuantity: 60,
            lastEntry: "11/06/2025",
            supplier: "Quinta dos Ovos",
            status: "OK",
            category: "Laticínios",
            notes: "Ovos frescos tamanho L",
            cost: 0.25,
            expiryDate: "18/06/2025",
            location: "Frigorífico",
            autoReorder: true,
            reorderPoint: 15,
            reorderQuantity: 36,
        },
        {
            id: 5,
            name: "Azeite",
            unit: "L",
            currentQuantity: 2,
            minQuantity: 3,
            maxQuantity: 15,
            lastEntry: "08/06/2025",
            supplier: "Azeites do Sul",
            status: "Baixo",
            category: "Condimentos",
            notes: "Azeite extra virgem",
            cost: 8.5,
            expiryDate: "08/12/2025",
            location: "Despensa",
            autoReorder: true,
            reorderPoint: 4,
            reorderQuantity: 10,
        },
    ])

    // Movements data
    const [movements, setMovements] = useState<Movement[]>([
        {
            id: 1,
            productId: 1,
            productName: "Batata",
            type: "entrada",
            quantity: 20,
            unit: "Kg",
            date: "10/06/2025",
            reason: "Compra - Fornecedor A",
            user: "Delcio",
            cost: 24.0,
        },
        {
            id: 2,
            productId: 2,
            productName: "Cebola",
            type: "saída",
            quantity: 2,
            unit: "Kg",
            date: "11/06/2025",
            reason: "Consumo - Bitoque de Vaca",
            user: "Sistema",
        },
        {
            id: 3,
            productId: 3,
            productName: "Carne de Vaca",
            type: "entrada",
            quantity: 10,
            unit: "Kg",
            date: "12/06/2025",
            reason: "Compra - Talho Central",
            user: "Delcio",
            cost: 125.0,
        },
    ])

    // Recipes data
    const [recipes, setRecipes] = useState<Recipe[]>([
        {
            id: 1,
            dishName: "Bitoque de Vaca",
            ingredients: [
                { productId: 3, productName: "Carne de Vaca", quantity: 0.2, unit: "Kg" },
                { productId: 1, productName: "Batata", quantity: 0.15, unit: "Kg" },
                { productId: 2, productName: "Cebola", quantity: 0.03, unit: "Kg" },
                { productId: 4, productName: "Ovos", quantity: 1, unit: "Unid" },
            ],
            servings: 1,
            cost: 3.85,
        },
        {
            id: 2,
            dishName: "Batatas Fritas",
            ingredients: [
                { productId: 1, productName: "Batata", quantity: 0.25, unit: "Kg" },
                { productId: 5, productName: "Azeite", quantity: 0.05, unit: "L" },
            ],
            servings: 1,
            cost: 0.73,
        },
    ])

    // Suppliers data
    const [suppliers, ] = useState<Supplier[]>([
        {
            id: 1,
            name: "Fornecedor A",
            contact: "João Silva",
            email: "joao@fornecedora.pt",
            phone: "912345678",
            address: "Rua das Flores, 123, Lisboa",
            products: [1, 2],
            rating: 4.5,
            lastOrder: "10/06/2025",
        },
        {
            id: 2,
            name: "Talho Central",
            contact: "Maria Santos",
            email: "maria@talhocentral.pt",
            phone: "923456789",
            address: "Av. da República, 456, Porto",
            products: [3],
            rating: 4.8,
            lastOrder: "12/06/2025",
        },
        {
            id: 3,
            name: "Quinta dos Ovos",
            contact: "António Costa",
            email: "antonio@quintaovos.pt",
            phone: "934567890",
            address: "Quinta da Esperança, Braga",
            products: [4],
            rating: 4.2,
            lastOrder: "11/06/2025",
        },
    ])

    console.log(suppliers)

    // Sales data (simulation)
    const [sales, setSales] = useState<Sale[]>([
        { id: 1, dishName: "Bitoque de Vaca", quantity: 5, date: "13/06/2025", total: 75.0 },
        { id: 2, dishName: "Batatas Fritas", quantity: 8, date: "13/06/2025", total: 32.0 },
        { id: 3, dishName: "Bitoque de Vaca", quantity: 3, date: "12/06/2025", total: 45.0 },
    ])

    // Modal states
    const [isAddProductOpen, setIsAddProductOpen] = useState(false)
    const [isEditProductOpen, setIsEditProductOpen] = useState(false)
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
    const [isAddStockOpen, setIsAddStockOpen] = useState(false)
    const [isReplenishOpen, setIsReplenishOpen] = useState(false)
    const [isRecipeOpen, setIsRecipeOpen] = useState(false)
    const [isSaleSimulatorOpen, setIsSaleSimulatorOpen] = useState(false)
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
        dishName: "",
        servings: "1",
        ingredients: [{ productId: "", quantity: "", unit: "" }],
    })

    // Sale simulator
    const [saleForm, setSaleForm] = useState({
        dishId: "",
        quantity: "1",
    })

    // Loading states
    const [isLoading, setIsLoading] = useState(true)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Load data on mount
    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])

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

    // Helper functions
    const updateItemStatus = (item: StockItem): StockItem => {
        let status: "OK" | "Baixo" | "Crítico" = "OK"
        if (item.currentQuantity <= item.minQuantity * 0.5) {
            status = "Crítico"
        } else if (item.currentQuantity <= item.minQuantity) {
            status = "Baixo"
        }
        return { ...item, status }
    }

    const getCurrentDate = () => {
        return new Date().toLocaleDateString("pt-PT")
    }

    const addMovement = (movement: Omit<Movement, "id">) => {
        const newMovement = {
            ...movement,
            id: Math.max(...movements.map((m) => m.id), 0) + 1,
        }
        setMovements([newMovement, ...movements])
    }

    // Check for expiring products
    const getExpiringProducts = () => {
        const today = new Date()
        const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)

        return stockItems.filter((item) => {
            if (!item.expiryDate) return false
            const expiryDate = new Date(item.expiryDate.split("/").reverse().join("-"))
            return expiryDate <= threeDaysFromNow
        })
    }

    // Auto-reorder suggestions
    // const getAutoReorderSuggestions = () => {
    //     return stockItems.filter(
    //         (item) => item.autoReorder && item.reorderPoint && item.currentQuantity <= item.reorderPoint,
    //     )
    // }

    // Calculate total stock value
    const getTotalStockValue = () => {
        return stockItems.reduce((total, item) => {
            return total + item.currentQuantity * (item.cost || 0)
        }, 0)
    }

    // Filter logic
    const filteredItems = stockItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "Todas" || item.category === categoryFilter
        const matchesStatus = statusFilter === "Todos" || item.status === statusFilter
        return matchesSearch && matchesCategory && matchesStatus
    })

    const lowStockItems = stockItems.filter((item) => item.currentQuantity <= item.minQuantity)
    const criticalStockItems = stockItems.filter((item) => item.status === "Crítico")
    const expiringProducts = getExpiringProducts()

    console.log(expiringProducts)

    // const autoReorderSuggestions = getAutoReorderSuggestions()
    const totalProducts = stockItems.length
    const okItems = stockItems.filter((item) => item.status === "OK").length
    const totalStockValue = getTotalStockValue()

    // Simulate sale and reduce stock
    const simulateSale = () => {
        const recipe = recipes.find((r) => r.id === Number.parseInt(saleForm.dishId))
        if (!recipe) {
            toast.error("Erro", {
                description: "Prato não encontrado."
            })
            return
        }

        const quantity = Number.parseInt(saleForm.quantity)
        let canMakeDish = true
        const insufficientIngredients: string[] = []

        // Check if we have enough ingredients
        recipe.ingredients.forEach((ingredient) => {
            const stockItem = stockItems.find((item) => item.id === ingredient.productId)
            if (!stockItem || stockItem.currentQuantity < ingredient.quantity * quantity) {
                canMakeDish = false
                insufficientIngredients.push(ingredient.productName)
            }
        })

        if (!canMakeDish) {
            toast.error("Stock Insuficiente", {
                description: `Não há stock suficiente para: ${insufficientIngredients.join(", ")}`,
            })
            return
        }

        // Reduce stock
        const updatedItems = stockItems.map((item) => {
            const ingredient = recipe.ingredients.find((ing) => ing.productId === item.id)
            if (ingredient) {
                const newQuantity = item.currentQuantity - ingredient.quantity * quantity
                const updatedItem = { ...item, currentQuantity: newQuantity }

                // Add movement
                addMovement({
                    productId: item.id,
                    productName: item.name,
                    type: "saída",
                    quantity: ingredient.quantity * quantity,
                    unit: item.unit,
                    date: getCurrentDate(),
                    reason: `Venda - ${recipe.dishName} (${quantity}x)`,
                    user: "Sistema",
                })

                return updateItemStatus(updatedItem)
            }
            return item
        })

        setStockItems(updatedItems)

        // Add sale record
        const newSale: Sale = {
            id: Math.max(...sales.map((s) => s.id), 0) + 1,
            dishName: recipe.dishName,
            quantity,
            date: getCurrentDate(),
            total: recipe.cost * quantity,
        }
        setSales([newSale, ...sales])

        setSaleForm({ dishId: "", quantity: "1" })
        setIsSaleSimulatorOpen(false)

        toast.info("Venda Registada", {
            description: `${quantity}x ${recipe.dishName} vendido(s). Stock atualizado automaticamente.`,
        })
    }

    // Add new recipe
    const handleAddRecipe = () => {
        if (!newRecipe.dishName || newRecipe.ingredients.some((ing) => !ing.productId || !ing.quantity)) {
            toast.error("Erro", {
                description: "Por favor, preencha todos os campos da receita.",
            })
            return
        }

        // Validar se há stock suficiente para todos os ingredientes
        const insufficientStock: string[] = []

        newRecipe.ingredients.forEach((ing) => {
            const product = stockItems.find((item) => item.id === Number.parseInt(ing.productId))
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
            toast.error("Stock Insuficiente", {
                description: `Não há stock suficiente para: ${insufficientStock.join(", ")}`,
            })
            return
        }

        const ingredients = newRecipe.ingredients.map((ing) => {
            const product = stockItems.find((item) => item.id === Number.parseInt(ing.productId))
            return {
                productId: Number.parseInt(ing.productId),
                productName: product?.name || "",
                quantity: Number.parseFloat(ing.quantity),
                unit: product?.unit || "",
            }
        })

        const cost = ingredients.reduce((total, ing) => {
            const product = stockItems.find((item) => item.id === ing.productId)
            return total + ing.quantity * (product?.cost || 0)
        }, 0)

        const recipe: Recipe = {
            id: Math.max(...recipes.map((r) => r.id), 0) + 1,
            dishName: newRecipe.dishName,
            ingredients,
            servings: Number.parseInt(newRecipe.servings),
            cost,
        }

        setRecipes([...recipes, recipe])
        setNewRecipe({
            dishName: "",
            servings: "1",
            ingredients: [{ productId: "", quantity: "", unit: "" }],
        })
        setIsRecipeOpen(false)

        toast.success("Sucesso", {
            description: `Receita "${recipe.dishName}" criada com sucesso. Custo estimado: €${cost.toFixed(2)}`,
        })
    }

    // Add ingredient to recipe
    const addIngredientToRecipe = () => {
        setNewRecipe({
            ...newRecipe,
            ingredients: [...newRecipe.ingredients, { productId: "", quantity: "", unit: "" }],
        })
    }

    // Remove ingredient from recipe
    const removeIngredientFromRecipe = (index: number) => {
        const updatedIngredients = newRecipe.ingredients.filter((_, i) => i !== index)
        setNewRecipe({ ...newRecipe, ingredients: updatedIngredients })
    }

    // Generate purchase order
    // const generatePurchaseOrder = () => {
    //     const orderItems = autoReorderSuggestions.map((item) => ({
    //         product: item.name,
    //         currentStock: item.currentQuantity,
    //         reorderPoint: item.reorderPoint,
    //         suggestedQuantity: item.reorderQuantity,
    //         supplier: item.supplier,
    //         estimatedCost: (item.reorderQuantity || 0) * (item.cost || 0),
    //     }))
    //
    //     const csvContent = [
    //         ["Produto", "Stock Atual", "Ponto de Reposição", "Quantidade Sugerida", "Fornecedor", "Custo Estimado"],
    //         ...orderItems.map((item) => [
    //             item.product,
    //             item.currentStock.toString(),
    //             item.reorderPoint?.toString() || "0",
    //             item.suggestedQuantity?.toString() || "0",
    //             item.supplier,
    //             `€${item.estimatedCost.toFixed(2)}`,
    //         ]),
    //     ]
    //         .map((row) => row.join(","))
    //         .join("\n")
    //
    //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    //     const link = document.createElement("a")
    //     const url = URL.createObjectURL(blob)
    //     link.setAttribute("href", url)
    //     link.setAttribute("download", `ordem_compra_${getCurrentDate().replace(/\//g, "-")}.csv`)
    //     link.style.visibility = "hidden"
    //     document.body.appendChild(link)
    //     link.click()
    //     document.body.removeChild(link)
    //
    //     toast("Ordem de Compra Gerada", {
    //         description: "Ficheiro CSV com sugestões de compra foi descarregado.",
    //     })
    // }


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
            toast.error("Erro", {
                description: "Por favor, preencha todos os campos obrigatórios.",
            })
            return
        }

        const newItem: StockItem = {
            id: Math.max(...stockItems.map((item) => item.id)) + 1,
            name: newProduct.name,
            unit: newProduct.unit,
            category: newProduct.category,
            currentQuantity: Number.parseFloat(newProduct.quantity),
            minQuantity: Number.parseFloat(newProduct.minQuantity),
            maxQuantity: newProduct.maxQuantity ? Number.parseFloat(newProduct.maxQuantity) : undefined,
            supplier: newProduct.supplier,
            lastEntry: getCurrentDate(),
            notes: newProduct.notes,
            cost: Number.parseFloat(newProduct.cost) || 0,
            expiryDate: newProduct.expiryDate,
            location: newProduct.location,
            autoReorder: newProduct.autoReorder,
            reorderPoint: newProduct.reorderPoint ? Number.parseFloat(newProduct.reorderPoint) : undefined,
            reorderQuantity: newProduct.reorderQuantity ? Number.parseFloat(newProduct.reorderQuantity) : undefined,
            status: "OK",
        }

        const updatedItem = updateItemStatus(newItem)
        setStockItems([...stockItems, updatedItem])

        // Add movement
        addMovement({
            productId: updatedItem.id,
            productName: updatedItem.name,
            type: "entrada",
            quantity: updatedItem.currentQuantity,
            unit: updatedItem.unit,
            date: getCurrentDate(),
            reason: "Produto inicial",
            user: "Delcio",
            cost: updatedItem.currentQuantity * (updatedItem.cost || 0),
        })

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

        setIsAddProductOpen(false)
        toast.success("Sucesso", {
            description: `Produto "${newItem.name}" adicionado com sucesso.`,
        })
    }

    const handleAddStock = () => {
        if (!selectedItem || !addStockQuantity) return

        const quantity = Number.parseFloat(addStockQuantity)
        if (quantity <= 0) {
            toast.error("Erro", {
                description: "A quantidade deve ser maior que zero.",
            })
            return
        }

        const updatedItems = stockItems.map((item) =>
            item.id === selectedItem.id
                ? updateItemStatus({
                    ...item,
                    currentQuantity: item.currentQuantity + quantity,
                    lastEntry: getCurrentDate(),
                })
                : item,
        )

        setStockItems(updatedItems)

        // Add movement
        addMovement({
            productId: selectedItem.id,
            productName: selectedItem.name,
            type: "entrada",
            quantity,
            unit: selectedItem.unit,
            date: getCurrentDate(),
            reason: "Reposição manual",
            user: "Delcio",
            cost: quantity * (selectedItem.cost || 0),
        })

        setIsAddStockOpen(false)
        setAddStockQuantity("")
        setSelectedItem(null)

        toast("Sucesso", {
            description: `Adicionado ${quantity} ${selectedItem.unit} ao stock de "${selectedItem.name}".`,
        })
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
        link.setAttribute("download", `stock_${getCurrentDate().replace(/\//g, "-")}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success("Sucesso", {
            description: "Dados exportados com sucesso.",
        })
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

        const updatedItems = stockItems.map((item) => (item.id === editProduct.id ? { ...editProduct } : item))

        setStockItems(updatedItems)
        setIsEditProductOpen(false)
        setEditProduct(null)

        toast.success("Sucesso", {
            description: `Produto "${editProduct.name}" atualizado com sucesso.`,
        })
    }

    const confirmReplenishStock = () => {
        if (!selectedItem || !replenishQuantity) return

        const quantity = Number.parseFloat(replenishQuantity)
        if (quantity <= 0) {
            toast.error("Erro", {
                description: "A quantidade deve ser maior que zero.",
            })
            return
        }

        const updatedItems = stockItems.map((item) =>
            item.id === selectedItem.id
                ? updateItemStatus({
                    ...item,
                    currentQuantity: item.currentQuantity + quantity,
                    lastEntry: getCurrentDate(),
                })
                : item,
        )

        setStockItems(updatedItems)

        // Add movement
        addMovement({
            productId: selectedItem.id,
            productName: selectedItem.name,
            type: "entrada",
            quantity,
            unit: selectedItem.unit,
            date: getCurrentDate(),
            reason: "Reposição manual",
            user: "Delcio",
            cost: quantity * (selectedItem.cost || 0),
        })

        setIsReplenishOpen(false)
        setReplenishQuantity("")
        setSelectedItem(null)

        toast.success("Sucesso", {
            description: `Reposto ${quantity} ${selectedItem.unit} de "${selectedItem.name}".`,
        })
    }

    const handleDeleteProduct = () => {
        if (!itemToDelete) return

        const updatedItems = stockItems.filter((item) => item.id !== itemToDelete.id)
        setStockItems(updatedItems)
        setDeleteDialogOpen(false)
        setItemToDelete(null)

        toast.success("Sucesso", {
            description: "Produto eliminado com sucesso.",
        })
    }

    // const handleReplenishStock = (item: StockItem) => {
    //     const suggestedQuantity = Math.max(item.minQuantity * 2 - item.currentQuantity, item.minQuantity)
    //     setReplenishQuantity(suggestedQuantity.toString())
    //     setSelectedItem(item)
    //     setIsReplenishOpen(true)
    // }
    //
    // const handleNewOrder = (supplier: Supplier) => {
    //     setSelectedSupplier(supplier)
    //     setIsNewOrderOpen(true)
    // }

    return (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            {okItems} produtos em estado normal
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stock Baixo</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockItems.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {criticalStockItems.length} em estado crítico
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{totalStockValue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Valor total do inventário
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                        <ChefHat className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recipes.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Receitas cadastradas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="stock" className="space-y-4">
                <TabsList className="w-full">
                    <TabsTrigger value="stock">Stock</TabsTrigger>
                    <TabsTrigger value="recipes">Receitas</TabsTrigger>
                    <TabsTrigger value="sales">Vendas</TabsTrigger>
                    <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
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
                            <ScrollArea className="">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Categoria</TableHead>
                                            <TableHead>Quantidade</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Última Entrada</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
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
                                                <TableRow key={item.id}>
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
                                                    <TableCell>{item.lastEntry}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewDetails(item)}
                                                            >
                                                                Detalhes
                                                            </Button>
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
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteItem(item)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>

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

                {/* Other tabs content would go here */}
            </Tabs>

            {/* Add Product Modal */}
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
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
                                            {Array.from(
                                                new Set([
                                                    "Vegetais",
                                                    "Carnes",
                                                    "Laticínios",
                                                    "Condimentos",
                                                    ...stockItems.map((item) => item.category),
                                                ]),
                                            )
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
                                                        if (newCategoryName.trim()) {
                                                            setNewProduct({ ...newProduct, category: newCategoryName.trim() })
                                                            setNewCategoryName("")
                                                            toast.success("Categoria Criada", {
                                                                description: `Categoria "${newCategoryName.trim()}" criada e selecionada.`,
                                                            })
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
                                    value={newProduct.quantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="cost">Custo por Unidade (€)</Label>
                                <Input
                                    id="cost"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
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
                                <Label htmlFor="dishName">Nome do Prato *</Label>
                                <Input
                                    id="dishName"
                                    placeholder="Ex: Bitoque de Vaca"
                                    value={newRecipe.dishName}
                                    onChange={(e) => setNewRecipe({ ...newRecipe, dishName: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="servings">Porções *</Label>
                                <Input
                                    id="servings"
                                    type="number"
                                    placeholder="1"
                                    value={newRecipe.servings}
                                    onChange={(e) => setNewRecipe({ ...newRecipe, servings: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Ingredientes *</Label>
                            <div className="space-y-2">
                                {newRecipe.ingredients.map((ingredient, index) => (
                                    <div key={index} className="grid grid-cols-3 gap-2 items-end">
                                        <div>
                                            <Select
                                                value={ingredient.productId}
                                                onValueChange={(value) => {
                                                    const updatedIngredients = [...newRecipe.ingredients]
                                                    const product = stockItems.find((item) => item.id === Number.parseInt(value))
                                                    updatedIngredients[index] = {
                                                        ...ingredient,
                                                        productId: value,
                                                        unit: product?.unit || "",
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
                                                            <SelectItem key={item.id} value={item.id.toString()}>
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
                                                placeholder="Quantidade"
                                                value={ingredient.quantity}
                                                onChange={(e) => {
                                                    const updatedIngredients = [...newRecipe.ingredients]
                                                    updatedIngredients[index] = { ...ingredient, quantity: e.target.value }
                                                    setNewRecipe({ ...newRecipe, ingredients: updatedIngredients })
                                                }}
                                                className={(() => {
                                                    const product = stockItems.find((item) => item.id === Number.parseInt(ingredient.productId))
                                                    const quantity = Number.parseFloat(ingredient.quantity)
                                                    return product && quantity > product.currentQuantity ? "border-red-500 bg-red-50" : ""
                                                })()}
                                            />
                                            {(() => {
                                                const product = stockItems.find((item) => item.id === Number.parseInt(ingredient.productId))
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
                                            <Input value={ingredient.unit} placeholder="Unidade" disabled className="bg-gray-100" />
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
                                        const stockItem = stockItems.find((item) => item.id === ingredient.productId)
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
                                                const stockItem = stockItems.find((item) => item.id === ingredient.productId)
                                                return stockItem && stockItem.currentQuantity >= ingredient.quantity
                                            })
                                        })
                                        .map((recipe) => (
                                            <SelectItem key={recipe.id} value={recipe.id.toString()}>
                                                {recipe.dishName} - €{recipe.cost.toFixed(2)}
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
                                    .find((r) => r.id === Number.parseInt(saleForm.dishId))
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
                                    <p className="text-sm">€{selectedItem.cost?.toFixed(2) || "0.00"}</p>
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
                                    <Label htmlFor="editCost">Custo por Unidade (€)</Label>
                                    <Input
                                        id="editCost"
                                        type="number"
                                        step="0.01"
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
                                            selectedSupplier.products.includes(item.id) &&
                                            (item.currentQuantity <= item.minQuantity ||
                                                (item.autoReorder && item.reorderPoint && item.currentQuantity <= item.reorderPoint)),
                                    )
                                    .map((item) => (
                                        <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
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
                                                    €{((item.reorderQuantity || item.minQuantity * 2) * (item.cost || 0)).toFixed(2)}
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
                                                selectedSupplier.products.includes(item.id) &&
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
                                            `€${item.estimatedCost.toFixed(2)}`,
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
                                        `encomenda_${selectedSupplier.name.replace(/\s+/g, "_")}_${getCurrentDate().replace(/\//g, "-")}.csv`,
                                    )
                                    link.style.visibility = "hidden"
                                    document.body.appendChild(link)
                                    link.click()
                                    document.body.removeChild(link)

                                    setIsNewOrderOpen(false)
                                    toast.info("Encomenda Gerada", {
                                        description: `Ficheiro de encomenda para ${selectedSupplier.name} foi descarregado.`,
                                    })
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
    )
}
