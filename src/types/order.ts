export type OrderPrepStatus = "queued" | "in_progress" | "ready" | "served" | "cancelled";

export interface SelectedCustomization {
    optionName: string
    quantity: number
    priceModifier: number
}


export type OrderCustomizationSelection = {
    ruleName: string;
    selectedOptions: SelectedCustomization[];
};

export type OrderCreate = {
    sessionId: string;
    itemId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    orderedItemName?: string | null;
    restaurantId: string;
    customisations: OrderCustomizationSelection[];
    additionalNote?: string | null;
    tableNumber: number
}

export type Order = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    prepStatus: OrderPrepStatus;
    orderTime: string; // ISO 8601 datetime string

} & OrderCreate;
