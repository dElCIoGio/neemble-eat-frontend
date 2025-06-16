

export type StockItemCreate = {
    name: string;
    unit: string;
    restaurantId: string
    currentQuantity: number;
    minQuantity: number;
    lastEntry: Date;
    supplier: string; // id
    category: string;
    status: "OK" | "Baixo" | "Critico";

}

export type StockItem = {
    _id: string;
    createdAt: Date
    updatedAt: Date
    minQuantity: number;
    maxQuantity?: number;
    notes?: string;
    cost?: number;
    expiryDate?: string;
    barcode?: string;
    location?: string;
    autoReorder?: boolean;
    reorderPoint?: number;
    reorderQuantity?: number;
} & StockItemCreate


export type MovementCreate = {
    productId: string;
    productName: string;
    type: "entrada" | "saida" | "ajuste";
    quantity: number;
    unit: string;
    date: Date;
    reason: string;
    user: string;
    cost?: number;

}


export type Movement = {
    _id: string;
    createdAt: Date
    updatedAt: Date
} & MovementCreate


export type RecipeIngredient = {
    productId: string;
    productName: string;
    quantity: number;
    unit: string;
}

export type RecipeCreate = {
    dishName: string;
    ingredients: Array<RecipeIngredient>;
    servings: number;
    cost: number;
    restaurantId: string;
}


export type Recipe = {
    _id: string;
    createdAt: Date
    updatedAt: Date
} & RecipeCreate

export type SupplierCreate = {
    name: string;
    contact: string;
    email: string;
    phone: string;
    address: string;
    products: string[];
    rating: number;
    restaurantId: string;
}

export type Supplier = {
    _id: string;
    createdAt: Date
    updatedAt: Date

    lastOrder?: string;
} & SupplierCreate


export type SaleCreate = {
    dishName: string;
    quantity: number;
    date: Date;
    total: number;
    restaurantId: string;

}

export type Sale = {
    _id: string;
    createdAt: Date
    updatedAt: Date
} & SaleCreate
