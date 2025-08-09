import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Info, TrendingUp, Users, ChefHat } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { PerformanceInsightResponse, OccupancyInsightResponse, ItemsInsightResponse } from "@/types/insights"

interface InsightsCardProps {
    performance?: PerformanceInsightResponse
    occupancy?: OccupancyInsightResponse
    items?: ItemsInsightResponse
}

export default function InsightsCard({ performance, occupancy, items }: InsightsCardProps) {
    const cards = [
        { title: "Desempenho", insight: performance?.insight, icon: TrendingUp },
        { title: "Ocupação", insight: occupancy?.insight, icon: Users },
        { title: "Itens", insight: items?.insight, icon: ChefHat },
    ]

    return (
        <section className="space-y-4">
            <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span className="text-lg font-semibold">Insights com IA</span>
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
                {cards.map(({ title, insight, icon: Icon }, index) => (
                    <Card key={`insight-${index}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Icon className="h-4 w-4" />
                                <span>{title}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed">{insight || "Sem dados disponíveis."}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}
