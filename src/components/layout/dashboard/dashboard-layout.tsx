import {Outlet, useLocation} from "react-router";
import DashboardNavbar from "@/components/layout/dashboard/components/navbar";
import {SidebarProvider} from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/dashboard/components/dashboard-sidebar";
import {DashboardContext} from "@/context/dashboard-context";
import Header from "@/components/layout/dashboard/components/header";
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
                        <div className="w-full flex-1 flex flex-col bg-zinc-50">
                            <div className="px-4">
                                <Header/>
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