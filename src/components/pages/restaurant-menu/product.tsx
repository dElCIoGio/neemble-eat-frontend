
import {useState, ReactNode, useCallback, useEffect} from "react";
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
import {CartItem, CartItemCustomisation} from "@/lib/helpers/cart";
import {CustomizationRule} from "@/types/item";
import {AdditionalNoteSchema} from "@/lib/schemas/additional-note";
import {CartPopoverContent} from "@/components/pages/restaurant-menu/cart-popover-content";
import {ProductAdditionalInfo} from "@/components/pages/restaurant-menu-cart/product-additional-note";
import {ShoppingCart} from "lucide-react";
import {useRestaurantMenuContext} from "@/context/restaurant-menu-context";


interface props {
    children: ReactNode;
    item: Item;
}


export function Product({children, item}: props) {

    const {
        restaurant
    } = useRestaurantMenuContext()

    const {cart, addItem} = useCart(restaurant._id)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [numberOfItems, setNumberOfItems] = useState(0)
    const [total, setTotal] = useState<number>(0)
    const [productAdded, setProductAdded] = useState<boolean>(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
    const [selectedCustomizations, setSelectedCustomizations] = useState<CartItemCustomisation[]>([])


    const showMessage = useCallback(() => {
        setProductAdded(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setNumberOfItems(0)
            const initial = item.customizations.map(rule => ({
                ruleName: rule.name,
                selectedOptions: [],
            }))
            setSelectedCustomizations(initial)
            setTotal(0)
        }
    }, [isOpen, item])

    const calculateUnitPrice = useCallback(() => {
        let customizationTotal = 0
        selectedCustomizations.forEach(c => {
            c.selectedOptions.forEach(o => {
                customizationTotal += o.priceModifier * o.quantity
            })
        })
        return item.price + customizationTotal
    }, [item.price, selectedCustomizations])

    useEffect(() => {
        const price = calculateUnitPrice()
        setTotal(price * numberOfItems)
    }, [numberOfItems, calculateUnitPrice])

    const handleNumberOfItems = useCallback((operation: string) => {
        if (operation === '+') {
            setNumberOfItems(prev => prev + 1)
        } else {
            setNumberOfItems(prev => Math.max(0, prev - 1))
        }
    }, [])


    const handleQuantityChange = useCallback((operation: string) => {
        if (operation === '+') {
            handleNumberOfItems('+')
        } else {
            handleNumberOfItems('-')
        }
    }, [handleNumberOfItems])

    const handleCustomizationChange = (
        ruleName: string,
        optionName: string,
        priceModifier: number,
        isSelected: boolean,
        optionQuantity: number = 1,
    ) => {
        setSelectedCustomizations(prev => {
            const updated = [...prev]
            const customizationIndex = updated.findIndex(c => c.ruleName === ruleName)
            if (customizationIndex === -1) return prev
            const customization = updated[customizationIndex]
            const rule: CustomizationRule | undefined = item.customizations.find(r => r.name === ruleName)
            if (!rule) return prev
            if (isSelected) {
                const existingOptionIndex = customization.selectedOptions.findIndex(o => o.optionName === optionName)
                if (existingOptionIndex >= 0) {
                    customization.selectedOptions[existingOptionIndex].quantity = optionQuantity
                } else {
                    const currentCount = customization.selectedOptions.reduce((sum, opt) => sum + opt.quantity, 0)
                    if (rule.limitType === 'UP_TO' && currentCount >= rule.limit) {
                        return prev
                    }
                    if (rule.limitType === 'EXACTLY' && currentCount >= rule.limit) {
                        customization.selectedOptions = [{ optionName, quantity: optionQuantity, priceModifier }]
                    } else {
                        customization.selectedOptions.push({ optionName, quantity: optionQuantity, priceModifier })
                    }
                }
            } else {
                customization.selectedOptions = customization.selectedOptions.filter(o => o.optionName !== optionName)
            }
            return updated
        })
    }

    const isOptionSelected = (ruleName: string, optionName: string) => {
        const customization = selectedCustomizations.find(c => c.ruleName === ruleName)
        return customization?.selectedOptions.some(o => o.optionName === optionName) || false
    }

    const getOptionQuantity = (ruleName: string, optionName: string) => {
        const customization = selectedCustomizations.find(c => c.ruleName === ruleName)
        const option = customization?.selectedOptions.find(o => o.optionName === optionName)
        return option?.quantity || 0
    }

    const canSelectMore = (rule: CustomizationRule) => {
        const customization = selectedCustomizations.find(c => c.ruleName === rule.name)
        if (!customization) return true

        const currentCount = customization.selectedOptions.reduce((sum, opt) => sum + opt.quantity, 0)

        switch (rule.limitType) {
            case 'UP_TO':
                return currentCount < rule.limit
            case 'EXACTLY':
                return currentCount < rule.limit
            case 'AT_LEAST':
                return true
            case 'ALL':
                return currentCount < rule.options.length
            default:
                return true
        }
    }

    const isRequiredRuleSatisfied = (rule: CustomizationRule) => {
        if (!rule.isRequired) return true

        const customization = selectedCustomizations.find(c => c.ruleName === rule.name)
        if (!customization) return false

        const currentCount = customization.selectedOptions.reduce((sum, opt) => sum + opt.quantity, 0)

        switch (rule.limitType) {
            case 'EXACTLY':
                return currentCount === rule.limit
            case 'AT_LEAST':
                return currentCount >= rule.limit
            case 'UP_TO':
                return currentCount > 0
            case 'ALL':
                return currentCount === rule.options.length
            default:
                return currentCount > 0
        }
    }

    const allRequiredRulesSatisfied = () => {
        return item.customizations.every(rule => isRequiredRuleSatisfied(rule))
    }


    function handleSubmit(data: z.infer<typeof AdditionalNoteSchema>) {
        const note = data.note
        const unitPrice = calculateUnitPrice()
        if (item._id != undefined && item.imageUrl != undefined) {
            const data: CartItem = {
                id: item._id,
                image: item.imageUrl,
                name: item.name,
                price: unitPrice,
                quantity: numberOfItems,
                additionalNotes: note,
                customisations: selectedCustomizations.filter(c => c.selectedOptions.length > 0),
            }
            if (note == "") data.additionalNotes = note
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
            total,
            handleCustomizationChange,
            getOptionQuantity,
            canSelectMore,
            isOptionSelected,
            allRequiredRulesSatisfied
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

    const {
        item,
        handleCustomizationChange,
        getOptionQuantity,
        isOptionSelected,
        canSelectMore
    } = useProductContext()


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
            {item.customizations.map((rule, ruleIndex) => (
                <div key={ruleIndex} className='space-y-3 border p-3 rounded-lg'>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-medium'>
                            {rule.name}{rule.isRequired && <span className='text-red-500 ml-1'>*</span>}
                        </h2>
                        <span className='text-xs'>
                            {rule.limitType === "EXACTLY" && `Choose ${rule.limit}`}
                            {rule.limitType === "UP_TO" && `Up to ${rule.limit}`}
                            {rule.limitType === "AT_LEAST" && `At least ${rule.limit}`}
                            {rule.limitType === "ALL" && "Choose all"}
                        </span>
                    </div>
                    {rule.options.map((option, optionIndex) => {
                        const selected = isOptionSelected(rule.name, option.name)
                        const qty = getOptionQuantity(rule.name, option.name)
                        return (
                            <div key={optionIndex} className='flex items-center justify-between'>
                                <div className='flex items-center space-x-2'>
                                    <input type='checkbox'
                                           checked={selected}
                                           onChange={(e) => handleCustomizationChange(rule.name, option.name, option.priceModifier, e.target.checked, 1)}
                                           disabled={!selected && !canSelectMore(rule)}
                                    />
                                    <span>{option.name}</span>
                                    <span className='text-xs text-gray-600'>
                                        {option.priceModifier > 0 && `+${option.priceModifier}`}
                                        {option.priceModifier < 0 && `${option.priceModifier}`}
                                    </span>
                                </div>
                                {selected && option.maxQuantity > 1 && (
                                    <div className='flex items-center space-x-1'>
                                        <button className='px-2 border' onClick={() => {
                                            if (qty > 1) {
                                                handleCustomizationChange(rule.name, option.name, option.priceModifier, true, qty - 1)
                                            } else {
                                                handleCustomizationChange(rule.name, option.name, option.priceModifier, false)
                                            }
                                        }}>-</button>
                                        <span>{qty}</span>
                                        <button className='px-2 border' onClick={() => {
                                            if (qty < option.maxQuantity && canSelectMore(rule)) {
                                                handleCustomizationChange(rule.name, option.name, option.priceModifier, true, qty + 1)
                                            }
                                        }}>+</button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ))}
            <h1 className='font-poppins-semibold bg-gray-100 py-3 pl-5 rounded-lg'>
                Informação Adicional
            </h1>
            <ProductAdditionalInfo/>
        </div>
    </div>
}
