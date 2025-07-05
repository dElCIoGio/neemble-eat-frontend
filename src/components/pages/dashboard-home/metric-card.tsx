import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MetricFormat } from "@/types/dashboard"

interface MetricCardProps {
    title: string
    value?: number
    growth: number
    icon: React.ComponentType<{ className?: string }>
    format?: MetricFormat
    isLoading?: boolean
    info?: string
}

function formatValue(val: number, format: MetricFormat): string {
    switch (format) {
        case "currency":
            return `Kz ${val.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}`
        case "percentage":
            return `${val.toFixed(1)}%`
        default:
            return val.toLocaleString("pt-PT")
    }
}

export default function MetricCard({ title, value, growth, icon: Icon, format = "currency", isLoading = false, info }: MetricCardProps) {
    const isPositive = growth > 0
    const GrowthIcon = isPositive ? TrendingUp : TrendingDown

    return (
        <Card className="bg-zinc-100 py-0 flex flex-col">
            <Card className="flex-1 my-0 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                        <span>{title}</span>
                        {info && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="cursor-default">
                                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>{info}</TooltipContent>
                            </Tooltip>
                        )}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-purple-700"/>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-16">
                            <span className="text-sm text-muted-foreground">A carregar...</span>
                        </div>
                    ) : value === undefined ? (
                        <div className="flex items-center justify-center h-16">
                            <span className="text-sm text-muted-foreground">Sem dados disponíveis</span>
                        </div>
                    ) : (
                        <>
                            <div className="text-lg font-bold">{formatValue(value ?? 0, format)}</div>
                        </>
                    )}
                </CardContent>
            </Card>
            <div className="px-2 mb-2 -mt-4 flex items-center space-x-1 text-xs">
                <GrowthIcon className={`h-3 w-3 ${growth == 0 && "hidden"} ${isPositive ? "text-green-500" : "text-red-500"}`}/>
                <div className="text-xs space-x-1">
                                <span
                                    className={isPositive ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>{Math.abs(growth).toFixed(1)}%</span>
                    <span className="text-muted-foreground">vs. período anterior</span>
                </div>
            </div>
        </Card>

    )
}
