import {Outlet, useLocation} from "react-router";
import DashboardNavbar from "@/components/layout/dashboard/components/navbar.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import DashboardSidebar from "@/components/layout/dashboard/components/dashboard-sidebar.tsx";
import {DashboardContext} from "@/context/dashboard-context.ts";
import Header from "@/components/layout/dashboard/components/header.tsx";
import {useEffect} from "react";


function DashboardLayout() {

    const location = useLocation();

    const route = location.pathname.split("/")[2] || "";

    useEffect(() => {
    }, [location]);

    return (
        <DashboardContext value={{
            page: route
        }}>
            <SidebarProvider>
                <div className="flex min-h-screen w-full">
                    <DashboardSidebar/>
                    <main className="flex-1 flex-col flex">
                        <DashboardNavbar/>
                        <div className="w-full flex-1 flex flex-col">
                            <Header/>
                            <div className="p-8 flex flex-col flex-1 border-t">
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