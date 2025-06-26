import {useState} from "react";
import {useParams} from "react-router";
import {useQueryClient} from "@tanstack/react-query";
import {useCart} from "@/hooks/use-cart";
import {useGetActiveSessionByTableNumber} from "@/api/endpoints/sessions/hooks";
import {useRestaurantMenuContext} from "@/context/restaurant-menu-context";
import { CartContext } from "@/context/cart-context";
import Background from "@/components/ui/background";
import ReturnNav from "@/components/ui/return-nav";
import {NumberOfItems} from "@/components/pages/restaurant-menu-cart/number-of-items";
import {Checkout} from "@/components/pages/restaurant-menu-cart/checkout";
import {ItemsSection} from "@/components/pages/restaurant-menu-cart/items-section";
import {ordersApi} from "@/api/endpoints/orders/requests";

export function Cart() {

    document.title = "Carrinho"

    const {
        restaurant
    } = useRestaurantMenuContext()

    const {tableNumber} = useParams() as unknown as {
        tableNumber: string
    };



    const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false)
    const [orderStatus, setOrderStatus] = useState<"Success" | "Error" | "Idle">("Idle");
    const [alertMessage, setAlertMessage] = useState<string>('')
    const queryClient = useQueryClient()
    const [customerName, setCustomerName] = useState<string>('');
    const {
        cart,
        setCartEmpty,
        numberOfItems,
        totalValue,
        findCartItemIndexByID,
        incrementProduct,
        deleteProduct,
        decrementProduct,
    } = useCart(restaurant._id)
    const {
        data: session,
        isFetching: iSFetchingSession
    } = useGetActiveSessionByTableNumber({
        tableNumber: Number(tableNumber),
        restaurantId: restaurant._id
    })

    function invalidateOrdersKey() {
        const key = ["active", tableNumber, restaurant._id]
        queryClient.invalidateQueries({
            queryKey: key
        }).then()
    }

    function handleSubmit() {
        const items = cart.map((item) => item)

        if (session && session?._id) {
            const orders = items.map(item => ({
                sessionId: session._id,
                itemId: item.id,
                quantity: item.quantity,
                additionalNote: item.additionalNotes,
                customisations: item.customisations ?? [],
                orderedItemName: item.name,
                restaurantId: restaurant._id,
                unitPrice: item.price,
                total: item.price * item.quantity,
                tableNumber: Number(tableNumber)
            }))

            ordersApi.addOrdersGroup(orders, session._id).catch(() => {
                setOrderStatus("Error")
                setAlertMessage("Houve um erro com o seu pedido, um garçon irá confirmar o seu pedido em breve.")
            }).then(() => {
                setOrderStatus("Success")
                setAlertMessage(`O seu pedido será levado á sua mesa em breve!`)
                setCartEmpty()
            })

            if (session && session._id)
                invalidateOrdersKey()
        }
        setCartEmpty()
    }

    return (
        <CartContext.Provider value={{
            orderConfirmed,
            setOrderConfirmed,
            customerName,
            alertMessage,
            setCustomerName,
            orderStatus,
            cart,
            numberOfItems,
            totalValue,
            findCartItemIndexByID,
            incrementProduct,
            deleteProduct,
            decrementProduct,
            iSFetchingSession
        }}>
            <div className="min-h-svh px-4 font-poppins pt-4">
                <Background className={"bg-gray-100"}/>
                <ReturnNav path={`..`} title={"Carrinho"}/>
                <NumberOfItems/>
                <ItemsSection/>
                <Checkout onSubmit={handleSubmit}/>
            </div>
        </CartContext.Provider>
    );
}

export default Cart;