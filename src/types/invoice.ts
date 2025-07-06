export type InvoiceStatus = "pending" | "paid" | "cancelled";

export type Invoice = {
    _id: string;
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

export type InvoiceCreate = {
    restaurantId: string;
    sessionId: string;
    orders: string[];
    total?: number | null;
    tax?: number | null;
    discount?: number | null;
    generatedTime: string;
    status: InvoiceStatus;
};

export type PartialInvoice = Partial<Omit<Invoice, "id" | "createdAt" | "updatedAt">>;
