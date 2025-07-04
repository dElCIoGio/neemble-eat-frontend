import { createContext, useContext } from "react"
import { DateFilter, ItemsTimeRange, ShiftFilter, Insight } from "@/types/dashboard"
import type { DateRange } from "react-day-picker"
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
    customDateRange: DateRange | undefined
    setCustomDateRange: (range: DateRange | undefined) => void
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
    isSalesSummaryLoading: boolean
    isInvoiceSummaryLoading: boolean
    isOrdersSummaryLoading: boolean
    isCancelledOrdersSummaryLoading: boolean
    isTopItemsSummaryLoading: boolean
    isSessionDurationSummaryLoading: boolean
    isActiveSessionsSummaryLoading: boolean
    isLastSevenDaysOrdersCountLoading: boolean
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
