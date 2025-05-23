export type InvoiceStatus = "pending" | "paid" | "cancelled";

export type Invoice = {
    id: string;
    createdAt: string;
    updatedAt: string;
    restaurantId: string;
    sessionId: string;
    orders: string[];
    total?: number | null;
    tax?: number | null;
    discount?: number | null;
    generatedTime: string; // ISO 8601 format
    status: InvoiceStatus;
    isActive: boolean;
};
