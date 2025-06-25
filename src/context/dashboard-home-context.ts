import { createContext, useContext } from "react"
import { DateFilter, ItemsTimeRange, ShiftFilter, Insight } from "@/types/dashboard"
import {
    ActiveSessionCount,
    AverageSessionDuration,
    CancelledCount,
    InvoiceCount,
    ItemOrderQuantity,
    OrderCount,
    SalesSummary,
    TotalOrdersCount,
} from "@/types/analytics"

export interface DashboardHomeContextProps {
    dateFilter: DateFilter
    setDateFilter: (filter: DateFilter) => void
    shiftFilter: ShiftFilter
    setShiftFilter: (filter: ShiftFilter) => void
    itemsTimeRange: ItemsTimeRange
    setItemsTimeRange: (range: ItemsTimeRange) => void
    salesSummary?: SalesSummary
    invoiceSummary?: InvoiceCount
    ordersSummary?: OrderCount
    cancelledOrdersSummary?: CancelledCount
    topItemsSummary?: ItemOrderQuantity[]
    sessionDurationSummary?: AverageSessionDuration
    activeSessionsSummary?: ActiveSessionCount
    lastSevenDaysOrdersCount?: TotalOrdersCount[]
    insights: Insight[]
    handleExportCSV: () => Promise<void>
    handleExportPDF: () => Promise<void>
    isExporting: boolean
}

export const DashboardHomeContext = createContext<DashboardHomeContextProps | undefined>(undefined)

export function useDashboardHomeContext() {
    const context = useContext(DashboardHomeContext)
    if (!context) throw new Error("useDashboardHomeContext must be used within the DashboardHomeContext.Provider")
    return context
}
