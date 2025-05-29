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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


function DashboardNavbar() {

    const isMobile = useIsMobile()
    const { open, toggleSidebar } = useSidebar()


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

                    <Select>
                        <SelectTrigger className=" bg-white rounded-full">
                            <SelectValue placeholder="Selecione o restaurante" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem className="rounded-lg" value="light">Light</SelectItem>
                            <SelectItem className="rounded-lg" value="dark">Dark</SelectItem>
                            <SelectItem className="rounded-lg" value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                {/* Right side - Actions */}
                <div className="flex items-center gap-2 ml-auto">

                    {/* User dropdown */}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center space-x-2">
                                <div className="p-0.5 bg-white rounded-full">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src="/profile-pic.jpg" alt="User"/>
                                        <AvatarFallback>
                                            DA
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <span
                                    className="text-gray-700 dark:text-white font-medium hidden md:block">Delcio</span>
                                <ChevronDown size={18} className="text-gray-500 dark:text-gray-400 hidden md:block"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end"
                                             className="w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md">
                            <DropdownMenuItem className="flex items-center space-x-2">
                                <User size={18}/>
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center space-x-2">
                                <Settings size={18}/>
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center space-x-2 text-red-500">
                                <LogOut size={18}/>
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

export default DashboardNavbar;