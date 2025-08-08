import {ChevronDown} from "lucide-react"
import {useEffect, useState} from "react";
import {useOrdersContext} from "@/context/order-context";
import {TipInput} from "@/components/pages/restaurant-menu-orders/tip-input";
import {OrdersCost} from "@/components/pages/restaurant-menu-orders/orders-cost";
import {Total} from "@/components/pages/restaurant-menu-orders/total";
import {PaymentMethods} from "@/components/pages/restaurant-menu-orders/payment-methods";

export function Payment() {

    const [sessionPrice, setSessionPrice] = useState<number>(0)
    const {orders, billRequested} = useOrdersContext()


    const [tip, setTip] = useState<number>(0);
    const [paymentMethodShowing, setPaymentMethodShowing] = useState<boolean>(false)
    const hasUnreadyOrders = orders?.some(order => !["ready", "served", "cancelled"].includes(order.prepStatus)) ?? false

    useEffect(() => {
        if (orders) {
            let total = 0
            for (const order of orders) {
                total += order.prepStatus != "cancelled" ? order.total : 0
            }
            setSessionPrice(total)
        }
    }, [orders]);

    function toggleShowPaymentMethods() {
        if ((sessionPrice + tip) != 0 && !billRequested && !hasUnreadyOrders) {
            setPaymentMethodShowing(!paymentMethodShowing)
        }
    }

    return (
        <div>
            <div className='bg-white -mb-1 shadow-sm py-3 px-3.5 rounded-3xl mt-3 border border-gray-200'>
                <TipInput tip={tip} setTip={setTip}/>
                {
                    tip != 0 &&
                    <OrdersCost sessionPrice={sessionPrice}/>
                }
                <div className='flex items-end mt-3 justify-between'>
                    <div className='space-y-2 bg-red-5'>
                        <Total tip={tip} sessionPrice={sessionPrice}/>
                    </div>
                    <div>
                        {
                            billRequested ? (
                                <button
                                    className="px-7 py-3 bg-gray-600 text-sm text-white rounded-full cursor-not-allowed"
                                    disabled
                                >
                                    Alguém irá até você em instantes
                                </button>
                            ) : (
                                <button
                                    className={`px-7 py-3 ${(sessionPrice + tip) == 0 || hasUnreadyOrders ? "bg-gray-600 cursor-not-allowed" : "bg-black"} text-sm hover:bg-gray-600 transition duration-100 text-white rounded-full `}
                                    onClick={toggleShowPaymentMethods}
                                    disabled={(sessionPrice + tip) == 0 || hasUnreadyOrders}
                                >
                                    {hasUnreadyOrders ? "Há pedidos em preparo" : "Pedir Conta"}
                                </button>
                            )
                        }
                    </div>
                </div>
                {
                    paymentMethodShowing && !billRequested && !hasUnreadyOrders &&
                    <div className='mt-3 border-t border-gray-100 pt-3'>
                        <div className='flex mb-3 items-center'>
                            <h1 className='mr-2 hidden'>
                                Selecione o mêtodo de pagamento
                            </h1>
                            <ChevronDown
                                className='cursor-pointer'
                                onClick={toggleShowPaymentMethods}/>
                        </div>
                        <PaymentMethods>
                            <PaymentMethods.Confirm/>
                        </PaymentMethods>
                    </div>
                }
            </div>
            <div>
                <div className='text-[12px] italic text-gray-400 ml-2 pt-8 pb-32'>
                    <p><span className='font-semibold not-italic'>Obs:&nbsp;</span>Quando estiver
                        satisfeito(a),
                        clique no
                        botão acima para pedir a sua conta facilmente.</p>
                </div>
            </div>
        </div>
    );
}
