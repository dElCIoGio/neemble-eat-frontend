import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { useDashboardHomeContext } from "@/context/dashboard-home-context"
import { ItemsTimeRange } from "@/types/dashboard"

export default function PopularItemsChart() {
    const {
        topItemsSummary,
        itemsTimeRange,
        setItemsTimeRange,
        isTopItemsSummaryLoading,
    } = useDashboardHomeContext()

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center space-x-1">
                        <span>Itens Mais Populares</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="cursor-default">
                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>Pratos mais vendidos</TooltipContent>
                        </Tooltip>
                    </CardTitle>
                    <CardDescription>Pratos mais vendidos</CardDescription>
                </div>
                <Select value={itemsTimeRange} onValueChange={(v: ItemsTimeRange) => setItemsTimeRange(v)}>
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
                {isTopItemsSummaryLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <span className="text-sm text-muted-foreground">A carregar...</span>
                    </div>
                ) : !topItemsSummary || topItemsSummary.length === 0 ? (
                    <div className="flex items-center justify-center h-40">
                        <span className="text-sm text-muted-foreground">Sem dados disponíveis</span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {topItemsSummary.map((item, index) => (
                            <div key={`${item.itemName}-${index}`} className="flex items-center space-x-3">
                                <div className="w-8 text-sm font-medium text-muted-foreground">#{index + 1}</div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{item.itemName}</span>
                                        <span className="text-sm text-muted-foreground">{item.quantity}</span>
                                    </div>
                                    <Progress value={(item.quantity / topItemsSummary[0].quantity) * 100} className="h-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
