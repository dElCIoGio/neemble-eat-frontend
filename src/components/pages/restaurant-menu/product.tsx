
import {useState, ReactNode, useCallback} from "react";
import {useCart} from "@/hooks/use-cart";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@radix-ui/react-scroll-area";
import {PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Popover} from "@radix-ui/react-popover";
import {z} from 'zod';
import {
    Sheet,
    SheetClose,
    SheetContent, SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {toast} from "sonner";
import {Item} from "@/types/item";
import {ProductContext, useProductContext} from "@/hooks/use-product-context";
import {CartItem} from "@/lib/helpers/cart";
import {AdditionalNoteSchema} from "@/lib/schemas/additional-note";
import {CartPopoverContent} from "@/components/pages/restaurant-menu/cart-popover-content";
import {ProductAdditionalInfo} from "@/components/pages/restaurant-menu-cart/product-additional-note";
import {ShoppingCart} from "lucide-react";


interface props {
    children: ReactNode;
    item: Item;
}


export function Product({children, item}: props) {


    const {cart, addItem} = useCart()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [numberOfItems, setNumberOfItems] = useState(0);
    const [total, setTotal] = useState<number>(0);
    const [productAdded, setProductAdded] = useState<boolean>(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)


    const showMessage = useCallback(() => {
        setProductAdded(true);
    }, []);

    const handleNumberOfItems = useCallback((operation: string) => {
        if (operation === '+') {
            setNumberOfItems(numberOfItems + 1);
        } else {
            setNumberOfItems(numberOfItems - 1);
        }
    }, [numberOfItems]);


    const handleTotal = useCallback((operation: string) => {
        if (item == null) {
            return;
        }
        if (operation === '+') {
            setTotal(total + item.price);
        } else {
            setTotal(total - item.price);
        }
    }, [item, total]);


    const handleQuantityChange = useCallback((operation: string) => {
        if (operation === '+') {
            handleNumberOfItems(operation);
            handleTotal(operation);
        } else {
            if (total) {
                handleNumberOfItems(operation);
                handleTotal(operation);
            }
        }
    }, [total, handleNumberOfItems, handleTotal]);


    function handleSubmit(data: z.infer<typeof AdditionalNoteSchema>) {
        const note = data.note
        if (!item) return
        if (item._id != undefined && item.imageUrl != undefined) {
            const data: CartItem = {
                id: item._id,
                image: item.imageUrl,
                name: item.name,
                price: item.price,
                quantity: numberOfItems,
                additionalNote: note
            }
            if (note == "")
                data.additionalNote = note
            addItem(data)
        }
        setNumberOfItems(0)
        setTotal(0)
        showMessage()
        setIsPopoverOpen(true)


        toast("Pedido adicionado ao carrinho!")

    }


    return (
        <ProductContext.Provider value={{
            item,
            productAdded,
            onSubmit: handleSubmit,
            onClickItemQuantity: handleQuantityChange,
            quantity: numberOfItems,
            total
        }}>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    {children}
                </SheetTrigger>
                <SheetContent className="max-h-[90%] px-1 flex flex-col rounded-t-2xl" side={"bottom"}>
                    <SheetHeader>
                        <SheetTitle>
                            <div className={"flex relative justify-between items-center px-2"}>
                                <div className='flex-grow'/>
                                <h1 className={"text-center flex-none"}>
                                    {item.name}
                                </h1>
                                <div className='flex-grow'/>
                                <Popover open={isPopoverOpen} onOpenChange={(val) => setIsPopoverOpen(val)}>
                                    <PopoverTrigger className="hidden">
                                        <ShoppingCart/>
                                    </PopoverTrigger>
                                    <PopoverContent className={"m-2 hidden"}>
                                        <CartPopoverContent cart={cart} productAdded={productAdded}/>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </SheetTitle>
                        <SheetDescription>{undefined}</SheetDescription>
                    </SheetHeader>
                    <div className="overflow-y-auto">
                        <ScrollArea className="overflow-y-auto">
                            <ProductContent/>
                        </ScrollArea>
                    </div>
                    <SheetFooter className="pt-2 ">
                        <SheetClose asChild>
                            <Button variant="outline" className={`w-full mx-4`}>Cancelar</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </ProductContext.Provider>
    );
}

export function ProductContent() {

    const {item} = useProductContext()


    return <div>
        <div className='mx-auto rounded-md w-fit items-center overflow-hidden pb-4 px-5'>
            {
                item && item.imageUrl &&
                <img src={item?.imageUrl}
                     alt=""
                     className='rounded-md object-cover w-full max-h-52'/>
            }

        </div>
        <div>
            <h1 className='ml-5 font-semibold text-lg'>
                {item?.name}
            </h1>
            <div>
                <p className='rounded-lg text-sm ml-3.5 px-2 py-2 font-poppins-light'>
                    {item?.description}
                </p>
            </div>
            <div className='ml-6 mt-2'>
                <p className='w-fit italic font-semibold'>
                    {item?.price}.00 Kz
                </p>
            </div>
        </div>

        <div className='mt-7 mx-4 space-y-4'>
            <h1 className='font-poppins-semibold bg-gray-100 py-3 pl-5 rounded-lg'>
                Informação Adicional
            </h1>
            <ProductAdditionalInfo/>
        </div>
    </div>
}
