import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useDashboardHomeContext } from "@/context/dashboard-home-context"

export default function OrdersChart() {
    const {
        ordersSummary,
        cancelledOrdersSummary,
        isOrdersSummaryLoading,
        isCancelledOrdersSummaryLoading,
    } = useDashboardHomeContext()

    const totalOrders = ordersSummary?.orderCount ?? 0
    const cancelledOrders = cancelledOrdersSummary?.cancelledCount ?? 0
    const completedOrders = totalOrders - cancelledOrders
    const cancelledRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0

    const isLoading = isOrdersSummaryLoading || isCancelledOrdersSummaryLoading

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pedidos vs Cancelamentos</CardTitle>
                <CardDescription>Comparação de pedidos realizados e cancelados</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <span className="text-sm text-muted-foreground">A carregar...</span>
                    </div>
                ) : totalOrders === 0 ? (
                    <div className="flex items-center justify-center h-40">
                        <span className="text-sm text-muted-foreground">Sem dados disponíveis</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Pedidos Realizados</span>
                            <span className="font-medium">{completedOrders}</span>
                        </div>
                        <Progress value={(completedOrders / totalOrders) * 100} className="h-2" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Pedidos Cancelados</span>
                            <span className="font-medium">{cancelledOrders}</span>
                        </div>
                        <Progress value={(cancelledOrders / totalOrders) * 100} className="h-2" />
                        <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm font-medium">Taxa de Cancelamento</span>
                            <Badge variant={cancelledRate > 15 ? "destructive" : "secondary"}>{cancelledRate.toFixed(1)}%</Badge>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
