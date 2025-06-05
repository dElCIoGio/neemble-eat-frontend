
import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {CustomizationOption, CustomizationRule, ItemCreate, LimitType} from "@/types/item";
import {Link} from "react-router";


// Mock categories for the dropdown
const mockCategories = [
    { id: "cat-1", name: "Candy" },
    { id: "cat-2", name: "Fried Food" },
    { id: "cat-3", name: "Milkshakes" },
    { id: "cat-4", name: "Appetizers" },
    { id: "cat-5", name: "Main Course" },
]

const limitTypeOptions: { value: LimitType; label: string; description: string }[] = [
    { value: "UP_TO", label: "Up to", description: "Customer can select up to X options" },
    { value: "EXACTLY", label: "Exactly", description: "Customer must select exactly X options" },
    { value: "AT_LEAST", label: "At least", description: "Customer must select at least X options" },
    { value: "ALL", label: "All", description: "Customer must select all options" },
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

        if (!validateForm()) {
            return
        }

        // Create the item with restaurant ID
        const itemToCreate: ItemCreate = {
            ...formData,
            restaurantId: "rest-1", // This would come from context/props in a real app
        }

        console.log("Creating item:", itemToCreate)
        // TODO: Implement actual item creation logic
        alert("Item created successfully!")
    }

    return (
        <div className="">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="..">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Menu
                        </Button>
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Item</h1>
                    <p className="text-gray-600">
                        Add a new item to your menu with all the necessary details and customizations.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Item Name *</Label>
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
                                    <Label htmlFor="price">Price *</Label>
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
                                <Label htmlFor="category">Category *</Label>
                                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
                                    <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockCategories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
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
                            <CardTitle>Item Image</CardTitle>
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
                                <div>
                                    <CardTitle>Customizations</CardTitle>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Add optional customizations that customers can select for this item
                                    </p>
                                </div>
                                <Button type="button" variant="outline" onClick={addCustomization}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Customization
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {formData.customizations.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No customizations added yet. Click "Add Customization" to get started.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {formData.customizations.map((customization, customIndex) => (
                                        <div key={customIndex} className="border rounded-lg p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline">Customization {customIndex + 1}</Badge>
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
                                                    <Label>Customization Name *</Label>
                                                    <Input
                                                        value={customization.name}
                                                        onChange={(e) => updateCustomization(customIndex, "name", e.target.value)}
                                                        placeholder="e.g., Size, Toppings"
                                                        className={errors[`customization-${customIndex}-name`] ? "border-red-500" : ""}
                                                    />
                                                    {errors[`customization-${customIndex}-name`] && (
                                                        <p className="text-sm text-red-500">{errors[`customization-${customIndex}-name`]}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Description</Label>
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
                                                    <Label>Required</Label>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Limit Type</Label>
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
                                                    <Label>Limit *</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={customization.limit}
                                                        onChange={(e) =>
                                                            updateCustomization(customIndex, "limit", Number.parseInt(e.target.value) || 1)
                                                        }
                                                        className={errors[`customization-${customIndex}-limit`] ? "border-red-500" : ""}
                                                    />
                                                    {errors[`customization-${customIndex}-limit`] && (
                                                        <p className="text-sm text-red-500">{errors[`customization-${customIndex}-limit`]}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Options */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-base font-medium">Options</Label>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => addOption(customIndex)}>
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
                                                                        <Label className="text-xs">Price Modifier</Label>
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
                                                                        <Label className="text-xs">Max Quantity *</Label>
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
                        <Button type="submit">Create Item</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
