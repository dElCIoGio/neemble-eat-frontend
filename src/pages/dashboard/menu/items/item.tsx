import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Edit2, Save, X, Upload, Plus, Trash2, DollarSign, Settings } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomizationOption, CustomizationRule, Item, LimitType, PartialItem } from "@/types/item"
import { Link, useParams } from "react-router"
import {
    useGetItemBySlug,
    useUpdateItem,
    useToggleItemAvailability,
} from "@/api/endpoints/item/hooks"
import { showErrorToast } from "@/utils/notifications/toast"

const limitTypeOptions = [
    { value: "UP_TO", label: "Up To", description: "Select up to a maximum number of options" },
    { value: "EXACTLY", label: "Exactly", description: "Must select exactly this number of options" },
    { value: "AT_LEAST", label: "At Least", description: "Must select at least this number of options" },
    { value: "ALL", label: "All", description: "Must select all options" },
]

export default function ItemDetailsPage() {
    const { itemSlug } = useParams() as unknown as { itemSlug: string }
    const { data: item, isLoading } = useGetItemBySlug(itemSlug)
    const updateItem = useUpdateItem()
    const toggleAvailability = useToggleItemAvailability()

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
            setErrors((prev) => ({ ...prev, [field]: "Item name is required" }))
            return
        }

        if (field === "price" && (value as number) <= 0) {
            setErrors((prev) => ({ ...prev, [field]: "Price must be greater than 0" }))
            return
        }

        if (field === "categoryId" && !value) {
            setErrors((prev) => ({ ...prev, [field]: "Category is required" }))
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
            showErrorToast(`Failed to update ${field}`)
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
        if (!item || !editValues) return
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = async (e) => {
                const newImageUrl = e.target?.result as string
                setImagePreview(newImageUrl)
                try {
                    await updateItem.mutateAsync({
                        itemId: item._id,
                        data: {
                            imageUrl: newImageUrl
                        }
                    })
                    setHasUnsavedChanges(false)
                } catch (error) {
                    console.error(error)
                    showErrorToast("Failed to update image")
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleToggleAvailability = async () => {
        if (!item) return
        try {
            await toggleAvailability.mutateAsync(item._id)
            setHasUnsavedChanges(false)
        } catch (error) {
            console.error(error)
            showErrorToast("Failed to update availability")
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

    const handleRemoveCustomization = (index: number) => {
        setCustomizations((prev) => prev.filter((_, i) => i !== index))
        setCustomizationsDirty(true)
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
            showErrorToast("Failed to save customizations")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent, field: string) => {
        if (e.key === "Enter") {
            saveField(field)
        } else if (e.key === "Escape") {
            cancelEditing(field)
        }
    }

    if (isLoading || !item) {
        return <div>Loading...</div>
    }

    return (
        <div className="">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-4 items-center gap-4">
                        <Link to="../..">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Items
                            </Button>
                        </Link>
                        <div className="mt-4">
                            <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
                            <p className="text-gray-500 text-sm">
                                Created {new Date(item.createdAt).toLocaleDateString()} • Last updated{" "}
                                {new Date(item.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasUnsavedChanges && (
                            <Button onClick={() => saveField("name")} className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        )}
                        <Badge variant={item.isAvailable ? "default" : "secondary"}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                    </div>
                </div>

                {hasUnsavedChanges && (
                    <Alert className="mb-6">
                        <AlertDescription>You have unsaved changes. Don't forget to save your work!</AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="details">Item Details</TabsTrigger>
                        <TabsTrigger value="customizations">Customizations ({customizations.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Item Name */}
                                        <div className="space-y-2">
                                            <Label>Item Name</Label>
                                            {isEditing.name ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={editValues?.name || ""}
                                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                                        onKeyDown={(e) => handleKeyPress(e, "name")}
                                                        className={errors.name ? "border-red-500" : ""}
                                                        autoFocus
                                                    />
                                                    <Button size="sm" onClick={() => saveField("name")}>
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => cancelEditing("name")}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between group">
                                                    <span className="text-lg font-medium">{item.name}</span>
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
                                            <Label>Price</Label>
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
                                                            className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <Button size="sm" onClick={() => saveField("price")}>
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => cancelEditing("price")}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between group">
                                                    <span className="text-lg font-medium text-green-600">${item.price.toFixed(2)}</span>
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

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            {isEditing.description ? (
                                                <div className="space-y-2">
                                                    <Textarea
                                                        value={editValues?.description || ""}
                                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                                        rows={3}
                                                        autoFocus
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" onClick={() => saveField("description")}>
                                                            <Save className="h-4 w-4 mr-2" />
                                                            Save
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => cancelEditing("description")}>
                                                            <X className="h-4 w-4 mr-2" />
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="group">
                                                    <div className="flex items-start justify-between p-3 border border-transparent rounded-md hover:border-gray-200 transition-colors">
                                                        <p className="text-gray-700 flex-1">{item.description || "No description provided"}</p>
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
                                                <Label>Item Availability</Label>
                                                <p className="text-sm text-gray-500">
                                                    {item.isAvailable
                                                        ? "This item is available for customers to order"
                                                        : "This item is currently unavailable"}
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
                                        <CardTitle>Item Image</CardTitle>
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
                                                <p className="text-sm text-gray-500">Change image</p>
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
                                        <CardTitle>Item Statistics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">{customizations.length}</div>
                                                <div className="text-sm text-gray-500">Customizations</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {customizations.reduce((total, custom) => total + custom.options.length, 0)}
                                                </div>
                                                <div className="text-sm text-gray-500">Total Options</div>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Item ID:</span>
                                                <span className="font-mono">{item._id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Restaurant ID:</span>
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
                                    <AlertDescription>You have unsaved customization changes.</AlertDescription>
                                </Alert>
                            )}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Customizations</h2>
                                    <p className="text-gray-600">Manage options that customers can select for this item</p>
                                </div>
                                <div className="flex gap-2">
                                    {customizationsDirty && (
                                        <Button onClick={handleSaveCustomizations} className="bg-green-600 hover:bg-green-700">
                                            <Save className="h-4 w-4 mr-2" />
                                            Save
                                        </Button>
                                    )}
                                    <Button onClick={handleAddCustomization}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Customization
                                    </Button>
                                </div>
                            </div>

                            {customizations.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center py-12">
                                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No customizations yet</h3>
                                        <p className="text-gray-500 mb-4">Add customizations to let customers personalize this item</p>
                                        <Button onClick={handleAddCustomization}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add First Customization
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
                                                        <Badge variant="outline">Customization {customIndex + 1}</Badge>
                                                        {customization.isRequired && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                Required
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
                                                        <Label>Customization Name</Label>
                                                        <Input
                                                            value={customization.name}
                                                            onChange={(e) => handleUpdateCustomization(customIndex, "name", e.target.value)}
                                                            placeholder="e.g., Size, Toppings"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Description</Label>
                                                        <Input
                                                            value={customization.description || ""}
                                                            onChange={(e) => handleUpdateCustomization(customIndex, "description", e.target.value)}
                                                            placeholder="Optional description"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            checked={customization.isRequired}
                                                            onCheckedChange={(checked) => handleUpdateCustomization(customIndex, "isRequired", checked)}
                                                        />
                                                        <Label>Required</Label>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Limit Type</Label>
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
                                                        <Label>Limit</Label>
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
                                                        <Label className="text-base font-medium">Options</Label>
                                                        <Button variant="outline" size="sm" onClick={() => handleAddOption(customIndex)}>
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Option
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
                                                                            <Label className="text-xs">Option Name</Label>
                                                                            <Input
                                                                                value={option.name}
                                                                                onChange={(e) => handleUpdateOption(customIndex, optionIndex, "name", e.target.value)}
                                                                                placeholder="e.g., Small, Large"
                                                                            />
                                                                        </div>

                                                                        <div className="space-y-1">
                                                                            <Label className="text-xs">Price Modifier</Label>
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
                                                                            <Label className="text-xs">Max Quantity</Label>
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
