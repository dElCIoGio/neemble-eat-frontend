import {Outlet, useLocation} from "react-router";

import {useEffect} from "react";
import {Footer} from "@/components/layout/root/components/footer";
import {Header} from "@/components/layout/root/components/header";
import axios from "axios";
import config from "@/config";

function HomeLayout() {
    const location = useLocation();

    const { api: {apiUrl} } = config

    async function warmUp(){
        const result = await axios.get(`${apiUrl}/health`)
        console.log(result.data)
    }

    useEffect(() => {
        console.log("Warming up...")
        warmUp()
    }, [location])

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