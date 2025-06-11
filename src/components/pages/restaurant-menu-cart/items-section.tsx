import {CartItemCard} from "@/components/pages/restaurant-menu-cart/cart-item-card";
import {useCartContext} from "@/context/cart-context";


export function ItemsSection() {

    const {cart} = useCartContext()

    return (
        <div className={`mx-0 mb-32 ${cart.length >= 4 && "pb-20"} divide-y divide-gray-300`}>
            {
                cart.map((item, index: number) =>
                        item != undefined && <div key={index} className='mt-3'>
                            <CartItemCard itemIndex={index}/>
                        </div>
                )
            }
        </div>
    );
}

