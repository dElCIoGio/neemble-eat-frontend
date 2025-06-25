import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDashboardHomeContext } from "@/context/dashboard-home-context"

export default function SalesChart() {
    const { lastSevenDaysOrdersCount, isLastSevenDaysOrdersCountLoading } = useDashboardHomeContext()

    const dayMap: Record<string, string> = {
        monday: "Seg",
        tuesday: "Ter",
        wednesday: "Qua",
        thursday: "Qui",
        friday: "Sex",
        saturday: "Sáb",
        sunday: "Dom",
    }

    const salesData = lastSevenDaysOrdersCount ?? []
    const maxSales = salesData.length > 0 ? Math.max(...salesData.map(d => d.sales)) : 1

    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader>
                <CardTitle>Evolução das Vendas</CardTitle>
                <CardDescription>Vendas diárias dos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
                {isLastSevenDaysOrdersCountLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <span className="text-sm text-muted-foreground">A carregar...</span>
                    </div>
                ) : salesData.length === 0 ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <span className="text-sm text-muted-foreground">Sem dados disponíveis</span>
                    </div>
                ) : (
                    <div className="h-[200px] flex items-end justify-between space-x-2">
                        {salesData.map(data => (
                            <TooltipProvider key={data.date}>
                                <Tooltip>
                                    <TooltipTrigger className="w-full">
                                        <div className="flex flex-col items-center space-y-2 flex-1">
                                            <div
                                                className="bg-primary rounded-t transition-all duration-500 hover:bg-primary/80 w-full"
                                                style={{ height: `${(data.sales / maxSales) * 160}px` }}
                                            />
                                            <div className="flex flex-col items-center space-y-1">
                                                <span className="text-xs text-muted-foreground">{dayMap[data.day] ?? data.day}</span>
                                                <span className="text-xs text-muted-foreground">{`${data.date.slice(8, 10)}/${data.date.slice(5, 7)}/${data.date.slice(0, 4)}`}</span>
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span>{data.sales} pedidos</span>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
