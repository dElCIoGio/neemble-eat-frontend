import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { useDashboardHomeContext } from "@/context/dashboard-home-context"
import { useIsMobile } from "@/hooks/use-mobile"
import {formatDate, toDateTime} from "@/utils/time"

export default function SalesChart() {
    const { lastSevenDaysOrdersCount, isLastSevenDaysOrdersCountLoading } = useDashboardHomeContext()
    const isMobile = useIsMobile()

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
                <CardTitle className="flex items-center space-x-1 text-balance">
                    <span>Evolução das Vendas</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-default">
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>Vendas diárias dos últimos 7 dias</TooltipContent>
                    </Tooltip>
                </CardTitle>
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
                    isMobile ? (
                        <ul className="space-y-2">
                            {salesData.map(data => (
                                <li key={data.date} className="flex items-center justify-between text-sm">
                                    <span>{dayMap[data.day] ?? data.day} ({formatDate(data.date, "dd/LL")})</span>
                                    <span className="font-medium">{data.sales} pedidos</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="h-[200px] flex items-end justify-between space-x-2">
                            {salesData.map(data => {


                                const date = toDateTime(data.date)
                                const dayOfTheWeek = dayMap[date.weekdayLong? date.weekdayLong.toLowerCase(): "monday"]
                                const formattedDate = date.toFormat("dd/LL/yyyy")

                                return (
                                    <TooltipProvider key={data.date}>
                                        <Tooltip>
                                            <TooltipTrigger className="w-full">
                                                <div className="flex flex-col items-center space-y-2 flex-1">
                                                    <div
                                                        className="bg-gradient-to-t from-zinc-900 to-zinc-600 rounded-t transition-all duration-500 hover:bg-primary/80 w-full"
                                                        style={{ height: `${(data.sales / maxSales) * 160}px` }}
                                                    />
                                                    <div className="flex flex-col items-center space-y-1">
                                                        <span className="text-xs text-muted-foreground">{dayOfTheWeek}</span>
                                                        <span className="text-xs text-muted-foreground">{formattedDate}</span>
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span>{data.sales} pedidos</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )
                            })}
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    )
}
