import {SelectedCustomization} from "@/types/order";

export type CartItemCustomisation = {
    ruleName: string;
    selectedOptions: SelectedCustomization[];
}

export interface CartItem {
    id: string,
    name: string,
    price: number,
    quantity: number;
    image: string;
    additionalNotes?: string;
    customisations: CartItemCustomisation[]
}

const getCartKey = (restaurantSlug: string, sessionId: string, menuId: string) => {
    return `neembleeat_cart_${restaurantSlug}_${sessionId}_${menuId}`
}


export const initializeCartInLocalStorage = (restaurantSlug: string, sessionId: string, menuId: string) => {
    const cart: Array<CartItem> = [];
    const cartKey = getCartKey(restaurantSlug, sessionId, menuId)
    localStorage.setItem(cartKey, JSON.stringify(cart));
    return cart;
};

export const getCartFromLocalStorage = (restaurantSlug: string, sessionId: string, menuId: string): CartItem[] => {
    const cartKey = getCartKey(restaurantSlug, sessionId, menuId)
    const cart = localStorage.getItem(cartKey);
    return cart ? JSON.parse(cart) : [];
};

export function getCart(restaurantSlug: string, sessionId: string, menuId: string) {
    const existingCart = getCartFromLocalStorage(restaurantSlug, sessionId, menuId);
    if (existingCart) {
        return existingCart;
    } else {
        return initializeCartInLocalStorage(restaurantSlug, sessionId, menuId);
    }
}

export const saveCartToLocalStorage = (cart: Array<CartItem>, restaurantSlug: string, sessionId: string, menuId: string) => {
    const cartKey = getCartKey(restaurantSlug, sessionId, menuId)
    localStorage.setItem(cartKey, JSON.stringify(cart));
};