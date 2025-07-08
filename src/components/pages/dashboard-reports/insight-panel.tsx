
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, BarChart3 } from "lucide-react"
import {SalesSummary} from "@/types/analytics";

interface InsightPanelProps {
    data: SalesSummary
}

export function InsightPanel({ data }: InsightPanelProps) {
    const insights = [
        {
            title: "Receita Total",
            value: `$${data.totalSales.toLocaleString()}`,
            growth: data.totalSalesGrowth,
            icon: DollarSign,
        },
        {
            title: "Total de Pedidos",
            value: data.invoiceCount.toLocaleString(),
            growth: data.invoiceCountGrowth,
            icon: ShoppingCart,
        },
        {
            title: "Média por Pedido",
            value: `$${data.averageInvoice? data.averageInvoice.toFixed(2): 0}`,
            growth: data.averageInvoiceGrowth,
            icon: BarChart3,
        },
        {
            title: "Mesas Ativas",
            value: data.distinctTables.toString(),
            growth: data.distinctTablesGrowth,
            icon: Users,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {insights.map((insight) => {
                const Icon = insight.icon
                const isPositive = insight.growth >= 0
                const TrendIcon = isPositive ? TrendingUp : TrendingDown

                return (
                    <Card key={insight.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{insight.value}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <TrendIcon className={`mr-1 h-3 w-3 ${isPositive ? "text-green-500" : "text-red-500"}`} />
                                <span className={isPositive ? "text-green-500" : "text-red-500"}>
                  {isPositive ? "+" : ""}
                                    {insight.growth? insight.growth.toFixed(1): 0}%
                </span>
                                <span className="ml-1">em relação ao período anterior</span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
