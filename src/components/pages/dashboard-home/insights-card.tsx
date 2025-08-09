import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Info, TrendingUp, Users, ChefHat } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type {
    PerformanceInsightResponse,
    OccupancyInsightResponse,
    ItemsInsightResponse,
} from "@/types/insights"
import { formatCurrency } from "@/utils/format-currency"

interface InsightsCardProps {
    performance?: PerformanceInsightResponse
    occupancy?: OccupancyInsightResponse
    items?: ItemsInsightResponse
}

interface InsightCardItemProps {
    title: string
    insight?: string
    icon: React.ComponentType<{ className?: string }>
    metrics?: Record<string, string>
}

function InsightCardItem({ title, insight, icon: Icon, metrics }: InsightCardItemProps) {
    const [expanded, setExpanded] = useState(false)

    return (
        <Card className="bg-zinc-100 py-0 flex flex-col">
            <Card className="border-none border-b flex-1 my-0 shadow-sm space-x-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-purple-700" />
                </CardHeader>
                <CardContent>
                    <p className={`text-sm leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
                        {insight || "Sem dados disponíveis."}
                    </p>
                    {expanded && metrics && (
                        <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                            {Object.entries(metrics).map(([key, value]) => (
                                <li key={key} className="flex justify-between">
                                    <span className="font-medium">{key}</span>
                                    <span>{value}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
            <div className="px-2 mb-2 -mt-4 flex items-start">
                <button
                    type="button"
                    onClick={() => setExpanded((prev) => !prev)}
                    className="text-xs text-purple-700 hover:underline"
                >
                    {expanded ? "Mostrar menos" : "Ver mais"}
                </button>
            </div>
        </Card>
    )
}

export default function InsightsCard({ performance, occupancy, items }: InsightsCardProps) {
    const cards: InsightCardItemProps[] = [
        {
            title: "Desempenho",
            insight: performance?.insight,
            icon: TrendingUp,
            metrics: performance?.metrics
                ? {
                      Pedidos: performance.metrics.totalOrders.toString(),
                      Receita: formatCurrency(performance.metrics.totalRevenue),
                  }
                : undefined,
        },
        {
            title: "Ocupação",
            insight: occupancy?.insight,
            icon: Users,
            metrics: occupancy?.metrics
                ? {
                      "Taxa média": `${occupancy.metrics.avgOccupancyRate.toFixed(1)}%`,
                      "Horas de pico": occupancy.metrics.peakHours
                          ? occupancy.metrics.peakHours.join(", ")
                          : "-",
                  }
                : undefined,
        },
        {
            title: "Itens",
            insight: items?.insight,
            icon: ChefHat,
            metrics: items?.metrics
                ? {
                      "Mais pedido": items.metrics.mostOrdered?.[0]?.item ?? "-",
                      "Pedidos": items.metrics.mostOrdered?.[0]?.orders?.toString() ?? "-",
                  }
                : undefined,
        },
    ]

    return (
        <section className="space-y-4">
            <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span className="text-lg font-semibold">Neemble AI</span>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-default">
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>Sugestões automatizadas baseadas nos seus dados</TooltipContent>
                </Tooltip>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {cards.map((card, index) => (
                    <InsightCardItem key={`insight-${index}`} {...card} />
                ))}
            </div>
        </section>
    )
}
