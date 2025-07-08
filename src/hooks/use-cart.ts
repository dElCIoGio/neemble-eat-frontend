import {useCallback, useEffect, useState, useRef} from "react";
import {CartItem, CartItemCustomisation, getCart, saveCartToLocalStorage} from "@/lib/helpers/cart";


function useCountCartItems(cart: CartItem[] = []) {
    const [count, setCount] = useState<number>(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    });

    function getItemCount() {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    useEffect(() => {
        setCount(getItemCount());
    }, [cart]);

    return count;
}

function useTotalCartValue(cart: CartItem[] = []) {
    const [total, setTotal] = useState<number>(() => {
        return cart.reduce((total, item) => total + item.quantity * item.price, 0);
    });

    const getTotalValue = useCallback((cart: Array<CartItem>) => {
        return cart.reduce((total, item) => total + item.quantity * item.price, 0);
    }, []);

    useEffect(() => {
        setTotal(getTotalValue(cart));
    }, [cart, getTotalValue]);

    return total;

}

export function useCart(restaurantSlug: string, sessionId: string, menuId: string) {
    const [cart, setCart] = useState<CartItem[]>(() => getCart(restaurantSlug, sessionId, menuId));
    const count = useCountCartItems(cart);
    const total = useTotalCartValue(cart);
    const cartRef = useRef(cart);


    useEffect(() => {
        saveCartToLocalStorage(cart, restaurantSlug, sessionId, menuId);
    }, [cart]);


    const findCartItemIndexByID = (id: string) => {
        return cart.findIndex(item => item.id === id);
    };


    const deleteProduct = (index: number) => {
        if (index >= 0) {
            setCart(prevCart => prevCart.filter((_, itemIndex) => index !== itemIndex));
            return 1;
        }
        return 0;
    };


    // Function to compare customisations
    const areCustomisationsEqual = (
        a: CartItemCustomisation[],
        b: CartItemCustomisation[],
    ): boolean => {
        if (a.length !== b.length) return false;
        return a.every(ruleA => {
            const ruleB = b.find(r => r.ruleName === ruleA.ruleName);
            if (!ruleB) return false;
            if (ruleA.selectedOptions.length !== ruleB.selectedOptions.length) return false;
            return ruleA.selectedOptions.every(optA => {
                const optB = ruleB.selectedOptions.find(o => o.optionName === optA.optionName);
                return !!optB &&
                    optB.quantity === optA.quantity &&
                    optB.priceModifier === optA.priceModifier;
            });
        });
    };

    // Function to add an item to the cart
    const addItem = (newItem: CartItem) => {
        setCart(() => {
            const prevCart = getCart(restaurantSlug, sessionId, menuId);

            // Check if the item already exists in the cart with same customisations
            const existingItemIndex = prevCart.findIndex(
                item =>
                    item.id === newItem.id &&
                    item.additionalNotes === newItem.additionalNotes &&
                    areCustomisationsEqual(item.customisations, newItem.customisations),
            );

            if (existingItemIndex !== -1) {
                // Item found: update its quantity
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + newItem.quantity,
                };
                cartRef.current = updatedCart;
                return updatedCart;
            }

            // Item not found: add it to the cart
            const newCart = [...prevCart, newItem];
            return newCart;
        });
    };

    const updateCartItem = (index: number, quantityChange: number) => {
        setCart(prevCart =>
            prevCart.map((item, itemIndex) => {
                if (itemIndex === index) {
                    return {
                        ...item,
                        quantity: item.quantity + quantityChange
                    };
                }
                return item;
            }).filter(item => item.quantity > 0) // Remove item if quantity reaches 0
        );
    };


    const decrementProduct = (index: number) => {
        if (index >= 0 && cart[index].quantity > 0) {
            if (cart[index].quantity === 1) {
                deleteProduct(index);
            } else {
                updateCartItem(index, -1);
            }
            return cart[index];
        }
        return null;
    };


    const incrementProduct = (index: number) => {
        if (index >= 0) {
            updateCartItem(index, 1);
            return cart[index];
        }
        return null;
    };


    const setCartEmpty = useCallback(() => {
        setCart([]);
    }, []);


    return {
        numberOfItems: count,
        cart,
        addItem,
        findCartItemIndexByID,
        incrementProduct,
        decrementProduct,
        deleteProduct,
        setCartEmpty,
        totalValue: total,
    }
}
