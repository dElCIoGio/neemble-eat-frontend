export type OrderPrepStatus = "queued" | "in_progress" | "ready" | "served" | "cancelled";

export type OrderCustomizationSelection = {
    id: string;
    createdAt: string;
    updatedAt: string;
    ruleName: string;
    selectedOptions: string[];
};

export type OrderCreate = {
    sessionId: string;
    itemId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    orderedItemName?: string | null;
    restaurantId: string;
    customizations: OrderCustomizationSelection[];
    additionalNote?: string | null;
}

export type Order = {
    id: string;
    createdAt: string;
    updatedAt: string;
    prepStatus: OrderPrepStatus;
    orderTime: string; // ISO 8601 datetime string

} & OrderCreate;
