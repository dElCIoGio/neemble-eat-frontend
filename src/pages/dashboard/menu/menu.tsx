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
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useDashboardContext} from "@/context/dashboard-context";
import {restaurantApi} from "@/api/endpoints/restaurants/requests";
import {showPromiseToast} from "@/utils/notifications/toast";
import {useQueryClient} from "@tanstack/react-query";
import type {Restaurant} from "@/types/restaurant";



export default function MenuManagementPage() {

    const { menuId } = useParams() as unknown as { menuId: string }

    const { restaurant } = useDashboardContext()
    const queryClient = useQueryClient()

    const { data: menu, updateMenu, isLoading } = useGetMenuBySlug(menuId)

    const [activeTab, setActiveTab] = useState("overview")

    const handleMenuUpdate = (updatedMenu: Partial<Menu>) => {
        updateMenu(updatedMenu)
    }

    const handlePublishMenu = () => {
        const promise = restaurantApi.changeCurrentMenu(restaurant._id, menu!._id)
            .then(() => {
                queryClient.setQueryData<Restaurant | undefined>(["currentRestaurantId"], (old) =>
                    old ? { ...old, currentMenuId: menu!._id } : old
                )
            })

        showPromiseToast(promise, {
            loading: "Publishing menu...",
            success: "Menu published successfully!",
            error: "Failed to publish menu. Please try again."
        })
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

    const isCurrentMenu = restaurant.currentMenuId === menu._id
    const isPublishDisabled = !menu.isActive || isCurrentMenu

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
                                Publicado
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar cardápio
                            </Button>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="sm" disabled={isPublishDisabled} onClick={handlePublishMenu}>
                                        Publicar
                                    </Button>
                                </TooltipTrigger>
                                {isPublishDisabled && (
                                    <TooltipContent>
                                        {menu.isActive ? "Este já é o cardápio atual" : "Ative o cardápio para publicá-lo"}
                                    </TooltipContent>
                                )}
                            </Tooltip>
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
                                    Adicionar categoria
                                </Link>

                            </Button>
                        )}
                        {activeTab === "items" && (
                            <Button asChild variant="outline" size="sm">
                                <Link to="items/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Adicionar item
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
                                    Visão Geral
                                </TabsTrigger>
                                <TabsTrigger
                                    value="categories"
                                    className=""
                                >
                                    Categorias
                                </TabsTrigger>
                                <TabsTrigger
                                    value="items"
                                    className=""
                                >
                                    Itens
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
