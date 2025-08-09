import { JSX } from "react"

import { useState, useCallback, useMemo } from "react"
import type { DateRange } from "react-day-picker"
import {
    DollarSign,
    Receipt,
    ShoppingCart,
    Users,
    TrendingUp,
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
import { now, startOfDay, endOfDay, subtract, toISO, toDateTime, formatLocaleString } from "@/utils/time";
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
import { useGetPerformanceInsights, useGetOccupancyInsights, useGetItemsInsights } from "@/api/endpoints/insights/hooks";
import WelcomePage from "@/components/layout/dashboard/components/welcome";
import {DashboardHomeContext} from "@/context/dashboard-home-context";
import DashboardHomeHeader from "@/components/pages/dashboard-home/header";
import WelcomeBanner from "@/components/pages/dashboard-home/welcome-banner";
import MetricCard from "@/components/pages/dashboard-home/metric-card";
import SalesChart from "@/components/pages/dashboard-home/sales-chart";
import OrdersChart from "@/components/pages/dashboard-home/orders-chart";
import PopularItemsChart from "@/components/pages/dashboard-home/popular-items-chart";
import SessionsCard from "@/components/pages/dashboard-home/sessions-card";
import InsightsCard from "@/components/pages/dashboard-home/insights-card";
import ExportButtons from "@/components/pages/dashboard-home/export-buttons";


export default function RestaurantDashboard(): JSX.Element {
    const [dateFilter, setDateFilter] = useState<DateFilter>("7days")
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined)
    const [shiftFilter, setShiftFilter] = useState<ShiftFilter>("all")
    const [itemsTimeRange, setItemsTimeRange] = useState<ItemsTimeRange>("today")
    const [isExporting, setIsExporting] = useState<boolean>(false)

    const {
        restaurant
    } = useDashboardContext()

    // Helper function to get date range from filter
    const getDateRangeFromFilter = (
        filter: DateFilter | ItemsTimeRange,
        custom?: DateRange
    ) => {
        let from = now();
        let to: ReturnType<typeof now> | undefined;

        switch (filter) {
            case "today":
                from = startOfDay(from);
                break;

            case "yesterday":
                from = startOfDay(subtract(from, 1, "days"));
                to = endOfDay(from);
                break;

            case "7days":
            case "week":
                // Keep the same time as 'now', but move back 7 days
                from = subtract(from, 7, "days");
                break;

            case "30days":
            case "month":
                // Keep the same time as 'now', but move back 30 days
                from = subtract(from, 30, "days");
                break;

            case "custom":
                if (custom?.from) {
                    console.log("date as Date:", custom.from);
                    from = toDateTime(custom.from);
                    console.log("After conversion:", from)
                }
                if (custom?.to) to = toDateTime(custom.to);

                break;
        }

        return {
            from: toISO(from)!,
            to: to ? toISO(to)! : undefined
        };
    };

    const dateRange = useMemo(
        () => getDateRangeFromFilter(dateFilter, customDateRange),
        [dateFilter, customDateRange]
    )
    const itemsDateRange = useMemo(() => getDateRangeFromFilter(itemsTimeRange), [itemsTimeRange])

    // const insightsDays = useMemo(() => {
    //     switch (dateFilter) {
    //     case "today":
    //     case "yesterday":
    //         return 1
    //     case "30days":
    //         return 30
    //     case "7days":
    //         return 7
    //     case "custom":
    //         if (customDateRange?.from && customDateRange?.to) {
    //             return Math.max(1, Math.ceil(difference(customDateRange.from, customDateRange.to, "days")) + 1)
    //         }
    //         return 7
    //     default:
    //         return 7
    //     }
    // }, [dateFilter, customDateRange])


    // Analytics hooks
    const { data: salesSummary, isLoading: isSalesSummaryLoading } = useGetSalesSummary({
        restaurantId: restaurant._id,
        fromDate: dateRange.from,
        toDate: dateRange.to
    })

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

    const { data: performanceInsights } = useGetPerformanceInsights({
        restaurantId: restaurant._id,
        days: 3, //insightsDays
    })
    const { data: occupancyInsights } = useGetOccupancyInsights({
        restaurantId: restaurant._id,
        days: 3, //insightsDays
    })
    const { data: itemsInsights } = useGetItemsInsights({
        restaurantId: restaurant._id,
        days: 3, //insightsDays
    })

    const getDateFilterLabel = useCallback((filter: DateFilter): string => {
        const labels: Record<DateFilter, string> = {
            today: "Hoje",
            yesterday: "Ontem",
            "7days": "Últimos 7 dias",
            "30days": "Últimos 30 dias",
            custom: "Personalizado",
        }
        return labels[filter]
    }, [])

    const insights = useMemo<Insight[]>(() => {
        const list: Insight[] = []
        if (performanceInsights?.insight) {
            list.push({ type: "info", message: performanceInsights.insight, icon: TrendingUp })
        }
        if (occupancyInsights?.insight) {
            list.push({ type: "info", message: occupancyInsights.insight, icon: Users })
        }
        if (itemsInsights?.insight) {
            list.push({ type: "info", message: itemsInsights.insight, icon: ChefHat })
        }
        return list
    }, [performanceInsights, occupancyInsights, itemsInsights])

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
            insights,
            dailySales: dailySalesData,
            exportDate: formatLocaleString(now(), "pt-PT"),
            dateFilter: getDateFilterLabel(dateFilter),
            shiftFilter: getShiftFilterLabel(shiftFilter),
        }
    }, [salesSummary, invoiceSummary, ordersSummary, cancelledOrdersSummary, topItemsSummary, sessionDurationSummary, activeSessionsSummary, lastSevenDaysOrdersCount, dateFilter, shiftFilter, getDateFilterLabel, getShiftFilterLabel, insights])

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
    }, [prepareExportData])

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
    }, [prepareExportData])


    if (restaurant._id == "notfound"){
        return <WelcomePage/>
    }

    return (
        <DashboardHomeContext.Provider value={{
            dateFilter,
            setDateFilter,
            customDateRange,
            setCustomDateRange,
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
                    <WelcomeBanner />
                    <DashboardHomeHeader />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            title="Total de Vendas"
                            value={salesSummary?.totalSales}
                            growth={salesSummary?.totalSalesGrowth ?? 0}
                            icon={DollarSign}
                            format="currency"
                            isLoading={isSalesSummaryLoading}
                            info="Somatório das vendas no período selecionado"
                        />
                        <MetricCard
                            title="Faturas Emitidas"
                            value={invoiceSummary?.invoiceCount}
                            growth={salesSummary?.invoiceCountGrowth ?? 0}
                            icon={Receipt}
                            format="number"
                            isLoading={isInvoiceSummaryLoading}
                            info="Número de faturas geradas para os pedidos"
                        />
                        <MetricCard
                            title="Valor Médio por Fatura"
                            value={salesSummary?.averageInvoice}
                            growth={salesSummary?.averageInvoiceGrowth ?? 0}
                            icon={ShoppingCart}
                            format="currency"
                            isLoading={isSalesSummaryLoading}
                            info="Média de valor das faturas emitidas"
                        />
                        <div className="hidden">
                            <MetricCard
                                title="Mesas Servidas"
                                value={salesSummary?.distinctTables}
                                growth={salesSummary?.distinctTablesGrowth ?? 0}
                                icon={Users}
                                format="number"
                                isLoading={isSalesSummaryLoading}
                                info="Quantidade de mesas atendidas"
                            />
                        </div>

                        <MetricCard
                            title="Receita por Mesa"
                            value={salesSummary?.revenuePerTable}
                            growth={salesSummary?.revenuePerTableGrowth ?? 0}
                            icon={TrendingUp}
                            format="currency"
                            isLoading={isSalesSummaryLoading}
                            info="Valor médio obtido por mesa servida"
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
                    <InsightsCard
                        performance={performanceInsights}
                        occupancy={occupancyInsights}
                        items={itemsInsights}
                    />
                    <ExportButtons />
                </div>
            </div>
        </DashboardHomeContext.Provider>

    )
}
