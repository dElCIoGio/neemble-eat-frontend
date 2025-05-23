import {
    Book,
    BookmarkSimple,
    CreditCard,
    Gear,
    House,
    Icon,
    Lifebuoy,
    QrCode,
    UsersThree
} from "@phosphor-icons/react";
import {useLocation, useNavigate} from "react-router";
import {
    SidebarContent,
    SidebarFooter,
    Sidebar,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarTrigger,
    useSidebar
} from "@/components/ui/sidebar.tsx";
import {useIsMobile} from "@/hooks/use-mobile.ts";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";

const navigation: {
    label: string,
    icon: Icon,
    href: string,
}[] = [
    {
        label: "Geral",
        icon: House,
        href: "",
    },
    {
        label: "Menu",
        icon: Book,
        href: "menu",
    },
    {
        label: "Mesas e QR Code",
        icon: QrCode,
        href: "qrcode",
    },
    {
        label: "Reservas",
        icon: BookmarkSimple,
        href: "bookings",
    },
    {
        label: "Equipe",
        icon: UsersThree,
        href: "staff",
    },
    {
        label: "Subscrição",
        icon: CreditCard,
        href: "subscription",
    },
    {
        label: "Definições",
        icon: Gear,
        href: "settings",
    },
    {
        label: "Suporte",
        icon: Lifebuoy,
        href: "support",
    }
]


export default function DashboardSidebar() {

    const location = useLocation();

    const {open, toggleSidebar} = useSidebar()

    const route = location.pathname.split("/")[2] || "";

    const navigate = useNavigate()

    const isMobile = useIsMobile();

    function handlePageChange(href: string) {
        if (isMobile)
            toggleSidebar()
        navigate(`/dashboard/${href}` + location.search, {replace: true})
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between gap-2 py-1">
                    <div className={`text-lg font-semibold flex items-center justify-center ${open ? "gap-1":"gap-3"} `}>
                        <div className={` rounded-md p-1 transition-all duration-300 ease-in-out`}></div>
                        <span className={` transition-opacity duration-300 ease-in-out`}>
                            Neemble Eat
                        </span>
                    </div>
                    {
                        !isMobile &&
                        <SidebarTrigger className={`${open ? "": "hidden"}`} />
                    }

                </div>
            </SidebarHeader>
            <SidebarContent>
                <div>
                    <Separator className="max-w-[90%] mx-auto"/>
                </div>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-primary">Menu</SidebarGroupLabel>
                    <SidebarMenu>
                        {navigation.map((item) => (
                            <SidebarMenuItem className={`${item.href == route? "bg-white border-[1.5px] flex rounded-full" : "rounded-full text-zinc-400"}`} key={item.label}>
                                <SidebarMenuButton className="rounded-full flex mx-auto" asChild>
                                    <button onClick={() => handlePageChange(item.href)} className={`flex ${!open && !isMobile && "justify-center"} gap-2`}>
                                        <item.icon className={`${!open ? "ml-2": "ml-0"} ${route == item.href && ""} transition-all duration-100 ease-in-out h-4 w-4`}/>
                                        <span className={`${!open && ""}`}>{item.label}</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className={`${ !isMobile && open? "opacity-100" : "opacity-0"} transition-opacity duration-300 ease-in-out`}>
                <div className="bg-primary mx-auto w-full rounded-md h-28 p-3 flex flex-col justify-between">
                    <p className="text-zinc-200 text-xs font-semibold">
                        Looking for more detailed analytics to help you? Upgrade to Pro
                    </p>
                    <Button variant="outline" size="sm">
                        Upgrade Now
                    </Button>
                </div>
            </SidebarFooter>

        </Sidebar>
    );
}
