import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useDashboardHomeContext } from "@/context/dashboard-home-context"

export default function InsightsCard() {
    const { insights } = useDashboardHomeContext()

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5" />
                    <span>Insights com IA</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-default">
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>Sugestões automatizadas baseadas nos seus dados</TooltipContent>
                    </Tooltip>
                </CardTitle>
                <CardDescription>Sugestões automatizadas baseadas nos seus dados</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    {insights.map((insight, index) => {
                        const Icon = insight.icon
                        const bgColor =
                            insight.type === "positive"
                                ? "bg-green-50 border-green-200"
                                : insight.type === "warning"
                                    ? "bg-yellow-50 border-yellow-200"
                                    : "bg-blue-50 border-blue-200"
                        const iconColor =
                            insight.type === "positive"
                                ? "text-green-600"
                                : insight.type === "warning"
                                    ? "text-yellow-600"
                                    : "text-blue-600"
                        return (
                            <div key={`insight-${index}`} className={`rounded-lg p-2 border transition-all duration-300 hover:shadow-md ${bgColor}`}>
                                <div className="flex items-start space-x-3">
                                    <Icon className={`h-4 w-4 min-h-4 min-w-4 mt-0.5 ${iconColor}`} />
                                    <p className="text-sm leading-relaxed">{insight.message}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
