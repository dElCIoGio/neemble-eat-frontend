import type React from "react"

import { useState } from "react"
import { ArrowLeft, Copy, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link, useNavigate } from "react-router"
import { useDashboardContext } from "@/context/dashboard-context"
import { menuApi } from "@/api/endpoints/menu/requests"
import { useGetMenuBySlug } from "@/api/endpoints/menu/hooks"
import { showPromiseToast } from "@/utils/notifications/toast"
import { Loader } from "@/components/ui/loader"

export default function ImportMenuPage() {
    const { restaurant } = useDashboardContext()
    const navigate = useNavigate()
    const [menuCode, setMenuCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [searchSlug, setSearchSlug] = useState("")

    const { data: foundMenu, isLoading: isMenuLoading } = useGetMenuBySlug(searchSlug.toLowerCase())

    const handleSearch = async () => {
        if (!menuCode.trim()) {
            setError("Please enter a menu code")
            return
        }

        setIsLoading(true)
        setError("")
        setSearchSlug(menuCode)

        try {
            // The menu data will be fetched automatically by the useGetMenuBySlug hook
            if (!foundMenu) {
                setError("Menu code not found. Please check the code and try again.")
            }
        } catch (error) {
            console.error("Error creating menu:", error)
            setError("An error occurred while searching for the menu. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleImport = async () => {
        if (!foundMenu || !restaurant._id) return

        try {
            showPromiseToast(
                menuApi.copyMenu(foundMenu.slug, restaurant._id),
                {
                    loading: "Importing menu...",
                    success: "Menu imported successfully!",
                    error: "Failed to import menu. Please try again."
                }
            )
            navigate("..") // Navigate back to menus list
        } catch (error) {
            console.error("Error importing menu:", error)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    if (isMenuLoading) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <Loader />
            </div>
        )
    }

    return (
        <div className="">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="..">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Import Menu</h1>
                    <p className="text-gray-600 text-lg">
                        Enter the menu code from another restaurant to copy their menu to your location.
                    </p>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Copy className="h-5 w-5" />
                            Menu Code
                        </CardTitle>
                        <CardDescription>
                            Ask the restaurant owner for their menu code, or find it in their menu sharing settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="menuCode">Enter Menu Code</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="menuCode"
                                    placeholder="e.g., PIZZA123"
                                    value={menuCode}
                                    onChange={(e) => {
                                        setMenuCode(e.target.value.toUpperCase())
                                        setSearchSlug("") // Reset search when input changes
                                    }}
                                    onKeyPress={handleKeyPress}
                                    className="font-mono text-center text-lg tracking-wider"
                                    disabled={isLoading}
                                />
                                <Button onClick={handleSearch} disabled={isLoading || !menuCode.trim()}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                                </Button>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Found Menu Preview */}
                {foundMenu && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-green-700">Menu Found!</CardTitle>
                            <CardDescription>Preview of the menu you're about to import</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">{foundMenu.name}</h3>
                                <p className="text-gray-600 mb-3">{foundMenu.description}</p>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Categories:</span>
                                        <span className="ml-2 text-gray-900">{foundMenu.categoryIds.length}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Status:</span>
                                        <span className="ml-2 text-gray-900">{foundMenu.isActive ? "Active" : "Inactive"}</span>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <span className="font-medium text-gray-700 text-sm">Preferences:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {foundMenu.preferences.showPrices && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                Show Prices
                                            </span>
                                        )}
                                        {foundMenu.preferences.showItemImages && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                Show Images
                                            </span>
                                        )}
                                        {foundMenu.preferences.highlightFeaturedItems && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                Featured Items
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleImport} className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Importing Menu...
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Import This Menu
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Help Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-700">Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-2">
                        <p>• Menu codes are typically 6-8 characters long (letters and numbers)</p>
                        <p>• Ask the restaurant owner to share their menu code with you</p>
                        <p>• You can customize the imported menu after it's added to your account</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
