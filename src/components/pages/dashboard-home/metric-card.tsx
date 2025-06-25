import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import { MetricFormat } from "@/types/dashboard"

interface MetricCardProps {
    title: string
    value?: number
    growth: number
    icon: React.ComponentType<{ className?: string }>
    format?: MetricFormat
    isLoading?: boolean
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

export default function MetricCard({ title, value, growth, icon: Icon, format = "currency", isLoading = false }: MetricCardProps) {
    const isPositive = growth > 0
    const GrowthIcon = isPositive ? TrendingUp : TrendingDown

    return (
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-purple-700" />
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
                        <div className="text-2xl font-bold">{formatValue(value ?? 0, format)}</div>
                        <div className="flex items-center space-x-1 text-xs">
                            <GrowthIcon className={`h-3 w-3 ${isPositive ? "text-green-500" : "text-red-500"}`} />
                            <span className={isPositive ? "text-green-500" : "text-red-500"}>{Math.abs(growth).toFixed(1)}%</span>
                            <span className="text-muted-foreground">vs. período anterior</span>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
