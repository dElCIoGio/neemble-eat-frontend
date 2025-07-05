import {OrderPrepStatus} from "@/types/order";
import {InvoiceStatus} from "@/types/invoice";

export interface FilterState {
    dateRange: {
        from: Date | null
        to: Date | null
    }
    categories: string[]
    orderStatus: OrderPrepStatus[]
    invoiceStatus: InvoiceStatus[]
}

export type DatePreset = "today" | "last7days" | "last30days" | "custom"
