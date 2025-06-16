export interface StockItem {
    _id: string;
    createdAt: Date
    updatedAt: Date
    name: string;
    unit: string;
    currentQuantity: number;
    minQuantity: number;
    maxQuantity?: number;
    lastEntry: string;
    supplier: string;
    status: "OK" | "Baixo" | "Crítico";
    category: string;
    notes?: string;
    cost?: number;
    expiryDate?: string;
    barcode?: string;
    location?: string;
    autoReorder?: boolean;
    reorderPoint?: number;
    reorderQuantity?: number;
}

export interface Movement {
    _id: string;
    createdAt: Date
    updatedAt: Date
    productId: number;
    productName: string;
    type: "entrada" | "saída" | "ajuste";
    quantity: number;
    unit: string;
    date: string;
    reason: string;
    user: string;
    cost?: number;
}

export interface Recipe {
    _id: string;
    createdAt: Date
    updatedAt: Date
    dishName: string;
    ingredients: Array<{
        productId: number;
        productName: string;
        quantity: number;
        unit: string;
    }>;
    servings: number;
    cost: number;
}

export interface Supplier {
    _id: string;
    createdAt: Date
    updatedAt: Date
    name: string;
    contact: string;
    email: string;
    phone: string;
    address: string;
    products: number[];
    rating: number;
    lastOrder?: string;
}

export interface Sale {
    _id: string;
    createdAt: Date
    updatedAt: Date
    dishName: string;
    quantity: number;
    date: string;
    total: number;
}
