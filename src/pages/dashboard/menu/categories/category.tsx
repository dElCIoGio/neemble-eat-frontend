import { useState, useEffect } from "react"
import { ArrowLeft, Edit2, Save, X, Tag, Plus, Trash2, EyeOff, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link, useParams } from "react-router"
import { Category } from "@/types/category"
import type { Item } from "@/types/item"
import { useGetCategoryBySlug, useGetCategoryItems } from "@/api/endpoints/categories/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { categoryApi } from "@/api/endpoints/categories/requests"
import { itemsApi } from "@/api/endpoints/item/requests"
import { notifications } from "@/lib/notifications"

export default function CategoryDetailsPage() {
    const { categoryId } = useParams() as unknown as { categoryId: string }
    const queryClient = useQueryClient()
    const { data: category, isLoading } = useGetCategoryBySlug(categoryId)
    const { data: items, isLoading: itemsLoading } = useGetCategoryItems(category?._id)

    const [isEditing, setIsEditing] = useState<Record<string, boolean>>({})
    const [editValues, setEditValues] = useState<Partial<Category>>({})
    const [newTag, setNewTag] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [openItemId, setOpenItemId] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null)
    const [pendingDelete, setPendingDelete] = useState(false)

    useEffect(() => {
        if (category) {
            setEditValues(category)
        }
    }, [category])

    const startEditing = (field: string) => {
        if (!category) return
        setIsEditing((prev) => ({ ...prev, [field]: true }))
        setEditValues((prev) => ({ ...prev, [field]: category[field as keyof Category] }))
    }

    const cancelEditing = (field: string) => {
        if (!category) return
        setIsEditing((prev) => ({ ...prev, [field]: false }))
        setEditValues((prev) => ({ ...prev, [field]: category[field as keyof Category] }))
        setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    const saveField = async (field: string) => {
        if (!category) return
        const value = editValues[field as keyof Category]

        // Validation
        if (field === "name" && (!value || (value as string).trim() === "")) {
            setErrors((prev) => ({ ...prev, [field]: "Category name is required" }))
            return
        }

        if (field === "description" && (!value || (value as string).trim() === "")) {
            setErrors((prev) => ({ ...prev, [field]: "Description is required" }))
            return
        }

        if (field === "position" && (value as number) < 0) {
            setErrors((prev) => ({ ...prev, [field]: "Position must be 0 or greater" }))
            return
        }

        try {
            // Update category in backend
            await categoryApi.updateCategory(category._id, { [field]: value })
            
            // Update local state
            queryClient.setQueryData<Category>(["category slug", categoryId], (oldData) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    [field]: value,
                    updatedAt: new Date().toISOString(),
                }
            })

            setIsEditing((prev) => ({ ...prev, [field]: false }))
            setErrors((prev) => ({ ...prev, [field]: "" }))
            setHasUnsavedChanges(true)
            notifications.success("Category updated successfully")
        } catch (error) {
            notifications.error("Failed to update category")
            console.error(error)
        }
    }

    const handleInputChange = (field: string, value: unknown) => {
        setEditValues((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const addTag = async () => {
        if (!category) return
        if (newTag.trim() && !category.tags?.includes(newTag.trim())) {
            try {
                const updatedTags = [...(category.tags || []), newTag.trim()]
                await categoryApi.updateCategory(category._id, { tags: updatedTags })
                
                queryClient.setQueryData<Category>(["category slug", categoryId], (oldData) => {
                    if (!oldData) return oldData
                    return {
                        ...oldData,
                        tags: updatedTags,
                        updatedAt: new Date().toISOString(),
                    }
                })
                
                setNewTag("")
                setHasUnsavedChanges(true)
                notifications.success("Tag added successfully")
            } catch (error) {
                notifications.error("Failed to add tag")
                console.error(error)
            }
        }
    }

    const removeTag = async (tagToRemove: string) => {
        if (!category) return
        try {
            const updatedTags = category.tags?.filter((tag) => tag !== tagToRemove) || []
            await categoryApi.updateCategory(category._id, { 
                tags: updatedTags.length > 0 ? updatedTags : null 
            })
            
            queryClient.setQueryData<Category>(["category slug", categoryId], (oldData) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    tags: updatedTags.length > 0 ? updatedTags : null,
                    updatedAt: new Date().toISOString(),
                }
            })
            
            setHasUnsavedChanges(true)
            notifications.success("Tag removed successfully")
        } catch (error) {
            notifications.error("Failed to remove tag")
            console.error(error)
        }
    }

    const toggleActive = async () => {
        if (!category) return
        try {
            await categoryApi.updateCategory(category._id, { isActive: !category.isActive })
            
            queryClient.setQueryData<Category>(["category slug", categoryId], (oldData) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    isActive: !oldData.isActive,
                    updatedAt: new Date().toISOString(),
                }
            })
            
            setHasUnsavedChanges(true)
            notifications.success(`Category ${!category.isActive ? "activated" : "deactivated"} successfully`)
        } catch (error) {
            notifications.error("Failed to update category status")
            console.error(error)
        }
    }

    const handleSaveAll = async () => {
        if (!category) return
        try {
            await categoryApi.updateCategory(category._id, editValues)
            setHasUnsavedChanges(false)
            notifications.success("All changes saved successfully")
        } catch (error) {
            notifications.error("Failed to save changes")
            console.error(error)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent, field: string) => {
        if (e.key === "Enter") {
            saveField(field)
        } else if (e.key === "Escape") {
            cancelEditing(field)
        }
    }

    const handleBlur = (field: string) => (e: React.FocusEvent<HTMLElement>) => {
        const related = e.relatedTarget as HTMLElement | null
        if (related?.dataset?.action === "cancel") {
            cancelEditing(field)
        } else {
            saveField(field)
        }
    }

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addTag()
        }
    }

    const handleToggleAvailability = async (item: Item) => {
        try {
            const updated = await itemsApi.switchItemAvailability(item._id)
            queryClient.setQueryData<Item[]>(["category items", category?._id], (old) =>
                old ? old.map((it) => it._id === updated._id ? updated : it) : []
            )
            notifications.success("Item atualizado com sucesso")
        } catch  {
            notifications.error("Falha ao atualizar item")
        }
    }

    const confirmDeleteItem = async () => {
        if (!itemToDelete || !category) return
        try {
            await itemsApi.deleteItem(itemToDelete._id)
            queryClient.setQueryData<Item[]>(["category items", category._id], (old) =>
                old ? old.filter((it) => it._id !== itemToDelete._id) : []
            )
            notifications.success("Item removido da categoria")
        } catch {
            notifications.error("Falha ao remover item")
        } finally {
            setDeleteDialogOpen(false)
            setItemToDelete(null)
        }
    }

    if (isLoading || itemsLoading || !category) {
        return <div>Loading...</div>
    }

    return (
        <div className="">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-4 items-center gap-4">
                        <Link to={`../../?tab=categories`}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2"/>
                                Voltar para Categorias
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                            <p className="text-gray-500 text-sm">
                                Criado em {new Date(category.createdAt).toLocaleDateString()} • Última atualização em{" "}
                                {new Date(category.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasUnsavedChanges && (
                            <Button onClick={handleSaveAll} className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Alterações
                            </Button>
                        )}
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                    </div>
                </div>

                {hasUnsavedChanges && (
                    <Alert className="mb-6">
                        <AlertDescription>Você tem alterações não salvas. Não se esqueça de salvar seu trabalho!</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Básicas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Category Name */}
                                <div className="space-y-2">
                                    <Label>Nome da Categoria</Label>
                                    {isEditing.name ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={editValues.name || ""}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                onKeyDown={(e) => handleKeyPress(e, "name")}
                                                onBlur={handleBlur("name")}
                                                className={errors.name ? "border-red-500" : ""}
                                                autoFocus
                                            />
                                            <Button size="sm" onClick={() => saveField("name")}>
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" data-action="cancel" onClick={() => cancelEditing("name")}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 border rounded-md cursor-text" onClick={() => startEditing("name") }>
                                            <span className="text-lg font-medium">{category.name}</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => startEditing("name")}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label>Descrição</Label>
                                    {isEditing.description ? (
                                        <div className="space-y-2">
                                            <Textarea
                                                value={editValues.description || ""}
                                                onChange={(e) => handleInputChange("description", e.target.value)}
                                                onBlur={handleBlur("description")}
                                                className={`${errors.description ? "border-red-500" : ""}`}
                                                rows={3}
                                                autoFocus
                                            />
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" onClick={() => saveField("description")}>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Salvar
                                                </Button>
                                                <Button size="sm" variant="outline" data-action="cancel" onClick={() => cancelEditing("description")}>
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div onClick={() => startEditing("description") }>
                                            <div className="flex items-start justify-between p-3 border rounded-md cursor-text">
                                                <p className="text-gray-700 flex-1">{category.description}</p>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => startEditing("description")}
                                                    className="ml-2"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                {/* Position */}
                                <div className="space-y-2">
                                    <Label>Posição de Exibição</Label>
                                    {isEditing.position ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                value={editValues.position || 0}
                                                onChange={(e) => handleInputChange("position", Number.parseInt(e.target.value) || 0)}
                                                onKeyDown={(e) => handleKeyPress(e, "position")}
                                                onBlur={handleBlur("position")}
                                                className={`w-24 ${errors.position ? "border-red-500" : ""}`}
                                                autoFocus
                                            />
                                            <Button size="sm" onClick={() => saveField("position")}>
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline" data-action="cancel" onClick={() => cancelEditing("position")}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between group" onClick={() => startEditing("position") }>
                                            <span className="text-gray-700 cursor-text">Posição {category.position}</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => startEditing("position")}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Status da Categoria</Label>
                                        <p className="text-sm text-gray-500">
                                            {category.isActive
                                                ? "Esta categoria está visível para os clientes"
                                                : "Esta categoria está oculta dos clientes"}
                                        </p>
                                    </div>
                                    <Switch checked={category.isActive} onCheckedChange={toggleActive} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items in Category */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Itens na Categoria</CardTitle>
                                        <CardDescription>{items?.length || 0} itens nesta categoria</CardDescription>
                                    </div>
                                    <Button size="sm" asChild>
                                        <Link to="../../items/create">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Adicionar Item
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item</TableHead>
                                                <TableHead className="hidden sm:table-cell">Preço</TableHead>
                                                <TableHead className="hidden md:table-cell">Status</TableHead>
                                                <TableHead className="w-12"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {items && items.length > 0 ? (
                                                items.map((item) => (
                                                    <TableRow key={item._id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={item.imageUrl || "/placeholder.svg"}
                                                                    alt={item.name}
                                                                    className="w-10 h-10 rounded object-cover"
                                                                />
                                                                <div>
                                                                    <div className="font-medium">{item.name}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">Kz {item.price.toFixed(2)}</TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                                                {item.isAvailable ? "Disponível" : "Indisponível"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu
                                                                open={openItemId === item._id}
                                                                onOpenChange={(open) => {
                                                                    setOpenItemId(open ? item._id : null)
                                                                    if (!open && pendingDelete && itemToDelete?._id === item._id) {
                                                                        setDeleteDialogOpen(true)
                                                                        setPendingDelete(false)
                                                                    }
                                                                }}
                                                            >
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem asChild>
                                                                        <Link to={`../../items/${item.slug}`}>
                                                                            <Edit2 className="h-4 w-4 mr-2" />
                                                                            Editar
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onSelect={() => handleToggleAvailability(item)}>
                                                                        <EyeOff className="h-4 w-4 mr-2" />
                                                                        {item.isAvailable ? "Marcar como indisponível" : "Marcar como disponível"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="text-red-600"
                                                                        onSelect={() => {
                                                                            setItemToDelete(item)
                                                                            setPendingDelete(true)
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Remover da categoria
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-4">
                                                        Nenhum item nesta categoria.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Tags */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Adicionar Tag"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={handleTagKeyPress}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button size="sm" onClick={addTag} disabled={!newTag.trim()}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {category.tags && category.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {category.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="px-3 py-1">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-2 text-gray-500 hover:text-gray-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Nenhuma tag adicionada ainda.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Category Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Estatísticas da Categoria</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{category.itemIds.length}</div>
                                        <div className="text-sm text-gray-500">Total de Itens</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {category.itemIds.length}
                                        </div>
                                        <div className="text-sm text-gray-500">Disponíveis</div>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">ID da Categoria:</span>
                                        <span className="font-mono">{category._id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Slug:</span>
                                        <span className="font-mono">{category.slug || "Não definido"}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem a certeza que deseja remover o item "{itemToDelete?.name}"?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteItem} className="bg-red-600 hover:bg-red-700">Remover</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
