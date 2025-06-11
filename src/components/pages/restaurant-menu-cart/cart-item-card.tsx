import {Trash} from "lucide-react"
import {useCartContext} from "@/context/cart-context";

interface CartItemProps {
    itemIndex: number;
}


export function CartItemCard({itemIndex}: CartItemProps) {

    const {cart, findCartItemIndexByID, incrementProduct, deleteProduct, decrementProduct} = useCartContext()
    const item = cart[itemIndex]

    function getItem() {
        return cart[itemIndex]
    }

    function incrementItem(id: string) {
        const index = findCartItemIndexByID(id)
        incrementProduct(index)
    }

    function decrementItem(id: string) {
        const index = findCartItemIndexByID(id)
        decrementProduct(index)

    }

    function deleteItem(id: string) {
        const index = findCartItemIndexByID(id)
        return deleteProduct(index)
    }


    if (cart[itemIndex] == undefined) {
        return <div></div>
    }

    return (
        <div className='flex justify-between pt-3 pb-1'>
            <div className='flex w-full'>
                <div
                    className='flex items-center shadow-sm justify-center overflow-hidden rounded-xl mr-4 w-28 h-28 min-w-28 min-h-28'>
                    <img src={item.image}
                         alt=""
                         className='rounded-md object-cover w-full h-full'/>
                </div>
                <div className='w-full'>
                    <h1 className='font-semibold text-zinc-800'>
                        {item.name}
                    </h1>
                    <div className='text-sm text-zinc-600 flex'>
                        <p>{item.price} Kz </p>
                        <p className='mx-1'>x</p>
                        <p className='font-bold'>{getItem().quantity}</p>
                    </div>
                    <div className='flex justify-between items-center max-w-28 mt-3.5'>
                        <div className='flex space-x-3'>
                            <div
                                className='flex hover:bg-gray-400 transition-colors duration-300 items-center justify-center bg-gray-300 rounded-full px-2 cursor-pointer'>
                                <p className='flex items-center justify-center text-black prevent-select'
                                   onClick={() => decrementItem(getItem().id)}>
                                    -
                                </p>
                            </div>
                            <div
                                className='flex hover:bg-gray-400 transition-colors duration-300 items-center justify-center bg-gray-300 rounded-full px-2 cursor-pointer'>
                                <p className='flex items-center justify-center text-black prevent-select'
                                   onClick={() => incrementItem(getItem().id)}>
                                    +
                                </p>
                            </div>
                        </div>
                        <div>
                            <div
                                className='flex hover:bg-red-500 transition-colors duration-200 items-center justify-center bg-gray-300 rounded-full px-1 py-1 cursor-pointer'>
                                <Trash size={12}
                                       className={"m-1"}
                                       onClick={() => {
                                           deleteItem(getItem().id)
                                       }}/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div
                className=' ml-1.5 flex items-center'>
                <div className='flex items-center prevent-select'>
                    <p className='text-zinc-400'>{'>'}</p>
                </div>
            </div>
        </div>
    );
}

