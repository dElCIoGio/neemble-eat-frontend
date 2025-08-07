import {ReactNode} from "react";
import {useOrdersContext} from "@/context/order-context";
import {SwipeToConfirmButton} from "@/components/pages/restaurant-menu-orders/swipe-to-confirm";
import {Banknote, CreditCard} from "lucide-react";
import {useRestaurantMenuContext} from "@/context/restaurant-menu-context";
import {useMarkSessionNeedsBill} from "@/api/endpoints/sessions/hooks";
import {useParams} from "react-router";

interface Props {
    children: ReactNode;
}

export function PaymentMethods({children}: Props) {
    return (
        <div className='space-y-3'>
            {children}
        </div>
    );
}

PaymentMethods.Confirm = function Confirm() {
    const {refreshOrders, setBillDialogOpen, setBillRequested} = useOrdersContext()
    const { session, restaurant } = useRestaurantMenuContext()
    const { tableNumber } = useParams() as unknown as { tableNumber: string }

    const requestBill = useMarkSessionNeedsBill({
        sessionId: session._id,
        restaurantId: restaurant._id,
        tableNumber: Number(tableNumber)
    })

    const handleRequestBill = async () => {
        setBillDialogOpen(true)
        setBillRequested(true)

        try {
            await requestBill.mutateAsync()
            refreshOrders()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <SwipeToConfirmButton
                label="Dinheiro"
                icon={<Banknote className="h-4 w-4 mr-2" />}
                onConfirm={async () => {
                    try {
                        await handleRequestBill()
                    } catch (error) {
                        console.error(error)
                    }
                }}
                color="bg-black"
            />
            <SwipeToConfirmButton
                label="Cartão"
                icon={<CreditCard className="h-4 w-4 mr-2" />}
                onConfirm={async () => {
                    try {
                        await handleRequestBill()
                    } catch (error) {
                        console.error(error)
                    }
                }}
                color="bg-black"
            />
        </>
    )
}
