import {useCartContext} from "@/context/cart-context";

export function NumberOfItems() {
    const {numberOfItems} = useCartContext()

    return (
        <div className='mt-5'>
            <p className="text-sm text-muted-foreground">
                {numberOfItems} {numberOfItems == 1 ? "item" : "itens"}
            </p>
        </div>
    );
}