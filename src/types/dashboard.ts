import {Icon} from "@phosphor-icons/react";

export interface SalesData {
    totalSales: number
    invoiceCount: number
    averageInvoice: number
    distinctTables: number
    revenuePerTable: number
    salesGrowth: number
    invoiceGrowth: number
    averageGrowth: number
    tableGrowth: number
    revenueGrowth: number
}

export interface OrdersData {
    orderCount: number
    cancelledCount: number
    cancelledRate: number
    ordersGrowth: number
    cancelledGrowth: number
}

export interface PopularItem {
    itemName: string
    quantity: number
}

export interface SessionsData {
    averageDurationMinutes: number
    activeSessions: number
    durationGrowth: number
    activeGrowth: number
}

export interface Insight {
    type: "positive" | "warning" | "info"
    message: string
    icon: Icon
}

export interface DailySales {
    date: string
    sales: number
    day: string
}

export interface ExportData {
    salesData: SalesData
    ordersData: OrdersData
    popularItems: PopularItem[]
    sessionsData: SessionsData
    insights: Insight[]
    dailySales: DailySales[]
    exportDate: string
    dateFilter: string
    shiftFilter: string
}

export type DateFilter = "today" | "yesterday" | "7days" | "30days" | "custom"
export type ShiftFilter = "all" | "lunch" | "dinner"
export type ItemsTimeRange = "today" | "week" | "month"
export type MetricFormat = "currency" | "number" | "percentage"
export type InsightType = "positive" | "warning" | "info"
