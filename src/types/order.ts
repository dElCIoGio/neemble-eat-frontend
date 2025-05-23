export type OrderPrepStatus = "queued" | "in_progress" | "ready" | "served" | "cancelled";

export type OrderCustomizationSelection = {
    id: string;
    createdAt: string;
    updatedAt: string;
    ruleName: string;
    selectedOptions: string[];
};

export type Order = {
    id: string;
    createdAt: string;
    updatedAt: string;
    sessionId: string;
    itemId: string;
    orderTime: string; // ISO 8601 datetime string
    quantity: number;
    unitPrice: number;
    total: number;
    orderedItemName?: string | null;
    prepStatus: OrderPrepStatus;
    customizations: OrderCustomizationSelection[];
    additionalNote?: string | null;
};
