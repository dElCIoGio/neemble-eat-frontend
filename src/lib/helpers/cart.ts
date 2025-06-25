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


export const initializeCartInLocalStorage = (restaurantSlug: string) => {
    const cart: Array<CartItem> = [];
    localStorage.setItem(`neembleeat_cart_${restaurantSlug}`, JSON.stringify(cart));
    return cart;
};

export const getCartFromLocalStorage = (restaurantSlug: string): CartItem[] => {
    const cart = localStorage.getItem(`neembleeat_cart_${restaurantSlug}`);
    return cart ? JSON.parse(cart) : [];
};

export function getCart(restaurantSlug: string) {
    const existingCart = getCartFromLocalStorage(restaurantSlug);
    if (existingCart) {
        return existingCart;
    } else {
        return initializeCartInLocalStorage(restaurantSlug);
    }
}

export const saveCartToLocalStorage = (cart: Array<CartItem>, restaurantSlug: string) => {

    localStorage.setItem(`neembleeat_cart_${restaurantSlug}`, JSON.stringify(cart));
};