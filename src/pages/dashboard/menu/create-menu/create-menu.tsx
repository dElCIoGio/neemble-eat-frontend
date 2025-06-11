import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, Eye, DollarSign, ImageIcon } from "lucide-react"
import type { MenuCreate, MenuPreferences } from "@/types/menu"
import { Link, useNavigate } from "react-router"
import { useDashboardContext } from "@/context/dashboard-context"
import { menuApi } from "@/api/endpoints/menu/requests"
import { showPromiseToast } from "@/utils/notifications/toast"

export default function CreateMenuPage() {
    const { restaurant } = useDashboardContext()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState<MenuCreate>({
        name: "",
        restaurantId: restaurant._id,
        description: "",
        isActive: true,
        preferences: {
            highlightFeaturedItems: true,
            showPrices: true,
            showItemImages: false,
        },
    })

    const handleInputChange = (field: keyof Omit<MenuCreate, "preferences">, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handlePreferenceChange = (field: keyof MenuPreferences, value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [field]: value,
            },
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            showPromiseToast(
                menuApi.createMenu(formData),
                {
                    loading: "Creating menu...",
                    success: "RestaurantMenu created successfully!",
                    error: "Failed to create menu. Please try again."
                }
            )
            navigate("..") // Navigate back to menus list
        } catch (error) {
            console.error("Error creating menu:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFormValid = formData.name.trim() && formData.restaurantId && formData.description.trim()

    return (
        <div className="">
            <div className="mx-auto">
                {/* Header */}
                <div className="space-y-6 flex flex-col gap-4 mb-8">
                    <Link to="..">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Menus
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Create New RestaurantMenu</h1>
                        <p className="text-sm text-gray-600 mt-1">Set up your menu with preferences and details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Basic Information</CardTitle>
                            <CardDescription>Essential details about your menu</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">RestaurantMenu Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Dinner RestaurantMenu, Lunch Specials"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of your menu..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    className="min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <Label htmlFor="active">Active Status</Label>
                                    <p className="text-sm text-gray-600">Make this menu available to customers</p>
                                </div>
                                <Switch
                                    id="active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* RestaurantMenu Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Display Preferences</CardTitle>
                            <CardDescription>Customize how your menu appears to customers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Eye className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label htmlFor="highlight">Highlight Featured Items</Label>
                                        <p className="text-sm text-gray-600">Make special items stand out visually</p>
                                    </div>
                                </div>
                                <Switch
                                    id="highlight"
                                    checked={formData.preferences.highlightFeaturedItems}
                                    onCheckedChange={(checked) => handlePreferenceChange("highlightFeaturedItems", checked)}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label htmlFor="prices">Show Prices</Label>
                                        <p className="text-sm text-gray-600">Display item prices on the menu</p>
                                    </div>
                                </div>
                                <Switch
                                    id="prices"
                                    checked={formData.preferences.showPrices}
                                    onCheckedChange={(checked) => handlePreferenceChange("showPrices", checked)}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <ImageIcon className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label htmlFor="images">Show Item Images</Label>
                                        <p className="text-sm text-gray-600">Include photos with menu items</p>
                                    </div>
                                </div>
                                <Switch
                                    id="images"
                                    checked={formData.preferences.showItemImages}
                                    onCheckedChange={(checked) => handlePreferenceChange("showItemImages", checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="submit" disabled={!isFormValid || isSubmitting} className="gap-2 w-fit">
                            <Save className="h-4 w-4" />
                            {isSubmitting ? "Creating RestaurantMenu..." : "Create RestaurantMenu"}
                        </Button>
                        <Link to="..">
                            <Button variant="outline" className="h-11 px-6">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
