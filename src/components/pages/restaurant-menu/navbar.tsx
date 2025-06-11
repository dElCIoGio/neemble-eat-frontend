import {Button} from "@/components/ui/button";
import {Link} from "react-router";
import {ShoppingCart} from "lucide-react"

function Navbar() {


    return (
        <div className={"flex space-x-4 justify-end p-4"}>
            <Button asChild size="sm" variant="secondary"
                    className={"text-zinc-600 hover:text-zinc-900"}>
                    <Link to={`orders`}>
                        Seus Pedidos
                    </Link>
            </Button>
            <Button asChild size="sm" variant="secondary"
                    className={"text-zinc-600 hover:text-zinc-900"}>
                <Link to={`cart`}
                      className={"flex items-center space-x-2"}>
                    <ShoppingCart/>
                    Carrinho
                </Link>
            </Button>
        </div>
    );
}

export default Navbar;