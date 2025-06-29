
import { useState, useMemo, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, CreditCard, AlertTriangle, Play, Trash2, CheckCircle, XCircle } from "lucide-react"
import type { Table } from "@/types/table"
import type { TableSession } from "@/types/table-session"
import { useDashboardContext } from "@/context/dashboard-context"
import { useListRestaurantTables } from "@/api/endpoints/tables/hooks"
import { useGetSessionOrders } from "@/api/endpoints/orders/hooks"
import { sessionApi } from "@/api/endpoints/sessions/requests"
import { tableApi } from "@/api/endpoints/tables/requests"
import useWebSocket from "@/hooks/use-web-socket"
import config from "@/config"
import { showPromiseToast } from "@/utils/notifications/toast"

type TableStatus = "disponivel" | "ocupada" | "conta_pedida" | "chamando_funcionario"

const getTableStatus = (
    table: Table,
    sessions: Record<string, TableSession>
): TableStatus => {
    const session = sessions[table._id]
    if (!session) return "disponivel"
    if (session.status === "needs bill") return "conta_pedida"
    if (session.orders && session.orders.length > 0) return "ocupada"
    return "disponivel"
}

const getStatusConfig = (status: TableStatus) => {
    switch (status) {
        case "disponivel":
            return {
                label: "Disponível",
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
                cardBorder: "border-green-200",
            }
        case "ocupada":
            return {
                label: "Ocupada",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: Users,
                cardBorder: "border-blue-200",
            }
        case "conta_pedida":
            return {
                label: "Conta Pedida",
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: CreditCard,
                cardBorder: "border-yellow-200",
            }
        case "chamando_funcionario":
            return {
                label: "Chamando Funcionário",
                color: "bg-red-100 text-red-800 border-red-200",
                icon: AlertTriangle,
                cardBorder: "border-red-200",
            }
    }
}

const formatDuration = (startTime: string) => {
    const start = new Date(startTime)
    const now = new Date()
    const diff = now.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "EUR",
    }).format(amount)
}

export default function TableMonitor() {
    const { restaurant } = useDashboardContext()
    const { data: tables = [] } = useListRestaurantTables(restaurant._id)

    const [sessions, setSessions] = useState<Record<string, TableSession>>({})

    useEffect(() => {
        sessionApi.listActiveSessions(restaurant._id).then((data) => {
            if (!data) return
            const list = Array.isArray(data) ? data : []
            const mapping: Record<string, TableSession> = {}
            list.forEach((s) => {
                mapping[s.tableId] = s
            })
            setSessions(mapping)
        })
    }, [restaurant._id])

    const handleSessionUpdate = useCallback((event: MessageEvent) => {
        try {
            const session: TableSession = JSON.parse(event.data)
            setSessions((prev) => {
                if (["closed", "cancelled", "paid"].includes(session.status)) {
                    const updated = { ...prev }
                    delete updated[session.tableId]
                    return updated
                }
                return { ...prev, [session.tableId]: session }
            })
        } catch (error) {
            console.error("Error parsing websocket message", error)
        }
    }, [])

    const wsUrl = `${config.api.apiUrl.replace("http", "ws")}/ws/${restaurant._id}/session-status`
    useWebSocket(wsUrl, { onMessage: handleSessionUpdate, reconnectInterval: 2000 })

    const [selectedFilter, setSelectedFilter] = useState<TableStatus | "todas">("todas")
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const filteredTables = useMemo(() => {
        if (selectedFilter === "todas") return tables
        return tables.filter((table) => getTableStatus(table, sessions) === selectedFilter)
    }, [selectedFilter, tables, sessions])

    const handleTableClick = (table: Table) => {
        setSelectedTable(table)
        setIsSheetOpen(true)
    }

    const handleMarkAsPaid = (sessionId: string) => {
        const promise = sessionApi.paySession(sessionId).then(() => {
            setSessions((prev) => {
                const entry = Object.values(prev).find((s) => s._id === sessionId)
                if (!entry) return prev
                const updated = { ...prev }
                delete updated[entry.tableId]
                return updated
            })
        })
        showPromiseToast(promise, {
            loading: "Processando...",
            success: "Sessão paga com sucesso",
            error: "Falha ao marcar como paga"
        })
        setIsSheetOpen(false)
    }

    const handleClearTable = (tableId: string) => {
        const promise = tableApi.cleanTable(tableId).then(() => {
            setSessions((prev) => {
                const updated = { ...prev }
                delete updated[tableId]
                return updated
            })
        })
        showPromiseToast(promise, {
            loading: "Limpando mesa...",
            success: "Mesa limpa",
            error: "Erro ao limpar mesa"
        })
        setIsSheetOpen(false)
    }

    const handleCancelCheckout = (sessionId: string) => {
        const promise = sessionApi.cancelCheckout(sessionId).then(() => {
            setSessions((prev) => {
                const entry = Object.values(prev).find((s) => s._id === sessionId)
                if (!entry) return prev
                return { ...prev, [entry.tableId]: { ...entry, status: "active" } }
            })
        })
        showPromiseToast(promise, {
            loading: "Cancelando conta...",
            success: "Conta cancelada",
            error: "Erro ao cancelar conta"
        })
        setIsSheetOpen(false)
    }

    const handleStartSession = (tableId: string) => {

        console.log(tableId)
        showPromiseToast(Promise.resolve(), {
            loading: "Iniciando sessão...",
            success: "Funcionalidade não implementada",
            error: ""
        })
        setIsSheetOpen(false)
    }

    const filters = [
        { key: "todas" as const, label: "Todas", count: tables.length },
        {
            key: "disponivel" as const,
            label: "Disponíveis",
            count: tables.filter((t) => getTableStatus(t, sessions) === "disponivel").length,
        },
        {
            key: "ocupada" as const,
            label: "Ocupadas",
            count: tables.filter((t) => getTableStatus(t, sessions) === "ocupada").length,
        },
        {
            key: "conta_pedida" as const,
            label: "Conta Pedida",
            count: tables.filter((t) => getTableStatus(t, sessions) === "conta_pedida").length,
        },
    ]

    const selectedSession = selectedTable ? sessions[selectedTable._id] : null
    const { data: sessionOrders = [] } = useGetSessionOrders(selectedSession?._id)
    const sessionTotal = useMemo(
        () => sessionOrders.reduce((sum, order) => sum + order.total, 0),
        [sessionOrders]
    )

    return (
        <div className="bg-gray-50">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Monitor de Mesas</h1>
                    <p className="text-gray-600">Acompanhe o status de todas as mesas do restaurante</p>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <Button
                                key={filter.key}
                                variant={selectedFilter === filter.key ? "default" : "outline"}
                                onClick={() => setSelectedFilter(filter.key)}
                                className="flex items-center gap-2"
                            >
                                {filter.label}
                                <Badge variant="secondary" className="ml-1">
                                    {filter.count}
                                </Badge>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Table Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredTables.map((table) => {
                        const status = getTableStatus(table, sessions)
                        const statusConfig = getStatusConfig(status)
                        const StatusIcon = statusConfig.icon
                        const session = sessions[table._id]

                        return (
                            <Card
                                key={table._id}
                                className={`cursor-pointer transition-all hover:shadow-md ${statusConfig.cardBorder} border-2`}
                                onClick={() => handleTableClick(table)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-bold">Mesa {table.number}</CardTitle>
                                        <StatusIcon className="h-5 w-5 text-gray-500" />
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <Badge className={`${statusConfig.color} text-xs font-medium`}>{statusConfig.label}</Badge>
                                    {session && (
                                        <div className="mt-2 space-y-1 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatDuration(session.startTime)}
                                            </div>
                                            {session.total && (
                                                <div className="font-medium text-gray-900">{formatCurrency(session.total)}</div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Details Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                        {selectedTable && (
                            <>
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        Mesa {selectedTable.number}
                                        <Badge className={getStatusConfig(getTableStatus(selectedTable, sessions)).color}>
                                            {getStatusConfig(getTableStatus(selectedTable, sessions)).label}
                                        </Badge>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="mt-6 space-y-6 p-4">
                                    {selectedSession ? (
                                        <>
                                            {/* Session Info */}
                                            <div className="space-y-3">
                                                <h3 className="font-semibold text-gray-900">Informações da Sessão</h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Início:</span>
                                                        <span>{new Date(selectedSession.startTime).toLocaleString("pt-BR")}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Duração:</span>
                                                        <span>{formatDuration(selectedSession.startTime)}</span>
                                                    </div>
                                                    <div className="flex justify-between font-medium">
                                                        <span className="text-gray-600">Total Atual:</span>
                                                        <span>{formatCurrency(sessionTotal)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Orders */}
                                            <div className="space-y-3">
                                                <h3 className="font-semibold text-gray-900">Pedidos ({sessionOrders.length})</h3>
                                                {sessionOrders.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {sessionOrders.map((order) => (
                                                            <div key={order._id} className="border rounded-lg p-3 space-y-2">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <p className="font-medium text-sm">{order.orderedItemName}</p>
                                                                        <p className="text-xs text-gray-600">Qtd: {order.quantity}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-medium text-sm">{formatCurrency(order.total)}</p>
                                                                        <Badge
                                                                            variant={order.prepStatus === "served" ? "default" : "secondary"}
                                                                            className="text-xs"
                                                                        >
                                                                            {order.prepStatus === "served"
                                                                                ? "Servido"
                                                                                : order.prepStatus === "ready"
                                                                                    ? "Pronto"
                                                                                    : order.prepStatus === "in_progress"
                                                                                        ? "Preparando"
                                                                                        : "Na fila"}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">Nenhum pedido ainda</p>
                                                )}
                                            </div>

                                            <Separator />

                                            {/* Actions */}
                                            <div className="space-y-3">
                                                {selectedSession.status === "needs bill" && (
                                                    <Button onClick={() => handleCancelCheckout(selectedSession._id)} variant="outline" className="w-full" size="lg">
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Cancelar Conta
                                                    </Button>
                                                )}
                                                <Button onClick={() => handleMarkAsPaid(selectedSession._id)} className="w-full" size="lg">
                                                    <CreditCard className="h-4 w-4 mr-2" />
                                                    Marcar como Paga
                                                </Button>
                                                <Button
                                                    onClick={() => handleClearTable(selectedTable._id)}
                                                    variant="destructive"
                                                    className="w-full"
                                                    size="lg"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Limpar Mesa
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* No Session */}
                                            <div className="text-center space-y-4">
                                                <div className="text-gray-500">
                                                    <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                                                    <p>Mesa disponível</p>
                                                    <p className="text-sm hidden">Nenhuma sessão ativa</p>
                                                </div>
                                                <Button onClick={() => handleStartSession(selectedTable._id)} className="w-full hidden" size="lg">
                                                    <Play className="h-4 w-4 mr-2" />
                                                    Iniciar Sessão
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
