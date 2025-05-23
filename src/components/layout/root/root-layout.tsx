import {Outlet, useLocation} from "react-router";

import {useEffect} from "react";
import {Footer} from "@/components/layout/root/components/footer.tsx";
import {Header} from "@/components/layout/root/components/header.tsx";

function HomeLayout() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflowX = "hidden";
        return () => {
            document.body.style.overflowX = "";
        };
    }, [location]);

    return (
        <main className="flex flex-col">
            <Header/>
            <div className="flex flex-col flex-1">
                <Outlet/>
            </div>
            <Footer/>
        </main>
    );
}

export default HomeLayout;