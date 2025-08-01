import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Edit2, Save, X, Upload, Plus, Trash2, DollarSign, Settings, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomizationOption, CustomizationRule, Item, LimitType, PartialItem } from "@/types/item"
import { Link, useParams } from "react-router"
import { useGetMenuCategoriesBySlug } from "@/api/endpoints/categories/hooks"
import {
    useGetItemBySlug,
    useUpdateItem,
    useToggleItemAvailability,
    useUpdateItemImage,
    useDeleteCustomization,
} from "@/api/endpoints/item/hooks"
import { showErrorToast } from "@/utils/notifications/toast"

const limitTypeOptions = [
    { value: "UP_TO", label: "Até", description: "Permite selecionar até o número máximo de opções" },
    { value: "EXACTLY", label: "Exatamente", description: "Deve selecionar exatamente este número de opções" },
    { value: "AT_LEAST", label: "Pelo menos", description: "Deve selecionar pelo menos este número de opções" },
    { value: "ALL", label: "Todas", description: "Deve selecionar todas as opções" },
]

export default function ItemDetailsPage() {
    const { itemSlug, menuId } = useParams() as unknown as { itemSlug: string; menuId: string }
    const { data: item, isLoading } = useGetItemBySlug(itemSlug)
    const { data: categories } = useGetMenuCategoriesBySlug(menuId)
    const updateItem = useUpdateItem()
    const toggleAvailability = useToggleItemAvailability()
    const updateItemImage = useUpdateItemImage()
    const deleteCustomization = useDeleteCustomization()

    const getCategoryName = (categoryId: string) => {
        const category = categories?.find((cat) => cat._id === categoryId)
        return category?.name || "Desconhecida"
    }

    const [isEditing, setIsEditing] = useState<Record<string, boolean>>({})
    const [editValues, setEditValues] = useState<PartialItem | null>(null)
    const [imagePreview, setImagePreview] = useState<string>("")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [activeTab, setActiveTab] = useState("details")
    const [customizations, setCustomizations] = useState<CustomizationRule[]>([])
    const [customizationsDirty, setCustomizationsDirty] = useState(false)

    useEffect(() => {
        if (item) {
            setEditValues({
                name: item.name,
                price: item.price,
                restaurantId: item.restaurantId,
                categoryId: item.categoryId,
                description: item.description,
                customizations: item.customizations,
                imageUrl: item.imageUrl,
                isAvailable: item.isAvailable,
                slug: item.slug
            })
            setCustomizations(item.customizations)
        }
    }, [item])

    const startEditing = (field: string) => {
        if (!item || !editValues) return
        setIsEditing((prev) => ({ ...prev, [field]: true }))
        setEditValues((prev) => prev ? { ...prev, [field]: item[field as keyof Item] } : null)
    }

    const cancelEditing = (field: string) => {
        if (!item || !editValues) return
        setIsEditing((prev) => ({ ...prev, [field]: false }))
        setEditValues((prev) => prev ? { ...prev, [field]: item[field as keyof Item] } : null)
        setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    const saveField = async (field: string) => {
        if (!item || !editValues) return
        const value = editValues[field as keyof PartialItem]

        // Validation
        if (field === "name" && (!value || (value as string).trim() === "")) {
            setErrors((prev) => ({ ...prev, [field]: "Nome do item é obrigatório" }))
            return
        }

        if (field === "price" && (value as number) <= 0) {
            setErrors((prev) => ({ ...prev, [field]: "O preço deve ser maior que 0" }))
            return
        }

        if (field === "categoryId" && !value) {
            setErrors((prev) => ({ ...prev, [field]: "Categoria é obrigatória" }))
            return
        }

        try {
            await updateItem.mutateAsync({
                itemId: item._id,
                data: {
                    [field]: value
                }
            })
            setIsEditing((prev) => ({ ...prev, [field]: false }))
            setErrors((prev) => ({ ...prev, [field]: "" }))
            setHasUnsavedChanges(false)
        } catch (error) {
            console.error(error)
            showErrorToast(`Falha ao atualizar ${field}`)
        }
    }

    const handleInputChange = (field: keyof Item, value: Item[keyof Item]) => {
        if (!editValues) return
        setEditValues((prev) => {
            if (!prev) return null
            return { ...prev, [field]: value }
        })
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!item) return
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (ev) => {
                const newPreview = ev.target?.result as string
                setImagePreview(newPreview)
            }
            reader.readAsDataURL(file)

            try {
                await updateItemImage.mutateAsync({
                    itemId: item._id,
                    file
                })
                setHasUnsavedChanges(false)
            } catch (error) {
                console.error(error)
                showErrorToast("Falha ao atualizar imagem")
            }
        }
    }

    const handleToggleAvailability = async () => {
        if (!item) return
        try {
            await toggleAvailability.mutateAsync(item._id)
            setHasUnsavedChanges(false)
        } catch (error) {
            console.error(error)
            showErrorToast("Falha ao atualizar disponibilidade")
        }
    }

    const handleAddCustomization = () => {
        const newCustomization: CustomizationRule = {
            name: "",
            description: "",
            isRequired: false,
            limitType: "UP_TO",
            limit: 1,
            options: [],
        }
        setCustomizations((prev) => [...prev, newCustomization])
        setCustomizationsDirty(true)
    }

    const handleUpdateCustomization = (index: number, field: keyof CustomizationRule, value: CustomizationRule[keyof CustomizationRule]) => {
        setCustomizations((prev) =>
            prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
        )
        setCustomizationsDirty(true)
    }

    const handleRemoveCustomization = async (index: number) => {
        if (!item) return

        const isPersisted = index < item.customizations.length

        if (!isPersisted) {
            setCustomizations((prev) => prev.filter((_, i) => i !== index))
            setCustomizationsDirty(true)
            return
        }

        try {
            await deleteCustomization.mutateAsync({ itemId: item._id, index })
            setCustomizations((prev) => prev.filter((_, i) => i !== index))
        } catch (error) {
            console.error(error)
            showErrorToast("Falha ao excluir personalização")
        }
    }

    const handleAddOption = (customizationIndex: number) => {
        const newOption: CustomizationOption = {
            name: "",
            priceModifier: 0,
            maxQuantity: 1,
        }
        setCustomizations((prev) =>
            prev.map((c, i) =>
                i === customizationIndex
                    ? { ...c, options: [...c.options, newOption] }
                    : c
            )
        )
        setCustomizationsDirty(true)
    }

    const handleUpdateOption = (
        customizationIndex: number,
        optionIndex: number,
        field: keyof CustomizationOption,
        value: CustomizationOption[keyof CustomizationOption],
    ) => {
        setCustomizations((prev) =>
            prev.map((c, i) =>
                i === customizationIndex
                    ? {
                          ...c,
                          options: c.options.map((o, j) =>
                              j === optionIndex ? { ...o, [field]: value } : o
                          ),
                      }
                    : c
            )
        )
        setCustomizationsDirty(true)
    }

    const handleRemoveOption = (customizationIndex: number, optionIndex: number) => {
        setCustomizations((prev) =>
            prev.map((c, i) =>
                i === customizationIndex
                    ? {
                          ...c,
                          options: c.options.filter((_, j) => j !== optionIndex),
                      }
                    : c
            )
        )
        setCustomizationsDirty(true)
    }

    const handleSaveCustomizations = async () => {
        if (!item) return
        try {
            await updateItem.mutateAsync({
                itemId: item._id,
                data: {
                    customizations,
                },
            })
            setCustomizationsDirty(false)
        } catch (error) {
            console.error(error)
            showErrorToast("Falha ao salvar personalizações")
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

    if (isLoading || !item) {
        return <div>Carregando...</div>
    }

    return (
        <div className="">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-4 items-center gap-4">
                        <Link to="../../?tab=items">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar para Itens
                            </Button>
                        </Link>
                        <div className="mt-4">
                            <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
                            <p className="text-gray-500 text-sm">
                                Criado em {new Date(item.createdAt).toLocaleDateString()} • Última atualização {" "}
                                {new Date(item.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasUnsavedChanges && (
                            <Button onClick={() => saveField("name")} className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Alterações
                            </Button>
                        )}
                        <Badge variant={item.isAvailable ? "default" : "secondary"}>
                            {item.isAvailable ? "Disponível" : "Indisponível"}
                        </Badge>
                    </div>
                </div>

                {hasUnsavedChanges && (
                    <Alert className="mb-6">
                        <AlertDescription>Você tem alterações não salvas. Não se esqueça de salvar seu trabalho!</AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="details">Detalhes do Item</TabsTrigger>
                        <TabsTrigger value="customizations">Personalizações ({customizations.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informações Básicas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Item Name */}
                                        <div className="space-y-2">
                                            <Label>Nome do Item</Label>
                                            {isEditing.name ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={editValues?.name || ""}
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
                                                <div className="flex items-center justify-between group" onClick={() => startEditing("name") }>
                                                    <span className="text-lg font-medium cursor-text">{item.name}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => startEditing("name")}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                        </div>

                                        {/* Price */}
                                        <div className="space-y-2">
                                            <Label>Preço</Label>
                                            {isEditing.price ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={editValues?.price || 0}
                                                            onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                                                            onKeyDown={(e) => handleKeyPress(e, "price")}
                                                            onBlur={handleBlur("price")}
                                                            className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <Button size="sm" onClick={() => saveField("price")}>
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" data-action="cancel" onClick={() => cancelEditing("price")}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between group" onClick={() => startEditing("price") }>
                                                    <span className="text-lg font-medium text-green-600 cursor-text">${item.price.toFixed(2)}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => startEditing("price")}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                        </div>

                                        {/* Category */}
                                        <div className="space-y-2">
                                            <Label>Categoria</Label>
                                            {isEditing.categoryId ? (
                                                <div className="flex items-center gap-2">
                                                    <Select
                                                        value={editValues?.categoryId || ""}
                                                        onValueChange={(value) => {handleInputChange("categoryId", value); saveField("categoryId")}}
                                                    >
                                                        <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                                                            <SelectValue placeholder="Selecione a categoria" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories?.map((category) => (
                                                                <SelectItem key={category._id} value={category._id}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button size="sm" onClick={() => saveField("categoryId")}> 
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" data-action="cancel" onClick={() => cancelEditing("categoryId")}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between group" onClick={() => startEditing("categoryId") }>
                                                    <span className="text-lg font-medium cursor-text">{getCategoryName(item.categoryId)}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => startEditing("categoryId")}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label>Descrição</Label>
                                            {isEditing.description ? (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        value={editValues?.description || ""}
                                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                                        onBlur={handleBlur("description")}
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
                                                <div className="group" onClick={() => startEditing("description") }>
                                                    <div className="flex items-start justify-between p-3 border border-transparent rounded-md hover:border-gray-200 transition-colors cursor-text">
                                                        <p className="text-gray-700 flex-1">{item.description || "Nenhuma descrição fornecida"}</p>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => startEditing("description")}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Availability Status */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Disponibilidade do Item</Label>
                                                <p className="text-sm text-gray-500">
                                                    {item.isAvailable
                                                        ? "Este item está disponível para os clientes"
                                                        : "Este item está indisponível no momento"}
                                                </p>
                                            </div>
                                            <Switch checked={item.isAvailable} onCheckedChange={handleToggleAvailability} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-4">
                                {/* Item Image */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Imagem do Item</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <img
                                                src={imagePreview || item.imageUrl || "/placeholder.svg"}
                                                alt={item.name}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
                                            >
                                                <Upload className="w-6 h-6 mb-2 text-gray-500" />
                                                <p className="text-sm text-gray-500">Alterar imagem</p>
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Item Statistics */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Estatísticas do Item</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">{customizations.length}</div>
                                                <div className="text-sm text-gray-500">Personalizações</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {customizations.reduce((total, custom) => total + custom.options.length, 0)}
                                                </div>
                                                <div className="text-sm text-gray-500">Total de Opções</div>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">ID do Item:</span>
                                                <span className="font-mono">{item._id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">ID do Restaurante:</span>
                                                <span className="font-mono">{item.restaurantId}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="customizations" className="mt-6">
                        <div className="space-y-6">
                            {customizationsDirty && (
                                <Alert>
                                    <AlertDescription>Você tem alterações de personalização não salvas.</AlertDescription>
                                </Alert>
                            )}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Personalizações</h2>
                                    <p className="text-gray-600">Gerencie as opções que os clientes podem selecionar para este item</p>
                                </div>
                                <div className="flex gap-2">
                                    {customizationsDirty && (
                                        <Button onClick={handleSaveCustomizations} className="bg-green-600 hover:bg-green-700">
                                            <Save className="h-4 w-4 mr-2" />
                                            Salvar
                                        </Button>
                                    )}
                                    <Button onClick={handleAddCustomization}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar Personalização
                                    </Button>
                                </div>
                            </div>

                            {customizations.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center py-12">
                                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma personalização ainda</h3>
                                        <p className="text-gray-500 mb-4">Adicione personalizações para permitir que os clientes personalizem este item</p>
                                        <Button onClick={handleAddCustomization}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Adicionar Primeira Personalização
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-6">
                                    {customizations.map((customization, customIndex) => (
                                        <Card key={customIndex}>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline">Personalização {customIndex + 1}</Badge>
                                                        {customization.isRequired && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                Obrigatória
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => handleRemoveCustomization(customIndex)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Nome da Personalização</Label>
                                                        <Input
                                                            value={customization.name}
                                                            onChange={(e) => handleUpdateCustomization(customIndex, "name", e.target.value)}
                                                            placeholder="ex.: Tamanho, Coberturas"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Descrição</Label>
                                                        <Input
                                                            value={customization.description || ""}
                                                            onChange={(e) => handleUpdateCustomization(customIndex, "description", e.target.value)}
                                                            placeholder="Descrição opcional"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            checked={customization.isRequired}
                                                            onCheckedChange={(checked) => handleUpdateCustomization(customIndex, "isRequired", checked)}
                                                        />
                                                        <Label>Obrigatório</Label>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-1">
                                                            <Label>Tipo de Limite</Label>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Info className="h-4 w-4 text-muted-foreground" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        Defina como os clientes podem escolher as opções. Exemplo: "Até" permite selecionar até o valor limite.
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <Select
                                                            value={customization.limitType}
                                                            onValueChange={(value) =>
                                                                handleUpdateCustomization(customIndex, "limitType", value as LimitType)
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {limitTypeOptions.map((option) => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        <div>
                                                                            <div className="font-medium">{option.label}</div>
                                                                            <div className="text-xs text-gray-500">{option.description}</div>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-1">
                                                            <Label>Limite</Label>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Info className="h-4 w-4 text-muted-foreground" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        Quantidade permitida conforme o tipo de limite selecionado.
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={customization.limit}
                                                            onChange={(e) =>
                                                                handleUpdateCustomization(customIndex, "limit", Number.parseInt(e.target.value) || 1)
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Options */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-base font-medium">Opções</Label>
                                                        <Button variant="outline" size="sm" onClick={() => handleAddOption(customIndex)}>
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Adicionar Opção
                                                        </Button>
                                                    </div>

                                                    {customization.options.length === 0 ? (
                                                        <Alert>
                                                        <AlertDescription>Adicione pelo menos uma opção para os clientes escolherem.</AlertDescription>
                                                        </Alert>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {customization.options.map((option, optionIndex) => (
                                                                <div key={optionIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                        <div className="space-y-1">
                                                                            <Label className="text-xs">Nome da Opção</Label>
                                                                            <Input
                                                            value={option.name}
                                                            onChange={(e) => handleUpdateOption(customIndex, optionIndex, "name", e.target.value)}
                                                            placeholder="ex.: Pequeno, Grande"
                                                                            />
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-1">
<Label className="text-xs">Modificador de Preço</Label>
                                                                                <TooltipProvider>
                                                                                    <Tooltip>
                                                                                        <TooltipTrigger asChild>
                                                                                            <Info className="h-3 w-3 text-muted-foreground" />
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent>
                                                                                            Valor extra somado ao preço do item quando selecionado.
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </TooltipProvider>
                                                                            </div>
                                                                            <div className="relative">
                                                                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                                                                                <Input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    value={option.priceModifier}
                                                                                    onChange={(e) =>
                                                                                        handleUpdateOption(
                                                                                            customIndex,
                                                                                            optionIndex,
                                                                                            "priceModifier",
                                                                                            Number.parseFloat(e.target.value) || 0,
                                                                                        )
                                                                                    }
                                                                                    placeholder="0.00"
                                                                                    className="pl-8"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-1">
<Label className="text-xs">Quantidade Máxima</Label>
                                                                                <TooltipProvider>
                                                                                    <Tooltip>
                                                                                        <TooltipTrigger asChild>
                                                                                            <Info className="h-3 w-3 text-muted-foreground" />
                                                                                        </TooltipTrigger>
                                                                                        <TooltipContent>
                                                                                            Máximo permitido que o cliente pode selecionar desta opção.
                                                                                        </TooltipContent>
                                                                                    </Tooltip>
                                                                                </TooltipProvider>
                                                                            </div>
                                                                            <Input
                                                                                type="number"
                                                                                min="1"
                                                                                value={option.maxQuantity}
                                                                                onChange={(e) =>
                                                                                    handleUpdateOption(
                                                                                        customIndex,
                                                                                        optionIndex,
                                                                                        "maxQuantity",
                                                                                        Number.parseInt(e.target.value) || 1,
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveOption(customIndex, optionIndex)}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
