import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router";
import {useMenuContext} from "@/context/menu-context";
import {CartItem} from "@/lib/helpers/cart";

interface PopUpButtonParams {
    cart: CartItem[]
    productAdded: boolean
}

export const CartPopoverContent = ({cart, productAdded}: PopUpButtonParams) => {

    const { selectedItem } = useMenuContext()

    const navigate = useNavigate()

    return (
        <div className="hidden">
            {
                cart.length > 0 ?
                    <div>
                        <div className='divide-y-[0.2px] divide-gray-300 space-y-2'>
                            {cart.reverse().map((item, index) => (
                                <div key={index} className='pt-2'>
                                    <h1 className='truncate text-base'>
                                        {item.name} <span
                                        className={`font-semibold`}>{productAdded && selectedItem && selectedItem._id === item.id && "- Novo"}</span>
                                    </h1>
                                    <div className='text-sm flex text-gray-700 space-x-1'>
                                        <p>
                                            {item.price} Kz
                                        </p>
                                        <p className='font-poppins-semibold'>
                                            x{item.quantity}
                                        </p>

                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className={"w-full mt-4 rounded-lg"} onClick={() =>
                            navigate(`cart`)
                        }>
                            Carrinho
                        </Button>
                    </div> :
                    <div className='flex justify-center items-center'>
                        <p className='text-gray-600 italic text-sm py-5'>
                            Carrinho Vazio
                        </p>
                    </div>
            }
        </div>
    );
};
