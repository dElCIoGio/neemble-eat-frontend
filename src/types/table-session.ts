export type TableSessionStatus = "active" | "closed" | "cancelled" | "paid" | "needs bill";

export type TableSessionReview = {
    stars: number; // 1 to 5
    comment?: string | null;
};

export type TableSession = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    tableId: string;
    restaurantId: string;
    invoiceId?: string | null;
    startTime: string; // ISO 8601 datetime string
    endTime?: string | null;
    orders: string[];
    status: TableSessionStatus;
    total?: number | null;
    review?: TableSessionReview | null;
    needsAssistance?: boolean
};
