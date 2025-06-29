import {ReactNode} from "react";
import {useOrdersContext} from "@/context/order-context";
import {SwipeToConfirmButton} from "@/components/pages/restaurant-menu-orders/swipe-to-confirm";
import {Banknote, CreditCard} from "lucide-react";
import {showPromiseToast} from "@/utils/notifications/toast";
import {sessionApi} from "@/api/endpoints/sessions/requests";
import {useRestaurantMenuContext} from "@/context/restaurant-menu-context";



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
    const { session } = useRestaurantMenuContext()

    const handleRequestBill = async () => {
        setBillDialogOpen(true)

        showPromiseToast(
            sessionApi.markSessionNeedsBill(session._id)
                .then(() => {
                    refreshOrders()
                    setBillRequested(true)
                }),
            {
                loading: "Pedindo a conta...",
                success: "Conta está a caminho!",
                error: "Falha ao pedir a conta. Tente novamente."
            }
        )
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
