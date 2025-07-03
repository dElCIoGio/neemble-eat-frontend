import {Outlet, useLocation} from "react-router";
import {useEffect} from "react";
import DashboardNavbar from "@/components/layout/dashboard/components/navbar";
import {SidebarProvider} from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/dashboard/components/dashboard-sidebar";
import {DashboardContext} from "@/context/dashboard-context";
import {useMe} from "@/api/endpoints/auth/hooks";
import {Loader} from "@/components/ui/loader";
import {useGetCurrentRestaurant, useGetUserRestaurants, useSetCurrentRestaurant} from "@/api/endpoints/user/hooks";
import {Restaurant} from "@/types/restaurant";


const dummyRestaurant: Restaurant = {
    _id: "notfound",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    name: "Restaurante Sabor Tropical",
    address: "Av. Revolução de Outubro, Luanda, Angola",
    description: "Experiência gastronômica única com pratos tradicionais angolanos.",
    phoneNumber: "+244923456789",

    bannerUrl: "https://example.com/images/sabor-tropical-banner.jpg",
    logoUrl: "https://example.com/images/sabor-tropical-logo.png",

    isActive: true,
    currentMenuId: "menu_001",
    menuIds: ["menu_001", "menu_002"],
    tableIds: ["table_1", "table_2", "table_3"],
    sessionIds: ["session_a", "session_b"],
    orderIds: ["order_001", "order_002", "order_003"],
    slug: "sabor-tropical",

    settings: {
        openingHours: {
            monday: "09:00-22:00",
            tuesday: "09:00-22:00",
            wednesday: "09:00-22:00",
            thursday: "09:00-22:00",
            friday: "09:00-23:00",
            saturday: "10:00-23:00",
            sunday: "10:00-20:00",
        },
        automaticStockAdjustments: false
    },
};

function DashboardLayout() {

    const location = useLocation();

    const route = location.pathname.split("/")[2] || "";

    const { data: user } = useMe()
    const { data: restaurant } = useGetCurrentRestaurant()
    const { data: restaurants } = useGetUserRestaurants()
    const { mutate: setCurrentRestaurant } = useSetCurrentRestaurant()

    useEffect(() => {
        if (!restaurant && restaurants && restaurants.length > 0) {
            setCurrentRestaurant(restaurants[0]._id)
        }
    }, [restaurant, restaurants, setCurrentRestaurant])




    if (!user) {
        return <div className={ "flex h-dvh items-center justify-center"}>
            <Loader/>
        </div>
    }

    return (
        <DashboardContext value={{
            page: route,
            user,
            restaurant: restaurant? restaurant : dummyRestaurant
        }}>
            <SidebarProvider>
                <div className="flex min-h-screen w-full">
                    <DashboardSidebar/>
                    <main className="flex-1 flex-col flex">
                        <DashboardNavbar/>
                        <div className="w-full flex-1 flex flex-col bg-zinc-50">
                            <div className="px-4">
                                {/*<Header/>*/}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <Outlet/>
                            </div>
                        </div>

                    </main>
                </div>
            </SidebarProvider>
        </DashboardContext>
    );
}

export default DashboardLayout;