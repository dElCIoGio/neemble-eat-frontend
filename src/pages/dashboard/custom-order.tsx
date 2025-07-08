
import { useState, useEffect } from "react"
import { Plus, Minus, ShoppingCart, ArrowLeft, MapPin, Users, Trash2, Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {CustomizationRule} from "@/types/item";
import {CartItem, CartItemCustomisation} from "@/lib/helpers/cart";
import {useParams} from "react-router";
import {useGetRestaurantBySlug, useGetCurrentMenu} from "@/api/endpoints/restaurants/hooks";
import {useGetMenuItemsBySlug} from "@/api/endpoints/menu/hooks";
import {useListRestaurantTables} from "@/api/endpoints/tables/hooks";
import {useGetActiveSessionByTableNumber} from "@/api/endpoints/sessions/hooks";
import {useCart} from "@/hooks/use-cart";
import {showErrorToast, showPromiseToast, showWarningToast} from "@/utils/notifications/toast";
import {ordersApi} from "@/api/endpoints/orders/requests";
import {Loader} from "@/components/ui/loader";
import {Restaurant} from "@/types/restaurant";
import {Menu} from "@/types/menu";
import {Item} from "@/types/item";
import {Table} from "@/types/table";
import {TableSession} from "@/types/table-session";


export default function OrderCustomizationPage() {

    const {restaurantSlug} = useParams() as {restaurantSlug: string}

    const [selectedTable, setSelectedTable] = useState<number | null>(null)

    const {data: restaurant, isLoading: isRestaurantLoading} = useGetRestaurantBySlug(restaurantSlug)
    const {data: menu, isLoading: isMenuLoading} = useGetCurrentMenu(restaurant?._id)
    const {data: items = [], isLoading: isItemsLoading} = useGetMenuItemsBySlug(menu?.slug ?? "")
    const {data: tables = [], isLoading: isTablesLoading} = useListRestaurantTables(restaurant?._id ?? "")

    const {data: session, isLoading: isSessionLoading} = useGetActiveSessionByTableNumber({
        restaurantId: selectedTable !== null ? restaurant?._id : undefined,
        tableNumber: selectedTable ?? 0,
    })

    const isLoading =
        isRestaurantLoading ||
        isMenuLoading ||
        isItemsLoading ||
        isTablesLoading ||
        (selectedTable !== null && isSessionLoading)

    if (isLoading || !restaurant || !menu || (selectedTable !== null && !session)) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <Loader />
            </div>
        )
    }

    return (
        <OrderCustomizationContent
            restaurantSlug={restaurantSlug}
            restaurant={restaurant}
            menu={menu}
            items={items}
            tables={tables}
            session={session}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
        />
    )
}

interface ContentProps {
    restaurantSlug: string
    restaurant: Restaurant
    menu: Menu
    items: Item[]
    tables: Table[]
    session: TableSession
    selectedTable: number | null
    setSelectedTable: (n: number | null) => void
}

function OrderCustomizationContent({
    restaurantSlug,
    restaurant,
    menu,
    items,
    tables,
    session,
    selectedTable,
    setSelectedTable,
}: ContentProps) {

    const {
        cart,
        addItem,
        deleteProduct,
        findCartItemIndexByID,
        setCartEmpty,
    } = useCart(restaurantSlug, session._id, menu._id)

    const [currentItemIndex, setCurrentItemIndex] = useState(0)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [editingCartItemId, setEditingCartItemId] = useState<string | null>(null)

    // Current item customization state
    const [quantity, setQuantity] = useState(1)
    const [selectedCustomizations, setSelectedCustomizations] = useState<CartItemCustomisation[]>([])
    const [additionalNotes, setAdditionalNotes] = useState("")
    const [totalPrice, setTotalPrice] = useState(0)

    const currentItem = items[currentItemIndex]

    // Initialize customizations when item changes
    useEffect(() => {
        if (!currentItem) return
        const initialCustomizations = currentItem.customizations.map((rule) => ({
            ruleId: rule.name,
            ruleName: rule.name,
            selectedOptions: [],
        }))
        setSelectedCustomizations(initialCustomizations)
        setQuantity(1)
        setAdditionalNotes("")
        setEditingCartItemId(null)
    }, [currentItemIndex, currentItem])

    // Calculate total price
    useEffect(() => {
        if (!currentItem) {
            setTotalPrice(0)
            return
        }
        let customizationTotal = 0
        selectedCustomizations.forEach((customization) => {
            customization.selectedOptions.forEach((option) => {
                customizationTotal += option.priceModifier * option.quantity
            })
        })
        setTotalPrice((currentItem.price + customizationTotal) * quantity)
    }, [selectedCustomizations, quantity, currentItem])

    // Load cart item for editing
    useEffect(() => {
        if (editingCartItemId) {
            const index = findCartItemIndexByID(editingCartItemId)
            if (index >= 0) {
                const cartItem = cart[index]
                setCurrentItemIndex(items.findIndex((item) => item._id === cartItem.id))
                setQuantity(cartItem.quantity)
                setSelectedCustomizations(cartItem.customisations)
                setAdditionalNotes(cartItem.additionalNotes ?? "")
            }
        }
    }, [editingCartItemId, cart, items, findCartItemIndexByID])

    const handleCustomizationChange = (
        ruleName: string,
        optionName: string,
        priceModifier: number,
        isSelected: boolean,
        optionQuantity: number = 1,
    ) => {
        if (!currentItem) return
        setSelectedCustomizations((prev) => {
            const updated = [...prev]
            const customizationIndex = updated.findIndex((c) => c.ruleName === ruleName)

            if (customizationIndex === -1) return prev

            const customization = updated[customizationIndex]
            const rule = currentItem.customizations.find((r) => r.name === ruleName)

            if (!rule) return prev

            if (isSelected) {
                const existingOptionIndex = customization.selectedOptions.findIndex((o) => o.optionName === optionName)

                if (existingOptionIndex >= 0) {
                    customization.selectedOptions[existingOptionIndex].quantity = optionQuantity
                } else {
                    const currentCount = customization.selectedOptions.reduce((sum, opt) => sum + opt.quantity, 0)

                    if (rule.limitType === "UP_TO" && currentCount >= rule.limit) {
                        return prev
                    }

                    if (rule.limitType === "EXACTLY" && currentCount >= rule.limit) {
                        customization.selectedOptions = [{ optionName, quantity: optionQuantity, priceModifier }]
                    } else {
                        customization.selectedOptions.push({ optionName, quantity: optionQuantity, priceModifier })
                    }
                }
            } else {
                customization.selectedOptions = customization.selectedOptions.filter((o) => o.optionName !== optionName)
            }

            return updated
        })
    }

    const isOptionSelected = (ruleName: string, optionName: string) => {
        const customization = selectedCustomizations.find((c) => c.ruleName === ruleName)
        return customization?.selectedOptions.some((o) => o.optionName === optionName) || false
    }

    const getOptionQuantity = (ruleName: string, optionName: string) => {
        const customization = selectedCustomizations.find((c) => c.ruleName === ruleName)
        const option = customization?.selectedOptions.find((o) => o.optionName === optionName)
        return option?.quantity || 0
    }

    const canSelectMore = (rule: CustomizationRule) => {
        const customization = selectedCustomizations.find((c) => c.ruleName === rule.name)
        if (!customization) return true

        const currentCount = customization.selectedOptions.reduce((sum, opt) => sum + opt.quantity, 0)

        switch (rule.limitType) {
            case "UP_TO":
                return currentCount < rule.limit
            case "EXACTLY":
                return currentCount < rule.limit
            case "AT_LEAST":
                return true
            case "ALL":
                return currentCount < rule.options.length
            default:
                return true
        }
    }

    const isRequiredRuleSatisfied = (rule: CustomizationRule) => {
        if (!rule.isRequired) return true

        const customization = selectedCustomizations.find((c) => c.ruleName === rule.name)
        if (!customization) return false

        const currentCount = customization.selectedOptions.reduce((sum, opt) => sum + opt.quantity, 0)

        switch (rule.limitType) {
            case "EXACTLY":
                return currentCount === rule.limit
            case "AT_LEAST":
                return currentCount >= rule.limit
            case "UP_TO":
                return currentCount > 0
            case "ALL":
                return currentCount === rule.options.length
            default:
                return currentCount > 0
        }
    }

    const allRequiredRulesSatisfied = () => {
        return !!currentItem && currentItem.customizations.every((rule) => isRequiredRuleSatisfied(rule))
    }

    const handleAddToCart = () => {
        if (!currentItem) return
        if (!allRequiredRulesSatisfied()) {
            showWarningToast("Please complete all required selections")
            return
        }

        let customizationTotal = 0
        selectedCustomizations.forEach((c) => {
            c.selectedOptions.forEach((o) => {
                customizationTotal += o.priceModifier * o.quantity
            })
        })

        const unitPrice = currentItem.price + customizationTotal

        const cartItem: CartItem = {
            id: currentItem._id,
            name: currentItem.name,
            price: unitPrice,
            image: currentItem.imageUrl,
            quantity,
            customisations: selectedCustomizations.filter((c) => c.selectedOptions.length > 0),
            additionalNotes,
        }

        if (editingCartItemId) {
            const index = findCartItemIndexByID(editingCartItemId)
            if (index >= 0) deleteProduct(index)
            addItem(cartItem)
            setEditingCartItemId(null)
        } else {
            addItem(cartItem)
        }

        // Reset form
        setQuantity(1)
        setSelectedCustomizations(
            currentItem.customizations.map((rule) => ({
                ruleId: rule.name,
                ruleName: rule.name,
                selectedOptions: [],
            })),
        )
        setAdditionalNotes("")
    }

    const handleRemoveFromCart = (cartItemId: string) => {
        const index = findCartItemIndexByID(cartItemId)
        if (index >= 0) {
            deleteProduct(index)
            if (editingCartItemId === cartItemId) {
                setEditingCartItemId(null)
            }
        }
    }

    const handleEditCartItem = (cartItemId: string) => {
        setEditingCartItemId(cartItemId)
        setIsCartOpen(false)
    }

    const cancelEdit = () => {
        setEditingCartItemId(null)
        setQuantity(1)
        setSelectedCustomizations(
            currentItem.customizations.map((rule) => ({
                ruleId: rule.name,
                ruleName: rule.name,
                selectedOptions: [],
            })),
        )
        setAdditionalNotes("")
    }

    const getTotalCartValue = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getTotalCartItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }

    const handleSubmitOrder = () => {
        if (!selectedTable) {
            showErrorToast("Please select a table first")
            return
        }

        if (cart.length === 0) {
            showWarningToast("Please add items to your cart first")
            return
        }

        if (!restaurant){
            showErrorToast("Please select a restaurant first")
            return
        }

        const orders = cart.map((cartItem) => ({
            sessionId: session._id,
            itemId: cartItem.id,
            quantity: cartItem.quantity,
            additionalNote: cartItem.additionalNotes,
            customisations: cartItem.customisations,
            orderedItemName: cartItem.name,
            restaurantId: restaurant._id,
            unitPrice: cartItem.price,
            total: cartItem.price * cartItem.quantity,
            tableNumber: selectedTable,
        }))

        const promise = ordersApi.addOrdersGroup(orders, session._id)

        showPromiseToast(promise, {
            loading: "Submitting order...",
            success: "Order submitted!",
            error: "Failed to submit order",
        })

        promise.then(() => {
            setCartEmpty()
            setSelectedTable(null)
        })
    }

    if (!currentItem) {
        return <div className="p-4">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between p-4">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold truncate">{editingCartItemId ? "Edit Item" : "Customize Order"}</h1>
                    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                        <SheetTrigger asChild className="p-4">
                            <Button variant="outline" size="sm" className="relative">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Cart
                                {cart.length > 0 && (
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                        {getTotalCartItems()}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-lg">
                            <SheetHeader>
                                <SheetTitle>Your Order</SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="h-[calc(100vh-200px)] mt-4 p-4">
                                {cart.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.map((cartItem) => (
                                            <Card key={cartItem.id}>
                                                <CardContent className="">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-semibold">{cartItem.name}</h3>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => handleEditCartItem(cartItem.id)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-red-500 hover:text-red-700"
                                                                onClick={() => handleRemoveFromCart(cartItem.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p>Quantity: {cartItem.quantity}</p>
                                                        {cartItem.customisations.map((customization) => (
                                                            <div key={customization.ruleName}>
                                                                <span className="font-medium">{customization.ruleName}: </span>
                                                                {customization.selectedOptions
                                                                    .map((option) => `${option.optionName} (${option.quantity})`)
                                                                    .join(", ")}
                                                            </div>
                                                        ))}
                                                        {cartItem.additionalNotes && (
                                                            <p>
                                                                <span className="font-medium">Notes: </span>
                                                                {cartItem.additionalNotes}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right mt-2">
                                                        <span className="font-bold text-green-600">Kz {(cartItem.price * cartItem.quantity).toFixed(2)}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                            {cart.length > 0 && (
                                <div className="border-t pt-4 mt-4 p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-xl font-bold text-green-600">Kz {getTotalCartValue().toFixed(2)}</span>
                                    </div>
                                    <Button className="w-full" onClick={handleSubmitOrder} disabled={!selectedTable}>
                                        Submit Order
                                    </Button>
                                    <Button variant="destructive" className="w-full mt-2" onClick={setCartEmpty}>
                                        Clear Cart
                                    </Button>
                                    {!selectedTable && (
                                        <p className="text-sm text-red-500 text-center mt-2">Please select a table first</p>
                                    )}
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 pb-32">
                {/* Table Selection */}
                <Card className="mb-6">
                    <CardHeader className="">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Table Selection
                            <span className="text-red-500">*</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={selectedTable?.toString() || ""}
                            onValueChange={(value) => setSelectedTable(Number.parseInt(value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your table" />
                            </SelectTrigger>
                            <SelectContent>
                                {tables
                                    .map((table) => {

                                        if (!table.isActive || !table.currentSessionId){
                                            return (
                                                <SelectItem key={table._id} value={table.number.toString()} disabled>
                                                    <div className="flex items-center gap-3 opacity-50">
                                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <Users className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Table {table.number}</span>
                                                            <span className="text-sm text-gray-500 ml-2">{!table.isActive ? "Closed" : "Occupied"}</span>
                                                        </div>
                                                    </div>
                                                </SelectItem>

                                            )
                                        }


                                        return (
                                            <SelectItem key={table._id} value={table.number.toString()}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        <Users className="h-4 w-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Table {table.number}</span>
                                                        <span className="text-sm text-green-600 ml-2">Available</span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        )

                                    })}
                            </SelectContent>
                        </Select>

                        {selectedTable && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                        <Users className="h-3 w-3 text-green-600" />
                                    </div>
                                    <span className="text-sm font-medium text-green-800">Table {selectedTable} selected</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Item Selection */}
                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle>Select Item</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={currentItem?._id}
                            onValueChange={(value) => {
                                const index = items.findIndex((item) => item._id === value)
                                if (index !== -1) {
                                    setCurrentItemIndex(index)
                                }
                            }}
                        >
                            <SelectTrigger className="w-full h-12">
                                <SelectValue placeholder="Choose an item to customize" />
                            </SelectTrigger>
                            <SelectContent>
                                {items.map((item) => (
                                    <SelectItem key={item._id} value={item._id}>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-sm text-gray-600 truncate max-w-[200px] hidden">{item.description}</div>
                                            </div>
                                            <Badge variant="secondary" className="ml-3">
                                                Kz {item.price.toFixed(2)}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Current Item Display */}
                <Card className="mb-6">
                    <CardContent className="p-0">
                        <div className="relative w-full h-48 md:h-64">
                            <img
                                src={currentItem.imageUrl || "/placeholder.svg"}
                                alt={currentItem.name}
                                className="object-cover w-full h-full rounded-t-lg"
                            />
                        </div>
                        <div className="p-4 md:p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl md:text-2xl font-bold">{currentItem.name}</h2>
                                <Badge variant="secondary" className="text-lg font-semibold">
                                    Kz {currentItem.price.toFixed(2)}
                                </Badge>
                            </div>
                            <p className="text-gray-600 text-sm md:text-base">{currentItem.description}</p>
                            {editingCartItemId && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-blue-800">Editing cart item</span>
                                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                                            <X className="h-4 w-4 mr-1" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Customizations */}
                <div className="space-y-6">
                    {currentItem.customizations.map((rule, ruleIndex) => (
                        <Card key={ruleIndex}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        {rule.name}
                                        {rule.isRequired && <span className="text-red-500 ml-1">*</span>}
                                    </CardTitle>
                                    <Badge variant={isRequiredRuleSatisfied(rule) ? "default" : "destructive"} className="text-xs">
                                        {rule.limitType === "EXACTLY" && `Choose ${rule.limit}`}
                                        {rule.limitType === "UP_TO" && `Up to ${rule.limit}`}
                                        {rule.limitType === "AT_LEAST" && `At least ${rule.limit}`}
                                        {rule.limitType === "ALL" && "Choose all"}
                                    </Badge>
                                </div>
                                {rule.description && <p className="text-sm text-gray-600">{rule.description}</p>}
                            </CardHeader>
                            <CardContent className="pt-0">
                                {rule.limitType === "EXACTLY" && rule.limit === 1 ? (
                                    <RadioGroup
                                        value={
                                            selectedCustomizations.find((c) => c.ruleName === rule.name)?.selectedOptions[0]?.optionName || ""
                                        }
                                        onValueChange={(value) => {
                                            const option = rule.options.find((o) => o.name === value)
                                            if (option) {
                                                handleCustomizationChange(rule.name, option.name, option.priceModifier, true, 1)
                                            }
                                        }}
                                    >
                                        <div className="space-y-3">
                                            {rule.options.map((option, optionIndex) => (
                                                <div
                                                    key={optionIndex}
                                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <RadioGroupItem value={option.name} id={`${rule.name}-${option.name}`} />
                                                        <Label htmlFor={`${rule.name}-${option.name}`} className="font-medium cursor-pointer">
                                                            {option.name}
                                                        </Label>
                                                    </div>
                                                    <div className="text-sm font-medium">
                                                        {option.priceModifier > 0 && `+$${option.priceModifier.toFixed(2)}`}
                                                        {option.priceModifier < 0 && `-$${Math.abs(option.priceModifier).toFixed(2)}`}
                                                        {option.priceModifier === 0 && "Included"}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                ) : (
                                    <div className="space-y-3">
                                        {rule.options.map((option, optionIndex) => {
                                            const isSelected = isOptionSelected(rule.name, option.name)
                                            const currentQuantity = getOptionQuantity(rule.name, option.name)

                                            return (
                                                <div
                                                    key={optionIndex}
                                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3 flex-1">
                                                        <Checkbox
                                                            id={`${rule.name}-${option.name}`}
                                                            checked={isSelected}
                                                            onCheckedChange={(checked) => {
                                                                handleCustomizationChange(
                                                                    rule.name,
                                                                    option.name,
                                                                    option.priceModifier,
                                                                    checked as boolean,
                                                                    1,
                                                                )
                                                            }}
                                                            disabled={!isSelected && !canSelectMore(rule)}
                                                        />
                                                        <div className="flex-1">
                                                            <Label htmlFor={`${rule.name}-${option.name}`} className="font-medium cursor-pointer">
                                                                {option.name}
                                                            </Label>
                                                            <div className="text-sm text-gray-600">
                                                                {option.priceModifier > 0 && `+$${option.priceModifier.toFixed(2)}`}
                                                                {option.priceModifier < 0 && `-$${Math.abs(option.priceModifier).toFixed(2)}`}
                                                                {option.priceModifier === 0 && "Included"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isSelected && option.maxQuantity > 1 && (
                                                        <div className="flex items-center space-x-2 ml-4">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => {
                                                                    if (currentQuantity > 1) {
                                                                        handleCustomizationChange(
                                                                            rule.name,
                                                                            option.name,
                                                                            option.priceModifier,
                                                                            true,
                                                                            currentQuantity - 1,
                                                                        )
                                                                    } else {
                                                                        handleCustomizationChange(
                                                                            rule.name,
                                                                            option.name,
                                                                            option.priceModifier,
                                                                            false,
                                                                            0,
                                                                        )
                                                                    }
                                                                }}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="w-8 text-center font-medium">{currentQuantity}</span>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => {
                                                                    if (currentQuantity < option.maxQuantity && canSelectMore(rule)) {
                                                                        handleCustomizationChange(
                                                                            rule.name,
                                                                            option.name,
                                                                            option.priceModifier,
                                                                            true,
                                                                            currentQuantity + 1,
                                                                        )
                                                                    }
                                                                }}
                                                                disabled={currentQuantity >= option.maxQuantity || !canSelectMore(rule)}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Additional Notes */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Special Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Any special requests or dietary restrictions?"
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            className="min-h-[80px] resize-none"
                        />
                    </CardContent>
                </Card>

                {/* Quantity and Total */}
                <Card className="mt-6">
                    <CardContent className="">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-medium">Quantity</Label>
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">Item Total</span>
                            <span className="text-base font-bold text-green-600">Kz {totalPrice.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-pb">
                <div className="max-w-4xl mx-auto">
                    <Button
                        className="w-full h-14 text-lg font-semibold"
                        onClick={handleAddToCart}
                        disabled={!allRequiredRulesSatisfied()}
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {editingCartItemId ? "Update Item" : "Add to Cart"} • Kz {totalPrice.toFixed(2)}
                    </Button>

                    {!allRequiredRulesSatisfied() && (
                        <p className="text-sm text-red-500 text-center mt-2">Please complete all required selections</p>
                    )}
                </div>
            </div>
        </div>
    )
}
