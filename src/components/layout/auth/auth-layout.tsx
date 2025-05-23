import {Link, Outlet} from "react-router";
import {Utensils} from "lucide-react";

function AuthLayout() {
    return (
        <div className="min-h-dvh w-full flex-col flex items-center">
            <header className="p-4 w-full border-b">
                <div className="container flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <Utensils className="h-6 w-6 text-orange-500"/>
                        <span className="font-bold text-xl">Neemble Eat</span>
                    </Link>
                </div>
            </header>
            <div className="flex flex-col flex-1 py-6 justify-center">
                <div className="w-full max-w-md">
                    <Outlet/>
                </div>
            </div>

            <footer className="py-6 border-t w-full">
                <div className="container text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Neemble Eat. Todos os direitos reservados.
                </div>
            </footer>
        </div>
    );
}

export default AuthLayout;