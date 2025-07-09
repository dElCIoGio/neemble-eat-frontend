import {
    Book,
    BookmarkSimple,
    CallBell,
    Chair,
    ChartDonut,
    CreditCard,
    Gear,
    House,
    type Icon,
    Lifebuoy,
    Package,
    QrCode,
    UsersThree,
} from "@phosphor-icons/react";
import {useLocation, useNavigate} from "react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar
} from "@/components/ui/sidebar";
import {useIsMobile} from "@/hooks/use-mobile";
import {Button} from "@/components/ui/button";
import {useDashboardContext} from "@/context/dashboard-context";
import {Sections} from "@/types/role";

const navigation: {
    label: string,
    icon: Icon,
    href: string,
    section?: Sections[]
}[] = [
    {
        label: "Geral",
        icon: House,
        href: "",
        section: [
            Sections.SALES_DASHBOARD,
            Sections.PERFORMANCE_INSIGHTS,
            Sections.PRODUCT_POPULARITY,
            Sections.REVENUE_TRENDS
        ]
    },
    {
        label: "Menu",
        icon: Book,
        href: "menu",
        section: [
            Sections.MENUS,
            Sections.CATEGORIES,
            Sections.ITEMS
        ]
    },
    {
        label: "QR Codes",
        icon: QrCode,
        href: "qrcode",
        section: [Sections.TABLE_QR_ACCESS_CONTROL]
    },
    {
        label: "Reservas",
        icon: BookmarkSimple,
        href: "bookings",
        section: [Sections.RESERVATIONS]
    },
    {
        label: "Equipe",
        icon: UsersThree,
        href: "staff",
        section: [
            Sections.USERS,
            Sections.ROLES,
            Sections.PERMISSIONS
        ]
    },
    {
        label: "Pedidos",
        icon: CallBell,
        href: "orders-tracking",
        section: [Sections.ORDERS]
    },
    {
        label: "Mesas",
        icon: Chair,
        href: "table-monitor",
        section: [Sections.TABLES]
    },
    {
        label: "Stock",
        icon: Package,
        href: "stock",
        section: [
            Sections.STOCK_ITEMS,
            Sections.STOCK_MOVEMENTS,
            Sections.STOCK_RECIPES
        ]
    },
    {
        label: "Relatórios",
        icon: ChartDonut,
        href: "reports",
        section: [
            Sections.REPORTS,
            Sections.INVOICES
        ]
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
        section: [
            Sections.RESTAURANT_SETTINGS,
            Sections.OPENING_HOURS,
        ]
    },
    {
        label: "Suporte",
        icon: Lifebuoy,
        href: "support",
    }
]

const hiddenRoutes = ["none"]

export default function DashboardSidebar() {

    const location = useLocation();

    const { restaurant } = useDashboardContext()

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
        <Sidebar className="border-r" collapsible="icon">
            <SidebarHeader className="bg-white">
                <div className="flex items-center justify-between gap-2 py-1">
                    <div className={`text-lg font-semibold flex items-center justify-center ${open ? "gap-1":"gap-3"} `}>
                        <div className={` rounded-md p-1 transition-all duration-300 ease-in-out`}></div>
                        <span className={`${open? "opacity-100": "opacity-0"} transition-opacity duration-300 ease-in-out py-1`}>
                            Neemble Eat
                        </span>
                    </div>
                    {
                        !isMobile &&
                        <SidebarTrigger className={`${open ? "": "hidden"}`} />
                    }

                </div>
            </SidebarHeader>
            <SidebarContent className="bg-white">

                <SidebarGroup>
                    <SidebarGroupLabel className="text-primary">Menu</SidebarGroupLabel>
                    <SidebarMenu>
                        {navigation.map((item) => {


                            return (
                                !hiddenRoutes.includes(item.href) &&
                                <SidebarMenuItem className={`${item.href == route? "bg-purple-50 flex rounded-full " : "rounded-full text-zinc-400 hover"} transition-all duration-150 ease-in-out`} key={item.label}>
                                    <SidebarMenuButton disabled={restaurant._id == "notfound"} className={`rounded-full flex mx-auto ${item.href == route? "hover:bg-purple-100":""} transition-all duration-150 ease-in-out`} asChild>
                                        <button onClick={() => handlePageChange(item.href)} className={`flex ${!open && !isMobile && "justify-center"} gap-2`}>
                                            <item.icon className={`${!open ? "ml-2": "ml-0"} ${route == item.href && " text-purple-900"} transition-all duration-100 ease-in-out h-4 w-4`}/>
                                            <span className={`${route == item.href && " text-purple-900"} `}>
                                            {item.label}
                                        </span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className={`${ !isMobile && open? "opacity-100" : "opacity-0"} transition-opacity duration-300 ease-in-out bg-white`}>
                <div className="bg-primary mx-auto w-full rounded-md h-28 p-3 flex flex-col justify-between">
                    <p className="text-zinc-200 text-xs">
                        Deseja mais dados analíticos do seu restaurante? Subscreva ao plano Pro
                    </p>
                    <Button variant="outline" size="sm">
                        Adira ja
                    </Button>
                </div>
            </SidebarFooter>

        </Sidebar>
    );
}
