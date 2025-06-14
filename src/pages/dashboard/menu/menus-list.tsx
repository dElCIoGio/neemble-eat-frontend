import { useState } from "react"
import { Plus, Search, Trash2, ChefHat, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {Link} from "react-router";
import {useDashboardContext} from "@/context/dashboard-context";
import {useGetRestaurantMenus} from "@/api/endpoints/menu/hooks";
import {Loader} from "@/components/ui/loader";
import {menuApi} from "@/api/endpoints/menu/requests";
import {showPromiseToast} from "@/utils/notifications/toast";



export default function MenuManager() {

    const {restaurant} = useDashboardContext()

    const {
        data: menus,
        isLoading,
        removeMenu
    } = useGetRestaurantMenus(restaurant._id)

    console.log(menus)

    const [searchTerm, setSearchTerm] = useState("")

    const filteredMenus = menus? menus.filter(
        (menu) =>
            menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            menu.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ): []

    const handleDeleteMenu = async (id: string, e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            showPromiseToast(
                menuApi.deleteMenu(id).then(() => {
                    removeMenu(id)
                }),
                {
                    loading: "Deleting menu...",
                    success: "RestaurantMenu deleted successfully!",
                    error: "Failed to delete menu. Please try again."
                }
            );
        } catch (error) {
            console.error("Error deleting menu:", error);
        }
    }

    const handleToggleStatus = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        console.log(id)

        // set a menu as disabled
    }

    if (isLoading){
        return <div className="flex-1 justify-content-center flex">
            <Loader/>
        </div>
    }


    return (
        <div className="">
            <div className="mx-auto py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">Cardápios</h1>
                    </div>
                    <Button asChild size="sm" className="">
                        <Link to="create">
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar cardápio
                        </Link>
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Buscar marcas e cardápios"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 max-w-md"
                    />
                </div>

                {/* RestaurantMenu List */}
                <div className="space-y-2 flex flex-col">
                    {filteredMenus.length === 0 ? (
                        <div className="text-center py-12">
                            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cardápio encontrado</h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm ? "Tente ajustar seus termos de busca" : "Comece adicionando seu primeiro cardápio"}
                            </p>
                            {!searchTerm && (
                                <Button asChild size="sm" className="">
                                    <Link to="create">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar cardápio
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        filteredMenus.map((menu) => (
                            <Link className="" key={menu._id} to={menu.slug}>
                                <Card className="hover:shadow-sm transition-shadow py-4">
                                    <CardContent className="px-4">
                                        <div className="flex items-center gap-4">
                                            {/* RestaurantMenu Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 ">{menu.name}</h3>
                                                <p className="text-gray-500 text-sm">{menu.description}</p>
                                            </div>

                                            {/* Status Badge */}
                                            <Badge variant={menu.isActive ? "default" : "secondary"} className="text-xs">
                                                {menu.isActive ? "Ativo" : "Inativo"}
                                            </Badge>

                                            {/* Actions */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild
                                                                     onClick={(e) => {
                                                                         e.stopPropagation();
                                                                         e.preventDefault();
                                                                     }}
                                                >
                                                    <Button variant="ghost" size="sm" className="text-gray-500">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => handleToggleStatus(menu._id, e)}>
                                                        {menu.isActive ? "Desativar" : "Ativar"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => handleDeleteMenu(menu._id, e)} className="text-red-600">
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
