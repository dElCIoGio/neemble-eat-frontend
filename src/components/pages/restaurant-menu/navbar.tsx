import {Button} from "@/components/ui/button";
import {Link, useParams} from "react-router";
import {ShoppingCart} from "lucide-react";
import {useRestaurantMenuContext} from "@/context/restaurant-menu-context";
import {useCart} from "@/hooks/use-cart";

function Navbar() {

    const {session, menu} = useRestaurantMenuContext()
    const {restaurantSlug, tableNumber} = useParams() as unknown as {restaurantSlug: string, tableNumber: string}
    const {numberOfItems} = useCart(restaurantSlug, session._id, menu._id)

    const baseUrl = `/r/${restaurantSlug}/${tableNumber}`

    return (
        <div className={"flex space-x-4 justify-end p-4"}>
            <Button asChild size="sm" variant="secondary"
                    className={"text-zinc-600 hover:text-zinc-900"}>
                    <Link to={`${baseUrl}/orders`}>
                        Seus Pedidos
                    </Link>
            </Button>
            <Button asChild size="sm" variant="secondary"
                    className={"text-zinc-600 hover:text-zinc-900"}>
                <Link to={`${baseUrl}/cart`}
                      className={"relative flex items-center space-x-2"}>
                    {numberOfItems > 0 &&
                        <span
                            className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                            {numberOfItems}
                        </span>
                    }
                    <ShoppingCart/>
                    Carrinho
                </Link>
            </Button>
        </div>
    );
}

export default Navbar;