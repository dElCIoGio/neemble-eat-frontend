import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, Plus, Trash2, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CustomizationOption, CustomizationRule, ItemCreate, LimitType} from "@/types/item";
import { Link, useNavigate, useParams} from "react-router";
import { itemsApi} from "@/api/endpoints/item/requests";
import { useDashboardContext} from "@/context/dashboard-context";
import { showPromiseToast, showWarningToast} from "@/utils/notifications/toast";
import { useGetMenuCategoriesBySlug} from "@/api/endpoints/categories/hooks";
import { Loader} from "@/components/ui/loader";


const limitTypeOptions: { value: LimitType; label: string; description: string }[] = [
    { value: "UP_TO", label: "Até", description: "O cliente pode selecionar até X opções" },
    { value: "EXACTLY", label: "Exatamente", description: "O cliente deve selecionar exatamente X opções" },
    { value: "AT_LEAST", label: "Pelo menos", description: "O cliente deve selecionar pelo menos X opções" },
    { value: "ALL", label: "Todos", description: "O cliente pode selecionar todas as opções" },
]

export default function CreateItemPage() {
    const [formData, setFormData] = useState<Omit<ItemCreate, "restaurantId">>({
        name: "",
        price: 0,
        categoryId: "",
        description: "",
        customizations: [],
        imageFile: undefined,
    })

    const [imagePreview, setImagePreview] = useState<string>("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleInputChange = (field: keyof typeof formData, value: string | null | boolean | LimitType | number | CustomizationOption[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const { menuId } = useParams() as unknown as { menuId: string }

    const { data: categories } = useGetMenuCategoriesBySlug(menuId)

    const { restaurant } = useDashboardContext()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState<boolean>(false)


    const handleChangeSelectedCategory = (categoryId: string) => {
        setFormData({...formData, categoryId})
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData((prev) => ({ ...prev, imageFile: file }))
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const addCustomization = () => {
        const newCustomization: CustomizationRule = {
            name: "",
            description: "",
            isRequired: false,
            limitType: "UP_TO",
            limit: 1,
            options: [],
        }
        setFormData((prev) => ({
            ...prev,
            customizations: [...prev.customizations, newCustomization],
        }))
    }

    const updateCustomization = (index: number, field: keyof CustomizationRule, value: string | null | boolean | LimitType | number | CustomizationOption[]) => {
        setFormData((prev) => ({
            ...prev,
            customizations: prev.customizations.map((custom, i) => (i === index ? { ...custom, [field]: value } : custom)),
        }))
    }

    const removeCustomization = (index: number) => {
        const customization = formData.customizations[index]
        const isPersisted = (customization as { _id?: string } | undefined)?._id

        if (!isPersisted) {
            setFormData((prev) => ({
                ...prev,
                customizations: prev.customizations.filter((_, i) => i !== index),
            }))
            return
        }

        // Customizations are local during creation, so there's no persisted case
        setFormData((prev) => ({
            ...prev,
            customizations: prev.customizations.filter((_, i) => i !== index),
        }))
    }

    const addOption = (customizationIndex: number) => {
        const newOption: CustomizationOption = {
            name: "",
            priceModifier: 0,
            maxQuantity: 1,
        }
        setFormData((prev) => ({
            ...prev,
            customizations: prev.customizations.map((custom, i) =>
                i === customizationIndex ? { ...custom, options: [...custom.options, newOption] } : custom,
            ),
        }))
    }

    const updateOption = (
        customizationIndex: number,
        optionIndex: number,
        field: keyof CustomizationOption,
        value: string | null | boolean | LimitType | number | CustomizationOption[],
    ) => {
        setFormData((prev) => ({
            ...prev,
            customizations: prev.customizations.map((custom, i) =>
                i === customizationIndex
                    ? {
                        ...custom,
                        options: custom.options.map((option, j) => (j === optionIndex ? { ...option, [field]: value } : option)),
                    }
                    : custom,
            ),
        }))
    }

    const removeOption = (customizationIndex: number, optionIndex: number) => {
        setFormData((prev) => ({
            ...prev,
            customizations: prev.customizations.map((custom, i) =>
                i === customizationIndex ? { ...custom, options: custom.options.filter((_, j) => j !== optionIndex) } : custom,
            ),
        }))
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Item name is required"
        }

        if (!formData.categoryId) {
            newErrors.categoryId = "Category is required"
        }

        if (formData.price <= 0) {
            newErrors.price = "Price must be greater than 0"
        }

        if (!formData.imageFile) {
            newErrors.imageFile = "Item image is required"
        }

        // Validate customizations
        formData.customizations.forEach((custom, customIndex) => {
            if (!custom.name.trim()) {
                newErrors[`customization-${customIndex}-name`] = "Customization name is required"
            }

            if (custom.limit <= 0) {
                newErrors[`customization-${customIndex}-limit`] = "Limit must be greater than 0"
            }

            custom.options.forEach((option, optionIndex) => {
                if (!option.name.trim()) {
                    newErrors[`option-${customIndex}-${optionIndex}-name`] = "Option name is required"
                }
                if (option.maxQuantity <= 0) {
                    newErrors[`option-${customIndex}-${optionIndex}-maxQuantity`] = "Max quantity must be greater than 0"
                }
            })
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        setIsLoading(true)

        if (!validateForm()) {
            showWarningToast("Please fill out all required fields")
            return
        }

        const data = new FormData()
        data.append("name", formData.name)
        data.append("price", formData.price.toString())
        data.append("categoryId", formData.categoryId)
        data.append("restaurantId", restaurant._id)
        data.append("customizations", JSON.stringify(formData.customizations))
        if (formData.description) data.append("description", formData.description)
        if (formData.imageFile) data.append("imageFile", formData.imageFile)

        showPromiseToast(
            itemsApi.createItem(data).then(() => {
                navigate("..")

            }).finally(() => setIsLoading(false)),
            {
                loading: `Creating item ${formData.name}...`,
                success: "Item created successfully!",
                error: "Failed to create item. Please try again.",
            }
        )
    }

    if (typeof categories == "undefined") {
        return (<div className="flex justify-center items-center">
            <Loader/>
        </div>)
    }

    return (
        <div className="">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="../..?tab=items">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar para o Cardápio
                        </Button>
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Novo Item</h1>
                    <p className="text-gray-600">
                        Adicione um novo item ao seu cardápio com todos os detalhes e personalizações necessárias.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Básicas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome do Item</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        placeholder="Enter item name"
                                        className={errors.name ? "border-red-500" : ""}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Preço</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                                        placeholder="0.00"
                                        className={errors.price ? "border-red-500" : ""}
                                    />
                                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria</Label>
                                <Select value={formData.categoryId} onValueChange={handleChangeSelectedCategory}>
                                    <SelectTrigger id="category" className={errors.categoryId ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Enter item description"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Imagem do Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="image-upload"
                                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                                            errors.imageFile ? "border-red-500" : "border-gray-300"
                                        }`}
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview || "/placeholder.svg"}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                                            </div>
                                        )}
                                        <input
                                            id="image-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>
                                {errors.imageFile && <p className="text-sm text-red-500">{errors.imageFile}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customizations */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Personalizações</CardTitle>
                                <Button type="button" onClick={addCustomization} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Adicionar Personalização
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {formData.customizations.map((customization, customIndex) => (
                                <div key={customIndex} className="space-y-4 p-4 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">Personalização {customIndex + 1}</h3>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeCustomization(customIndex)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Nome da Personalização</Label>
                                            <Input
                                                value={customization.name}
                                                onChange={(e) =>
                                                    updateCustomization(customIndex, "name", e.target.value)
                                                }
                                                placeholder="e.g., Size, Toppings"
                                                className={
                                                    errors[`customization-${customIndex}-name`]
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors[`customization-${customIndex}-name`] && (
                                                <p className="text-sm text-red-500">
                                                    {errors[`customization-${customIndex}-name`]}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Descrição</Label>
                                            <Input
                                                value={customization.description || ""}
                                                onChange={(e) => updateCustomization(customIndex, "description", e.target.value)}
                                                placeholder="Optional description"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={customization.isRequired}
                                                onCheckedChange={(checked) => updateCustomization(customIndex, "isRequired", checked)}
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
                                                            Define como o cliente pode selecionar as opções. Exemplo: "Até" permite escolher até o limite definido.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Select
                                                value={customization.limitType}
                                                onValueChange={(value) => updateCustomization(customIndex, "limitType", value as LimitType)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {limitTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <div className="flex flex-col justify-start">
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
                                                            Número de opções permitidas segundo o tipo de limite selecionado.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={customization.limit}
                                                onChange={(e) =>
                                                    updateCustomization(
                                                        customIndex,
                                                        "limit",
                                                        Number.parseInt(e.target.value) || 1,
                                                    )
                                                }
                                                className={
                                                    errors[`customization-${customIndex}-limit`]
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors[`customization-${customIndex}-limit`] && (
                                                <p className="text-sm text-red-500">
                                                    {errors[`customization-${customIndex}-limit`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Options */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-medium">Opções</Label>
                                            <Button type="button" variant="outline" size="sm" onClick={() => addOption(customIndex)}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Adicionar Opção
                                            </Button>
                                        </div>

                                        {customization.options.length === 0 ? (
                                            <Alert>
                                                <AlertDescription>Add at least one option for customers to choose from.</AlertDescription>
                                            </Alert>
                                        ) : (
                                            <div className="space-y-3">
                                                {customization.options.map((option, optionIndex) => (
                                                    <div key={optionIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <div className="space-y-1">
                                                                <Label className="text-xs">Option Name *</Label>
                                                                <Input
                                                                    value={option.name}
                                                                    onChange={(e) => updateOption(customIndex, optionIndex, "name", e.target.value)}
                                                                    placeholder="e.g., Small, Large"
                                                                    className={
                                                                        errors[`option-${customIndex}-${optionIndex}-name`] ? "border-red-500" : ""
                                                                    }
                                                                />
                                                                {errors[`option-${customIndex}-${optionIndex}-name`] && (
                                                                    <p className="text-xs text-red-500">
                                                                        {errors[`option-${customIndex}-${optionIndex}-name`]}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Label className="text-xs">Price Modifier</Label>
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Info className="h-3 w-3 text-muted-foreground" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                Valor adicionado ao preço base quando esta opção é escolhida.
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </div>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={option.priceModifier}
                                                                    onChange={(e) =>
                                                                        updateOption(
                                                                            customIndex,
                                                                            optionIndex,
                                                                            "priceModifier",
                                                                            Number.parseFloat(e.target.value) || 0,
                                                                        )
                                                                    }
                                                                    placeholder="0.00"
                                                                />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Label className="text-xs">Max Quantity *</Label>
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Info className="h-3 w-3 text-muted-foreground" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                Limite máximo que o cliente pode escolher desta opção.
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </div>
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    value={option.maxQuantity}
                                                                    onChange={(e) =>
                                                                        updateOption(
                                                                            customIndex,
                                                                            optionIndex,
                                                                            "maxQuantity",
                                                                            Number.parseInt(e.target.value) || 1,
                                                                        )
                                                                    }
                                                                    className={
                                                                        errors[`option-${customIndex}-${optionIndex}-maxQuantity`]
                                                                            ? "border-red-500"
                                                                            : ""
                                                                    }
                                                                />
                                                                {errors[`option-${customIndex}-${optionIndex}-maxQuantity`] && (
                                                                    <p className="text-xs text-red-500">
                                                                        {errors[`option-${customIndex}-${optionIndex}-maxQuantity`]}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeOption(customIndex, optionIndex)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {formData.customizations.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">
                                        Nenhuma personalização adicionada ainda. Adicione personalizações para permitir que os clientes
                                        personalizem este item.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Link to="/menu/1">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Criando..." : "Criar Item"}</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
