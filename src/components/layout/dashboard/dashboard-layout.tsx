import {Outlet, useLocation} from "react-router";
import DashboardNavbar from "@/components/layout/dashboard/components/navbar";
import {SidebarProvider} from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/dashboard/components/dashboard-sidebar";
import {DashboardContext} from "@/context/dashboard-context";
import {useEffect} from "react";
import {useMe} from "@/api/endpoints/auth/hooks";
import {Loader} from "@/components/ui/loader";
import {useGetCurrentRestaurant} from "@/api/endpoints/user/hooks";


function DashboardLayout() {

    const location = useLocation();

    const route = location.pathname.split("/")[2] || "";

    const { data: user } = useMe()
    const { data: restaurant } = useGetCurrentRestaurant()

    useEffect(() => {
    }, [location]);

    if (!user) {
        return <div className={ "flex h-dvh items-center justify-center"}>
            <Loader/>
        </div>
    }

    if (!restaurant){
        return <div className={ "flex h-dvh items-center justify-center"}>
            <Loader/>
        </div>
    }


    return (
        <DashboardContext value={{
            page: route,
            user,
            restaurant
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