import React, {JSX} from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    TrendingUp,
    TrendingDown,
    Receipt,
    Users,
    Clock,
    AlertTriangle,
    Download,
    FileText,
    Lightbulb,
    ChefHat,
    DollarSign,
    ShoppingCart,
    Calendar,
    Filter,
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
    MetricFormat,
} from "@/types/dashboard"
import {downloadCSV, downloadPDF} from "@/lib/helpers/export";
import {toast} from "sonner";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
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


// Dados mockados com tipos
const salesData: SalesData = {
    totalSales: 15420.5,
    invoiceCount: 127,
    averageInvoice: 121.42,
    distinctTables: 45,
    revenuePerTable: 342.68,
    salesGrowth: 12.5,
    invoiceGrowth: 8.3,
    averageGrowth: 3.8,
    tableGrowth: -2.1,
    revenueGrowth: 15.2,
}

const ordersData: OrdersData = {
    orderCount: 156,
    cancelledCount: 23,
    cancelledRate: 14.7,
    ordersGrowth: 5.2,
    cancelledGrowth: -8.1,
}

const sessionsData: SessionsData = {
    averageDurationMinutes: 47,
    activeSessions: 12,
    durationGrowth: 6.8,
    activeGrowth: 25.0,
}

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

const dailySales: DailySales[] = [
    { date: "2024-01-20", sales: 1200, day: "Seg" },
    { date: "2024-01-21", sales: 1800, day: "Ter" },
    { date: "2024-01-22", sales: 1600, day: "Qua" },
    { date: "2024-01-23", sales: 2100, day: "Qui" },
    { date: "2024-01-24", sales: 1900, day: "Sex" },
    { date: "2024-01-25", sales: 2300, day: "Sáb" },
    { date: "2024-01-26", sales: 2000, day: "Dom" },
]

interface MetricCardProps {
    title: string
    value: number
    growth: number
    icon: React.ComponentType<{ className?: string }>
    format?: MetricFormat
}

export default function RestaurantDashboard(): JSX.Element {
    const [dateFilter, setDateFilter] = useState<DateFilter>("7days")
    const [shiftFilter, setShiftFilter] = useState<ShiftFilter>("all")
    const [itemsTimeRange, setItemsTimeRange] = useState<ItemsTimeRange>("today")
    const [isExporting, setIsExporting] = useState<boolean>(false)

    const {
        restaurant
    } = useDashboardContext()

    // Helper function to get date range from filter
    const getDateRangeFromFilter = useCallback((filter: DateFilter | ItemsTimeRange) => {
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
    }, [])


    console.log(getDateRangeFromFilter(dateFilter).from)
    console.log(getDateRangeFromFilter(dateFilter).to)

    // Analytics hooks
    const { data: salesSummary } = useGetSalesSummary({
        restaurantId: restaurant._id,
        fromDate: getDateRangeFromFilter(dateFilter).from,
        toDate: getDateRangeFromFilter(dateFilter).to
    })

    const { data: invoiceSummary } = useGetInvoiceSummary({
        restaurantId: restaurant._id,
        status: "completed",
        fromDate: getDateRangeFromFilter(dateFilter).from,
        toDate: getDateRangeFromFilter(dateFilter).to
    })

    const { data: ordersSummary } = useGetOrdersSummary({
        restaurantId: restaurant._id,
        fromDate: getDateRangeFromFilter(dateFilter).from,
        toDate: getDateRangeFromFilter(dateFilter).to
    })

    const { data: cancelledOrdersSummary } = useGetCancelledOrdersSummary({
        restaurantId: restaurant._id,
        fromDate: getDateRangeFromFilter(dateFilter).from,
        toDate: getDateRangeFromFilter(dateFilter).to
    })

    const { data: topItemsSummary } = useGetTopItemsSummary({
        restaurantId: restaurant._id,
        topN: 8,
        fromDate: getDateRangeFromFilter(itemsTimeRange).from,
        toDate: getDateRangeFromFilter(itemsTimeRange).to
    })

    console.log("TOP:", topItemsSummary)


    const { data: sessionDurationSummary } = useGetSessionDurationSummary({
        restaurantId: restaurant._id
    })

    const { data: activeSessionsSummary } = useGetActiveSessionsSummary({
        restaurantId: restaurant._id
    })

    const { data: lastSevenDaysOrdersCount } = useGetLastSevenDaysCount({
        restaurantId: restaurant._id,
    })

    const formatValue = useCallback((val: number, format: MetricFormat): string => {
        switch (format) {
            case "currency":
                return `Kz ${val.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`
            case "percentage":
                return `${val.toFixed(1)}%`
            default:
                return val.toLocaleString("pt-PT")
        }
    }, [])

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
        return {
            salesData,
            ordersData,
            popularItems: topItemsSummary? topItemsSummary: [],
            sessionsData,
            insights,
            dailySales,
            exportDate: new Date().toLocaleDateString("pt-PT"),
            dateFilter: getDateFilterLabel(dateFilter),
            shiftFilter: getShiftFilterLabel(shiftFilter),
        }
    }, [dateFilter, shiftFilter, getDateFilterLabel, getShiftFilterLabel])

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

    const MetricCard = ({ title, value, growth, icon: Icon, format = "currency" }: MetricCardProps): JSX.Element => {
        const isPositive = growth > 0
        const GrowthIcon = isPositive ? TrendingUp : TrendingDown

        return (
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-purple-700" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatValue(value, format)}</div>
                    <div className="flex items-center space-x-1 text-xs">
                        <GrowthIcon className={`h-3 w-3 ${isPositive ? "text-green-500" : "text-red-500"}`} />
                        <span className={isPositive ? "text-green-500" : "text-red-500"}>{Math.abs(growth).toFixed(1)}%</span>
                        <span className="text-muted-foreground">vs. período anterior</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const SalesChart = (): JSX.Element => (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle>Evolução das Vendas</CardTitle>
                <CardDescription>Vendas diárias dos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] flex items-end justify-between space-x-2">
                    {lastSevenDaysOrdersCount && lastSevenDaysOrdersCount.map((data) => (
                        <TooltipProvider key={data.day}>
                            <Tooltip>
                                <TooltipTrigger className="w-full">
                                    <div key={data.date} className="flex flex-col items-center space-y-2 flex-1">
                                        <div
                                            className="bg-primary rounded-t transition-all duration-500 hover:bg-primary/80 w-full"
                                            style={{height: `${(data.sales / Math.max(...dailySales.map((d) => d.sales))) * 160}px`}}
                                        />
                                        <span className="text-xs text-muted-foreground">{data.day}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span>
                                        {data.sales} pedidos
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    ))}
                </div>
            </CardContent>
        </Card>
    )

    const OrdersChart = (): JSX.Element => {
        const totalOrders = ordersSummary?.orderCount ?? 0
        const cancelledOrders = cancelledOrdersSummary?.cancelledCount ?? 0
        const completedOrders = totalOrders - cancelledOrders
        const cancelledRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pedidos vs Cancelamentos</CardTitle>
                    <CardDescription>Comparação de pedidos realizados e cancelados</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Pedidos Realizados</span>
                            <span className="font-medium">{completedOrders}</span>
                        </div>
                        <Progress
                            value={(completedOrders / totalOrders) * 100}
                            className="h-2"
                        />

                        <div className="flex items-center justify-between">
                            <span className="text-sm">Pedidos Cancelados</span>
                            <span className="font-medium">{cancelledOrders}</span>
                        </div>
                        <Progress value={(cancelledOrders / totalOrders) * 100} className="h-2" />

                        <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm font-medium">Taxa de Cancelamento</span>
                            <Badge variant={cancelledRate > 15 ? "destructive" : "secondary"}>
                                {cancelledRate.toFixed(1)}%
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const PopularItemsChart = (): JSX.Element => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>
                        Itens Mais Populares
                    </CardTitle>
                    <CardDescription>
                        Pratos mais vendidos
                    </CardDescription>
                </div>
                <Select value={itemsTimeRange} onValueChange={(value: ItemsTimeRange) => setItemsTimeRange(value)}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Hoje</SelectItem>
                        <SelectItem value="week">7 dias</SelectItem>
                        <SelectItem value="month">30 dias</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {/* TODO: Need to update the API to return an array of items */}
                    {topItemsSummary && topItemsSummary.map((item, index) => (
                        <div key={`${item.itemName}-${index}`} className="flex items-center space-x-3">
                            <div className="w-8 text-sm font-medium text-muted-foreground">#{index + 1}</div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{item.itemName}</span>
                                    <span className="text-sm text-muted-foreground">{item.quantity}</span>
                                </div>
                                <Progress 
                                    value={(item.quantity / topItemsSummary[0].quantity) * 100}
                                    className="h-1"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )

    const SessionsCard = (): JSX.Element => (
        <Card>
            <CardHeader>
                <CardTitle>Sessões de Cliente</CardTitle>
                <CardDescription>Duração e atividade das sessões</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Duração Média</span>
                    </div>
                    <div className="text-right">
                        <div className="font-medium">{sessionDurationSummary?.averageDurationMinutes ?? 0} min</div>
                        <div className="flex items-center text-xs text-green-500">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {/* TODO: Need growth data */}
                            0%
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Mesas ocupadas</span>
                    </div>
                    <div className="text-right">
                        <div className="font-medium">{activeSessionsSummary?.activeSessions ?? 0}</div>
                        <div className="hidden items-center text-xs text-green-500">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {/* TODO: Need growth data */}
                            0%
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="text-xs text-muted-foreground mb-2">Distribuição de Duração</div>
                    <div className="flex space-x-1 h-16 items-end">
                        {/* TODO: Need session duration distribution data */}
                        {[20, 35, 45, 60, 40, 25, 15].map((height, index) => (
                            <div
                                key={`duration-${index}`}
                                className="bg-primary/20 rounded-t flex-1 transition-all duration-300 hover:bg-primary/40"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0-30m</span>
                        <span>30-60m</span>
                        <span>60m+</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const InsightsCard = (): JSX.Element => (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5" />
                    <span>Insights com IA</span>
                </CardTitle>
                <CardDescription>Sugestões automatizadas baseadas nos seus dados</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    {insights.map((insight, index) => {
                        const Icon = insight.icon
                        const bgColor =
                            insight.type === "positive"
                                ? "bg-green-50 border-green-200"
                                : insight.type === "warning"
                                    ? "bg-yellow-50 border-yellow-200"
                                    : "bg-blue-50 border-blue-200"
                        const iconColor =
                            insight.type === "positive"
                                ? "text-green-600"
                                : insight.type === "warning"
                                    ? "text-yellow-600"
                                    : "text-blue-600"

                        return (
                            <div
                                key={`insight-${index}`}
                                className={`rounded-lg p-2 border transition-all duration-300 hover:shadow-md ${bgColor}`}
                            >
                                <div className="flex items-start space-x-3">
                                    <Icon className={`h-4 w-4 min-h-4 min-w-4 mt-0.5 ${iconColor}`} />
                                    <p className="text-sm leading-relaxed">{insight.message}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )

    if (restaurant._id == "notfound"){
        return <WelcomePage/>
    }

    return (
        <div className="">
            <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <Select value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
                            <SelectTrigger className="w-full sm:w-48">
                                <Calendar className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Hoje</SelectItem>
                                <SelectItem value="yesterday">Ontem</SelectItem>
                                <SelectItem value="7days">Últimos 7 dias</SelectItem>
                                <SelectItem value="30days">Últimos 30 dias</SelectItem>
                                {/*<SelectItem value="custom">Intervalo personalizado</SelectItem>*/}
                            </SelectContent>
                        </Select>

                        <Select value={shiftFilter} onValueChange={(value: ShiftFilter) => setShiftFilter(value)}>
                            <SelectTrigger className="w-full sm:w-32">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="lunch">Almoço</SelectItem>
                                <SelectItem value="dinner">Jantar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Métricas Principais */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <MetricCard
                        title="Total de Vendas"
                        value={salesSummary?.totalSales ?? 0}
                        growth={0}
                        icon={DollarSign}
                        format="currency"
                    />
                    <MetricCard
                        title="Faturas Emitidas"
                        value={invoiceSummary?.invoiceCount ?? 0}
                        growth={0}
                        icon={Receipt}
                        format="number"
                    />
                    <MetricCard
                        title="Valor Médio por Fatura"
                        value={salesSummary?.averageInvoice ?? 0}
                        growth={0}
                        icon={ShoppingCart}
                        format="currency"
                    />
                    <MetricCard
                        title="Mesas Servidas"
                        value={salesSummary?.distinctTables ?? 0}
                        growth={0}
                        icon={Users}
                        format="number"
                    />
                    <MetricCard
                        title="Receita por Mesa"
                        value={salesSummary?.revenuePerTable ?? 0}
                        growth={0}
                        icon={TrendingUp}
                        format="currency"
                    />
                </div>

                {/* Gráficos e Análises */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <SalesChart />
                    <OrdersChart />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <PopularItemsChart />
                    <SessionsCard />
                </div>

                {/* Insights */}
                <InsightsCard />

                {/* Botões de Exportação */}
                <Card>
                    <CardHeader>
                        <CardTitle>Exportar Dados</CardTitle>
                        <CardDescription>Descarregue os dados do dashboard em diferentes formatos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <Button
                                className="flex items-center space-x-2"
                                onClick={handleExportCSV}
                                disabled={isExporting}
                            >
                                <Download className="h-4 w-4" />
                                <span>{isExporting ? "A exportar..." : "Exportar CSV"}</span>
                            </Button>
                            <Button
                                className="flex items-center space-x-2"
                                onClick={handleExportPDF}
                                disabled={isExporting}
                            >
                                <FileText className="h-4 w-4" />
                                <span>{isExporting ? "A exportar..." : "Exportar PDF"}</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
