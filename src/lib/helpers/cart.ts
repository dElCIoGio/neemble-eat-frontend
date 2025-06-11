

export interface CartItem {
    id: string,
    name: string,
    price: number,
    quantity: number;
    image: string;
    additionalNote?: string;
}


export const initializeCartInLocalStorage = () => {
    const cart: Array<CartItem> = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
};

export const getCartFromLocalStorage = (): CartItem[] => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

export function getCart() {
    const existingCart = getCartFromLocalStorage();
    if (existingCart) {
        return existingCart;
    } else {
        return initializeCartInLocalStorage();
    }
}

export const saveCartToLocalStorage = (cart: Array<CartItem>) => {

    localStorage.setItem('cart', JSON.stringify(cart));
};