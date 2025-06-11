import React from "react";
import {useCartContext} from "@/context/cart-context";
import {OrderAlert} from "@/components/pages/restaurant-menu-cart/order-alert";

interface Props {
    onSubmit: () => void,
}

export function Checkout({onSubmit}: Props) {

    const {setCustomerName, totalValue} = useCartContext()

    const handleCustomerName = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        setCustomerName(name);
        sessionStorage.setItem('CustomerName', name);
    };

    return (
        <div className={`fixed bottom-4 left-0 w-full`}>
            <div className='py-5 bg-white rounded-2xl px-5 mx-4 border border-gray-200 shadow-md'>
                <div className='flex flex-col'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className='italic text-sm text-zinc-700'>
                                Total:
                            </p>
                        </div>
                        <div>
                            <h2 className=' font-semibold text-lg'>
                                {totalValue} Kz
                            </h2>
                        </div>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <form className='w-full' action="" onSubmit={handleCustomerName}>
                                <textarea name="name" id="name" cols={30} rows={1}
                                          placeholder='Nome (opcional)'
                                          className="peer w-full text-base resize-none rounded-b-none border-b border-gray-300 bg-transparent pb-1.5 text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50 duration-200">

                                </textarea>
                            <div onClick={onSubmit}>
                                <OrderAlert/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

