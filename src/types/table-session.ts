export type TableSessionStatus = "active" | "closed" | "cancelled";

export type TableSessionReview = {
    id: string;
    createdAt: string;
    updatedAt: string;
    stars: number; // 1 to 5
    comment?: string | null;
};

export type TableSession = {
    id: string;
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
};
