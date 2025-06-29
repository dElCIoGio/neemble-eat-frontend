import {Button} from "@/components/ui/button";
import { ChevronDown, Menu, X, Settings, LogOut, User} from "lucide-react"
import {useIsMobile} from "@/hooks/use-mobile";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useDashboardContext} from "@/context/dashboard-context";
import RestaurantSelection from "@/components/layout/dashboard/components/restaurant-selection";
import {Link, useNavigate} from "react-router";
import {useAuth} from "@/context/auth-context";


function DashboardNavbar() {

    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const { open, toggleSidebar } = useSidebar()
    const {
        user
    } = useDashboardContext()
    const {
        logout
    } = useAuth()

    return (
        <header className="w-full h-16 bg-zinc-50/50 backdrop-blur-md sticky top-0 z-10">
            <div className="h-full px-4 flex items-center justify-between">
                {/* Left side - Mobile menu toggle */}
                <div className="flex items-center space-x-4">
                    {
                        isMobile? (
                            <div className="flex items-center gap-2 font-medium">
                                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden rounded-full">
                                    {!open ? <X className="size-4"/> : <Menu className="size-4"/>}
                                </Button>
                            </div>
                        ): !open && (
                            <SidebarTrigger/>
                        )
                    }
                    <RestaurantSelection/>
                </div>


                {/* Right side - Actions */}
                <div className="flex items-center gap-2 ml-auto">


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center space-x-2">
                                <div className="p-0.5 bg-white rounded-full">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src="/profile-pic.jpg" alt="User"/>
                                        <AvatarFallback>
                                            {user.firstName.toUpperCase()[0] + user.lastName.toUpperCase()[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <span
                                    className="text-gray-700 dark:text-white font-medium hidden md:block">{user.firstName}</span>
                                <ChevronDown size={18} className="text-gray-500 dark:text-gray-400 hidden md:block"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end"
                                             className="w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md">
                            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")} className="flex items-center space-x-2">
                                <User size={18}/>
                                <span>Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="flex items-center space-x-2">
                                <Link to="/dashboard/settings">
                                    <Settings size={18}/>
                                    <span>Definições</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={logout} className="flex items-center space-x-2 text-red-500">
                                <LogOut size={18}/>
                                <span>Terminar Sessão</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

export default DashboardNavbar;