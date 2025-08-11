// import logo from "../../../public/neemble-eat-logo.png";
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import {Link, NavLink, useLocation} from "react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import {useEffect, useState} from "react";


export function Header() {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const location = useLocation();

    useEffect(() => {
        setIsOpen(false)
    }, [location])




    return (
        <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-sm">
            {/* Announcement Banner */}
            <div className="w-full bg-zinc-800 text-white text-center py-2 text-sm">
                <span>Oferta Especial para Novos Restaurantes: </span>
                <span className="text-purple-300 hover:text-purple-100">
                    1 Mês Gratuito
                </span>
            </div>

            <header className="border-b bg-white/70 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="md:hidden">
                                            <Menu className="h-6 w-6"/>
                                            <span className="sr-only">Abrir menu</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[300px]">
                                        <SheetHeader>
                                            <SheetTitle>Neemble Eat</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6  space-y-4 flex flex-col justify-between">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-gray-500 px-2">Soluções
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Link to="solutions/digital-menu"
                                                              className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                            Menu Digital
                                                        </Link>
                                                        <Link to="solutions/orders-management"
                                                              className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                            Gestão de Pedidos
                                                        </Link>
                                                        <Link to="solutions/analytics"
                                                              className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                            Análise de Dados
                                                        </Link>
                                                    </div>
                                                </div>

                                                <Link to="price"
                                                      className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                    Preços
                                                </Link>

                                                <Link to="about-us"
                                                      className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                    Sobre Nós
                                                </Link>

                                                <div className="space-y-2 hidden">
                                                    <div className="text-sm font-medium text-gray-500 px-2">Recursos
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Link to="#"
                                                              className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                            Sistema QR Code
                                                            <Badge
                                                                className="ml-2 bg-emerald-100 text-emerald-700">POPULAR</Badge>
                                                        </Link>
                                                        <Link to="#"
                                                              className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                            Dashboard da Cozinha
                                                        </Link>
                                                        <Link to="#"
                                                              className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                            Relatórios Analíticos
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-gray-500 px-2">Links
                                                        Rápidos
                                                    </div>
                                                    <div className="space-y-1">
                                                        <NavLink to="blog"
                                                                 className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                            Blog
                                                        </NavLink>
                                                        <NavLink to="about-us"
                                                                 className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                            Sobre Nós
                                                        </NavLink>
                                                        <NavLink to="contact"
                                                                 className="block px-2 py-1 text-sm hover:bg-gray-100 rounded-md">
                                                            Contato
                                                        </NavLink>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="pt-4 mx-4 space-y-2 mt-4 border-t">

                                                <Button asChild variant="secondary" className="w-full">
                                                    <NavLink to="/auth/login">
                                                        Login
                                                    </NavLink>
                                                </Button>
                                                <Button asChild className="w-full text-white">
                                                    <NavLink to="/demo">
                                                        Agendar Demo
                                                    </NavLink>
                                                </Button>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                                <NavLink to="" className="font-bold text-xl">
                                    Neemble Eat
                                </NavLink>
                            </div>

                            <NavigationMenu className="hidden md:flex">
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="bg-none">Soluções</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[200px] gap-2 bg-white/50 backdrop-blur-sm rounded-md">
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link to="solutions/digital-menu"
                                                              className="block p-2 hover:bg-gray-50 rounded-md">
                                                            Menu Digital
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link to="solutions/orders-management"
                                                              className="block p-2 hover:bg-gray-50 rounded-md">
                                                            Gestão de Pedidos
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link to="solutions/analytics"
                                                              className="block p-2 hover:bg-gray-50 rounded-md">
                                                            Análise de Dados
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    {/* Preços */}
                                    <NavigationMenuItem>
                                        <NavigationMenuLink asChild>
                                            <NavLink to="price" className="block p-2">
                                                Preços
                                            </NavLink>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    {/* About Us */}
                                    <NavigationMenuItem>
                                        <NavigationMenuLink asChild>
                                            <NavLink to="about-us" className="block p-2">
                                                Sobre Nós
                                            </NavLink>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>

                                    {/* Recursos */}
                                    <NavigationMenuItem className="hidden">
                                        <NavigationMenuTrigger className="bg-none">Recursos</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[300px] gap-2 rounded-md">
                                                <li>
                                                    <NavigationMenuLink className="hover:bg-zinc-200">
                                                        <Link
                                                            to="#"
                                                            className="flex items-center justify-between hover:bg-gray-50 w-full rounded-md"
                                                        >
                                                            <span>Sistema QR Code</span>
                                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">POPULAR</Badge>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">
                                                            Dashboard da Cozinha
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link to="#" className="block p-2 hover:bg-gray-50 rounded-md">
                                                            Relatórios Analíticos
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="flex items-center space-x-4 md:space-x-4">
                            <Button variant="secondary" size="sm"
                                    className="w-fit h-fit text-xs ">
                                <NavLink to="/auth/login" className="px-2 py-2">
                                    Login
                                </NavLink>
                            </Button>

                            <Button variant="secondary" size="sm"
                                    className="w-fit h-fit bg-zinc-800 text-xs text-white hover:bg-zinc-600">
                                <NavLink to="demo" className="px-2 py-2">
                                    Agendar Demo
                                </NavLink>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
        </nav>

    );
}

