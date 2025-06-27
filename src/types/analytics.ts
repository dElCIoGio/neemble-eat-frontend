export interface ItemOrderQuantity {
    itemId: string;
    itemName: string;
    quantity: number;
}

export interface SalesSummary {
    totalSales: number;
    invoiceCount: number;
    averageInvoice: number;
    distinctTables: number;
    revenuePerTable: number;

    totalSalesGrowth: number;
    invoiceCountGrowth: number;
    averageInvoiceGrowth: number;
    distinctTablesGrowth: number;
    revenuePerTableGrowth: number;
}

export interface InvoiceCount {
    invoiceCount: number;
}

export interface OrderCount {
    orderCount: number;
}

export interface CancelledCount {
    cancelledCount: number;
}

export interface AverageSessionDuration {
    averageDurationMinutes: number;
}

export interface ActiveSessionCount {
    activeSessions: number;
}

export interface TotalOrdersCount {
    date: string
    sales: number
    day: string
}
