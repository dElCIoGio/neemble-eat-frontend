import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useDashboardHomeContext } from "@/context/dashboard-home-context"
import { ItemsTimeRange } from "@/types/dashboard"

export default function PopularItemsChart() {
    const { topItemsSummary, itemsTimeRange, setItemsTimeRange } = useDashboardHomeContext()

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Itens Mais Populares</CardTitle>
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
                                <Progress value={(item.quantity / topItemsSummary[0].quantity) * 100} className="h-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
