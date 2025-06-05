
import { useState } from "react"
import { ArrowLeft, Eye, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Menu} from "@/types/menu";
import {Link, useParams} from "react-router";
import {OverviewTab} from "@/components/pages/dashboard-menu/overview-tab";
import {CategoriesTab} from "@/components/pages/dashboard-menu/categories-tab";
import {ItemsTab} from "@/components/pages/dashboard-menu/items-tab";
import {useGetMenuBySlug} from "@/api/endpoints/menu/hooks";
import {Loader} from "@/components/ui/loader";



export default function MenuManagementPage() {

    const { menuId } = useParams() as unknown as { menuId: string }

    const { data: menu, updateMenu, isLoading } = useGetMenuBySlug(menuId)

    const [activeTab, setActiveTab] = useState("overview")

    const handleMenuUpdate = (updatedMenu: Partial<Menu>) => {
        updateMenu(updatedMenu)
    }


    if (isLoading){
        return <div className="flex-1 flex justify-center items-center">
            <Loader/>
        </div>
    }

    if (!menu){
        return <div className="flex-1 flex justify-center items-center">
            There was an error while fetching the data
        </div>
    }

    return (
        <div className="">
            <div className="">
                <div className=" mx-auto ">
                    {/* Header */}
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                            <Link to="..">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{menu.name}</h1>
                                </div>

                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Published
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview menu
                            </Button>
                            <Button size="sm">Publish</Button>
                            <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end my-8 gap-2">
                        {activeTab === "categories" && (
                            <Button asChild variant="outline" size="sm">
                                <Link to="categories/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add category
                                </Link>

                            </Button>
                        )}
                        {activeTab === "items" && (
                            <Button asChild variant="outline" size="sm">
                                <Link to="items/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add item
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="items-center justify-between">
                            <TabsList className=" p-0 w-full">
                                <TabsTrigger
                                    value="overview"
                                    className=""
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="categories"
                                    className=""
                                >
                                    Categories
                                </TabsTrigger>
                                <TabsTrigger
                                    value="items"
                                    className=""
                                >
                                    Items
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="mt-6 pb-8">
                            <TabsContent value="overview" className="mt-0">
                                <OverviewTab menu={menu} onUpdate={handleMenuUpdate} />
                            </TabsContent>
                            <TabsContent value="categories" className="mt-0">
                                <CategoriesTab  />
                            </TabsContent>
                            <TabsContent value="items" className="mt-0">
                                <ItemsTab />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
