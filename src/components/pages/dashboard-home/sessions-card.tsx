import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingUp, Users, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useDashboardHomeContext } from "@/context/dashboard-home-context"

export default function SessionsCard() {
    const {
        sessionDurationSummary,
        activeSessionsSummary,
        isSessionDurationSummaryLoading,
        isActiveSessionsSummaryLoading,
    } = useDashboardHomeContext()

    const isLoading = isSessionDurationSummaryLoading || isActiveSessionsSummaryLoading

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-1">
                    <span>Sessões de Cliente</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-default">
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>Duração e atividade das sessões</TooltipContent>
                    </Tooltip>
                </CardTitle>
                <CardDescription>Duração e atividade das sessões</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <span className="text-sm text-muted-foreground">A carregar...</span>
                    </div>
                ) : !sessionDurationSummary && !activeSessionsSummary ? (
                    <div className="flex items-center justify-center h-40">
                        <span className="text-sm text-muted-foreground">Sem dados disponíveis</span>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Duração Média</span>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">{sessionDurationSummary?.averageDurationMinutes ?? 0} min</div>
                                <div className="flex items-center text-xs text-green-500">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {/* TODO: Need growth data */}
                                    0%
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Mesas ocupadas</span>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">{activeSessionsSummary?.activeSessions ?? 0}</div>
                                <div className="hidden items-center text-xs text-green-500">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {/* TODO: Need growth data */}
                                    0%
                                </div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <div className="text-xs text-muted-foreground mb-2">Distribuição de Duração</div>
                            <div className="flex space-x-1 h-16 items-end">
                                {/* TODO: Need session duration distribution data */}
                                {[20, 35, 45, 60, 40, 25, 15].map((height, index) => (
                                    <div
                                        key={`duration-${index}`}
                                        className="bg-primary/20 rounded-t flex-1 transition-all duration-300 hover:bg-primary/40"
                                        style={{ height: `${height}%` }}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0-30m</span>
                                <span>30-60m</span>
                                <span>60m+</span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
