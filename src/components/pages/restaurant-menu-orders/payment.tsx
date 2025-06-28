import {useEffect, useState} from "react";
import {useOrdersContext} from "@/context/order-context";
import {useRestaurantMenuContext} from "@/context/restaurant-menu-context";
import {sessionApi} from "@/api/endpoints/sessions/requests";
import {showPromiseToast} from "@/utils/notifications/toast";
import {TipInput} from "@/components/pages/restaurant-menu-orders/tip-input";
import {OrdersCost} from "@/components/pages/restaurant-menu-orders/orders-cost";
import {Total} from "@/components/pages/restaurant-menu-orders/total";

export function Payment() {

    const [sessionPrice, setSessionPrice] = useState<number>(0)
    const { orders } = useOrdersContext()
    const { session } = useRestaurantMenuContext()

    const [tip, setTip] = useState<number>(0)
    const [billRequested, setBillRequested] = useState<boolean>(session.status === "needs bill")

    useEffect(() => {
        if (orders) {
            let total = 0
            for (const order of orders) {
                total += order.prepStatus != "cancelled" ? order.total : 0
            }
            setSessionPrice(total)
        }
    }, [orders])

    useEffect(() => {
        setBillRequested(session.status === "needs bill")
    }, [session.status])

    async function askForBill() {
        if ((sessionPrice + tip) == 0) return
        showPromiseToast(
            sessionApi.markSessionNeedsBill(session._id).then(() => {
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
        <div>
            <div className='bg-white -mb-1 shadow-sm py-3 px-3.5 rounded-3xl mt-3 border border-gray-200'>
                <TipInput tip={tip} setTip={setTip}/>
                {
                    tip != 0 &&
                    <OrdersCost sessionPrice={sessionPrice}/>
                }
                <div className='flex items-end mt-3 justify-between'>
                    <div className='space-y-2'>
                        <Total tip={tip} sessionPrice={sessionPrice}/>
                    </div>
                    <div>
                        {
                            billRequested ? (
                                <button
                                    disabled
                                    className='px-7 py-3 bg-gray-600 cursor-not-allowed text-sm text-white rounded-full'
                                >
                                    Alguém irá até você em breve
                                </button>
                            ) : (
                                <button
                                    className={`px-7 py-3 ${(sessionPrice + tip) == 0 ? "bg-gray-600 cursor-not-allowed" : "bg-black"} text-sm hover:bg-gray-600 transition duration-100 text-white rounded-full`}
                                    onClick={askForBill}
                                >
                                    Pedir Conta
                                </button>
                            )
                        }
                    </div>
                </div>
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
