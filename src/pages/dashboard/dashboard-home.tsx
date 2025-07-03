import {JSX} from "react"

import { useState, useCallback, useMemo } from "react"
import {
    DollarSign,
    Receipt,
    ShoppingCart,
    Users,
    TrendingUp,
    AlertTriangle,
    ChefHat,
} from "lucide-react"

import type {
    SalesData,
    OrdersData,
    SessionsData,
    Insight,
    DailySales,
    ExportData,
    DateFilter,
    ShiftFilter,
    ItemsTimeRange,
} from "@/types/dashboard"
import {downloadCSV, downloadPDF} from "@/lib/helpers/export";
import {toast} from "sonner";
import {useDashboardContext} from "@/context/dashboard-context";
import {
    useGetSalesSummary,
    useGetInvoiceSummary,
    useGetOrdersSummary,
    useGetCancelledOrdersSummary,
    useGetTopItemsSummary,
    useGetSessionDurationSummary,
    useGetActiveSessionsSummary, useGetLastSevenDaysCount
} from "@/api/endpoints/analytics/hooks";
import WelcomePage from "@/components/layout/dashboard/components/welcome";
import {DashboardHomeContext} from "@/context/dashboard-home-context";
import DashboardHomeHeader from "@/components/pages/dashboard-home/header";
import MetricCard from "@/components/pages/dashboard-home/metric-card";
import SalesChart from "@/components/pages/dashboard-home/sales-chart";
import OrdersChart from "@/components/pages/dashboard-home/orders-chart";
import PopularItemsChart from "@/components/pages/dashboard-home/popular-items-chart";
import SessionsCard from "@/components/pages/dashboard-home/sessions-card";
import InsightsCard from "@/components/pages/dashboard-home/insights-card";
import ExportButtons from "@/components/pages/dashboard-home/export-buttons";



const insights: Insight[] = [
    {
        type: "positive",
        message: "As vendas aumentaram 12% esta semana comparando com a anterior.",
        icon: TrendingUp,
    },
    {
        type: "warning",
        message: "A taxa de cancelamento ultrapassou 15%, pode ser um sinal de problemas operacionais.",
        icon: AlertTriangle,
    },
    {
        type: "info",
        message: "A Francesinha Especial continua a ser o prato mais popular do restaurante.",
        icon: ChefHat,
    },
]


export default function RestaurantDashboard(): JSX.Element {
    const [dateFilter, setDateFilter] = useState<DateFilter>("7days")
    const [shiftFilter, setShiftFilter] = useState<ShiftFilter>("all")
    const [itemsTimeRange, setItemsTimeRange] = useState<ItemsTimeRange>("today")
    const [isExporting, setIsExporting] = useState<boolean>(false)

    const {
        restaurant
    } = useDashboardContext()

    // Helper function to get date range from filter
    const getDateRangeFromFilter = (filter: DateFilter | ItemsTimeRange) => {
        const today = new Date()
        const from = new Date()

        switch (filter) {
            case "today":
                from.setHours(0, 0, 0, 0)
                break
            case "yesterday":
                from.setDate(today.getDate() - 2)
                from.setHours(0, 0, 0, 0)
                today.setDate(today.getDate() - 2)
                today.setHours(23, 59, 59, 999)
                break
            case "7days":
            case "week":
                from.setDate(today.getDate() - 7)
                break
            case "30days":
            case "month":
                from.setDate(today.getDate() - 30)
                break
        }

        return {
            from: from.toISOString(),
            to: today.toISOString()
        }
    }

    const dateRange = useMemo(() => getDateRangeFromFilter(dateFilter), [dateFilter])
    const itemsDateRange = useMemo(() => getDateRangeFromFilter(itemsTimeRange), [itemsTimeRange])


    // Analytics hooks
    const { data: salesSummary, isLoading: isSalesSummaryLoading } = useGetSalesSummary({
        restaurantId: restaurant._id,
        fromDate: dateRange.from,
        toDate: dateRange.to
    })

    console.log(salesSummary)

    const { data: invoiceSummary, isLoading: isInvoiceSummaryLoading } = useGetInvoiceSummary({
        restaurantId: restaurant._id,
        status: "completed",
        fromDate: dateRange.from,
        toDate: dateRange.to
    })

    const { data: ordersSummary, isLoading: isOrdersSummaryLoading } = useGetOrdersSummary({
        restaurantId: restaurant._id,
        fromDate: dateRange.from,
        toDate: dateRange.to
    })

    const { data: cancelledOrdersSummary, isLoading: isCancelledOrdersSummaryLoading } = useGetCancelledOrdersSummary({
        restaurantId: restaurant._id,
        fromDate: dateRange.from,
        toDate: dateRange.to
    })

    const { data: topItemsSummary, isLoading: isTopItemsSummaryLoading } = useGetTopItemsSummary({
        restaurantId: restaurant._id,
        topN: 8,
        fromDate: itemsDateRange.from,
        toDate: itemsDateRange.to
    })


    const { data: sessionDurationSummary, isLoading: isSessionDurationSummaryLoading } = useGetSessionDurationSummary({
        restaurantId: restaurant._id
    })

    const { data: activeSessionsSummary, isLoading: isActiveSessionsSummaryLoading } = useGetActiveSessionsSummary({
        restaurantId: restaurant._id
    })

    const { data: lastSevenDaysOrdersCount, isLoading: isLastSevenDaysOrdersCountLoading } = useGetLastSevenDaysCount({
        restaurantId: restaurant._id,
    })

    const getDateFilterLabel = useCallback((filter: DateFilter): string => {
        const labels: Record<DateFilter, string> = {
            today: "Hoje",
            yesterday: "Ontem",
            "7days": "Últimos 7 dias",
            "30days": "Últimos 30 dias",
        }
        return labels[filter]
    }, [])

    const getShiftFilterLabel = useCallback((filter: ShiftFilter): string => {
        const labels: Record<ShiftFilter, string> = {
            all: "Todos os turnos",
            lunch: "Almoço",
            dinner: "Jantar",
        }
        return labels[filter]
    }, [])

    const prepareExportData = useCallback((): ExportData => {
        const salesData: SalesData = {
            totalSales: salesSummary?.totalSales ?? 0,
            invoiceCount: invoiceSummary?.invoiceCount ?? 0,
            averageInvoice: salesSummary?.averageInvoice ?? 0,
            distinctTables: salesSummary?.distinctTables ?? 0,
            revenuePerTable: salesSummary?.revenuePerTable ?? 0,
            salesGrowth: salesSummary?.totalSalesGrowth ?? 0,
            invoiceGrowth: salesSummary?.invoiceCountGrowth ?? 0,
            averageGrowth: salesSummary?.averageInvoiceGrowth ?? 0,
            tableGrowth: salesSummary?.distinctTablesGrowth ?? 0,
            revenueGrowth: salesSummary?.revenuePerTableGrowth ?? 0,
        }

        const ordersData: OrdersData = {
            orderCount: ordersSummary?.orderCount ?? 0,
            cancelledCount: cancelledOrdersSummary?.cancelledCount ?? 0,
            cancelledRate:
                ordersSummary && cancelledOrdersSummary && ordersSummary.orderCount > 0
                    ? (cancelledOrdersSummary.cancelledCount / ordersSummary.orderCount) * 100
                    : 0,
            ordersGrowth: 0,
            cancelledGrowth: 0,
        }

        const sessionsData: SessionsData = {
            averageDurationMinutes: sessionDurationSummary?.averageDurationMinutes ?? 0,
            activeSessions: activeSessionsSummary?.activeSessions ?? 0,
            durationGrowth: 0,
            activeGrowth: 0,
        }

        const dailySalesData: DailySales[] = lastSevenDaysOrdersCount ?? []

        return {
            salesData,
            ordersData,
            popularItems: topItemsSummary ? topItemsSummary : [],
            sessionsData,
            insights: [],
            dailySales: dailySalesData,
            exportDate: new Date().toLocaleString("pt-PT"),
            dateFilter: getDateFilterLabel(dateFilter),
            shiftFilter: getShiftFilterLabel(shiftFilter),
        }
    }, [salesSummary, invoiceSummary, ordersSummary, cancelledOrdersSummary, topItemsSummary, sessionDurationSummary, activeSessionsSummary, lastSevenDaysOrdersCount, dateFilter, shiftFilter, getDateFilterLabel, getShiftFilterLabel])

    const handleExportCSV = useCallback(async (): Promise<void> => {
        try {
            setIsExporting(true)
            const exportData = prepareExportData()
            downloadCSV(exportData)

            toast.success("Exportação concluída", {
                description: "Os dados foram exportados para CSV com sucesso.",
            })
        } catch {
            toast.error("Erro na exportação", {
                description: "Ocorreu um erro ao exportar os dados para CSV.",
            })
        } finally {
            setIsExporting(false)
        }
    }, [prepareExportData, toast])

    const handleExportPDF = useCallback(async (): Promise<void> => {
        try {
            setIsExporting(true)
            const exportData = prepareExportData()
            downloadPDF(exportData)

            toast.success("Exportação concluída", {
                description: "Os dados foram exportados para PDF com sucesso.",
            })
        } catch  {
            toast.error("Erro na exportação", {
                description: "Ocorreu um erro ao exportar os dados para PDF.",
            })
        } finally {
            setIsExporting(false)
        }
    }, [prepareExportData, toast])


    if (restaurant._id == "notfound"){
        return <WelcomePage/>
    }

    return (
        <DashboardHomeContext.Provider value={{
            dateFilter,
            setDateFilter,
            shiftFilter,
            setShiftFilter,
            itemsTimeRange,
            setItemsTimeRange,
            salesSummary,
            invoiceSummary,
            ordersSummary,
            cancelledOrdersSummary,
            topItemsSummary,
            sessionDurationSummary,
            activeSessionsSummary,
            lastSevenDaysOrdersCount,
            isSalesSummaryLoading,
            isInvoiceSummaryLoading,
            isOrdersSummaryLoading,
            isCancelledOrdersSummaryLoading,
            isTopItemsSummaryLoading,
            isSessionDurationSummaryLoading,
            isActiveSessionsSummaryLoading,
            isLastSevenDaysOrdersCountLoading,
            insights,
            handleExportCSV,
            handleExportPDF,
            isExporting,
        }}>
            <div className="">
                <div className="mx-auto space-y-6">
                    <DashboardHomeHeader />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <MetricCard
                            title="Total de Vendas"
                            value={salesSummary?.totalSales}
                            growth={salesSummary?.totalSalesGrowth ?? 0}
                            icon={DollarSign}
                            format="currency"
                            isLoading={isSalesSummaryLoading}
                        />
                        <MetricCard
                            title="Faturas Emitidas"
                            value={invoiceSummary?.invoiceCount}
                            growth={salesSummary?.invoiceCountGrowth ?? 0}
                            icon={Receipt}
                            format="number"
                            isLoading={isInvoiceSummaryLoading}
                        />
                        <MetricCard
                            title="Valor Médio por Fatura"
                            value={salesSummary?.averageInvoice}
                            growth={salesSummary?.averageInvoiceGrowth ?? 0}
                            icon={ShoppingCart}
                            format="currency"
                            isLoading={isSalesSummaryLoading}
                        />
                        <MetricCard
                            title="Mesas Servidas"
                            value={salesSummary?.distinctTables}
                            growth={salesSummary?.distinctTablesGrowth ?? 0}
                            icon={Users}
                            format="number"
                            isLoading={isSalesSummaryLoading}
                        />
                        <MetricCard
                            title="Receita por Mesa"
                            value={salesSummary?.revenuePerTable}
                            growth={salesSummary?.revenuePerTableGrowth ?? 0}
                            icon={TrendingUp}
                            format="currency"
                            isLoading={isSalesSummaryLoading}
                        />
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <SalesChart />
                        <OrdersChart />
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <PopularItemsChart />
                        <SessionsCard />
                    </div>
                    <InsightsCard />
                    <ExportButtons />
                </div>
            </div>
        </DashboardHomeContext.Provider>

    )
}
