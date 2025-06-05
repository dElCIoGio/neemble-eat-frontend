
import { ArrowLeft, Upload, Plus, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {Link} from "react-router";


export default function AddMenuPage() {
    const handleImportMenu = () => {

    }

    return (
        <div className="">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link to="../">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Menus
                        </Button>
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-xl font-bold text-gray-900 mb-4">Add New Menu</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Choose how you'd like to create your new restaurant menu. Import from an existing source or build one from
                        scratch.
                    </p>
                </div>

                {/* Menu Creation Options */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Import Menu Card */}
                    <Card className="hover:shadow-lg transition-shadow group">
                        <CardHeader className="text-center pb-4">
                            <div className="relative">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                    <Upload className="h-8 w-8 text-blue-600" />
                                </div>
                                <Badge onClick={handleImportMenu} className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-500">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Faster
                                </Badge>
                            </div>
                            <CardTitle className="text-xl font-semibold text-gray-900">Import Menu</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardDescription className="text-gray-600 text-sm leading-relaxed">
                                Copy an existing menu from another restaurant using a menu code. This allows you to quickly duplicate
                                successful menu setups and customize them for your location.
                            </CardDescription>
                            <div className="mt-6">
                                <Button asChild variant="secondary" size="sm" className="w-full cursor-pointer">
                                    <Link to="import">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Import Menu
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Create Menu Card */}
                    <Card className="hover:shadow-lg transition-shadow group">
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                                <Plus className="h-8 w-8 text-purple-600" />
                            </div>
                            <CardTitle className="text-xl font-semibold text-gray-900">Create Menu</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardDescription className="text-gray-600 text-sm leading-relaxed">
                                Build your menu from scratch with complete control over every detail. Customize categories, items,
                                descriptions, and pricing exactly as you like.
                            </CardDescription>
                            <div className="mt-6">
                                <Button asChild variant="default" className="w-full">
                                    <Link to="manual">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Menu
                                    </Link>

                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        Need help deciding? You can always switch between methods or combine both approaches later.
                    </p>
                </div>
            </div>
        </div>
    )
}
