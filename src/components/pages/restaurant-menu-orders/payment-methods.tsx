import {ReactNode} from "react";
import {useOrdersContext} from "@/context/order-context";
import {SwipeToConfirmButton} from "@/components/pages/restaurant-menu-orders/swipe-to-confirm";
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
    const {refreshOrders, cleanList, setBillDialogOpen} = useOrdersContext()
    const { session } = useRestaurantMenuContext()

    const handleCloseSession = async () =>{
        setBillDialogOpen(true)
        cleanList()

        showPromiseToast(
            sessionApi.closeSession(session._id)
                .then(() => {
                    refreshOrders()
                }),
            {
                loading: "Pedindo a conta...",
                success: "Conta está a caminho!",
                error: "Falha ao pedir a conta. Tente novamente."
            }
        );

    }

    return <SwipeToConfirmButton label="Confirmar"
                                 onConfirm={
                                     async () => {
                                         try {
                                             await handleCloseSession()
                                         } catch (error) {
                                             console.error(error)
                                         }
                                     }
                                 }
                                 color="bg-black"/>
}
