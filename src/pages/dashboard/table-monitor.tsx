
import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, CreditCard, AlertTriangle, Play, Trash2, CheckCircle } from "lucide-react"
import type { Table } from "@/types/table"
import type { TableSession } from "@/types/table-session"
import type { Order } from "@/types/order"

// Mock data for demonstration
const mockTables: Table[] = [
    {
        _id: "1",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        restaurantId: "rest1",
        number: 1,
        currentSessionId: "session1",
        url: null,
        isActive: true,
    },
    {
        _id: "2",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        restaurantId: "rest1",
        number: 2,
        currentSessionId: null,
        url: null,
        isActive: true,
    },
    {
        _id: "3",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        restaurantId: "rest1",
        number: 3,
        currentSessionId: "session3",
        url: null,
        isActive: true,
    },
    {
        _id: "4",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        restaurantId: "rest1",
        number: 4,
        currentSessionId: "session4",
        url: null,
        isActive: true,
    },
    {
        _id: "5",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        restaurantId: "rest1",
        number: 5,
        currentSessionId: null,
        url: null,
        isActive: true,
    },
    {
        _id: "6",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        restaurantId: "rest1",
        number: 6,
        currentSessionId: "session6",
        url: null,
        isActive: true,
    },
]

const mockSessions: Record<string, TableSession> = {
    session1: {
        _id: "session1",
        createdAt: "2024-01-01T10:00:00Z",
        updatedAt: "2024-01-01T10:00:00Z",
        tableId: "1",
        restaurantId: "rest1",
        startTime: "2024-01-01T10:00:00Z",
        orders: ["order1", "order2"],
        status: "active",
        total: 45.5,
    },
    session3: {
        _id: "session3",
        createdAt: "2024-01-01T11:30:00Z",
        updatedAt: "2024-01-01T11:30:00Z",
        tableId: "3",
        restaurantId: "rest1",
        startTime: "2024-01-01T11:30:00Z",
        orders: ["order3"],
        status: "active",
        total: 28.75,
    },
    session4: {
        _id: "session4",
        createdAt: "2024-01-01T09:15:00Z",
        updatedAt: "2024-01-01T09:15:00Z",
        tableId: "4",
        restaurantId: "rest1",
        startTime: "2024-01-01T09:15:00Z",
        orders: ["order4", "order5"],
        status: "active",
        total: 67.25,
    },
    session6: {
        _id: "session6",
        createdAt: "2024-01-01T12:00:00Z",
        updatedAt: "2024-01-01T12:00:00Z",
        tableId: "6",
        restaurantId: "rest1",
        startTime: "2024-01-01T12:00:00Z",
        orders: ["order6"],
        status: "active",
        total: 32.0,
    },
}

const mockOrders: Record<string, Order> = {
    order1: {
        _id: "order1",
        createdAt: "2024-01-01T10:15:00Z",
        updatedAt: "2024-01-01T10:15:00Z",
        sessionId: "session1",
        itemId: "item1",
        quantity: 2,
        unitPrice: 12.5,
        total: 25.0,
        orderedItemName: "Hambúrguer Clássico",
        restaurantId: "rest1",
        customisations: [],
        tableNumber: 1,
        prepStatus: "served",
        orderTime: "2024-01-01T10:15:00Z",
    },
    order2: {
        _id: "order2",
        createdAt: "2024-01-01T10:30:00Z",
        updatedAt: "2024-01-01T10:30:00Z",
        sessionId: "session1",
        itemId: "item2",
        quantity: 1,
        unitPrice: 20.5,
        total: 20.5,
        orderedItemName: "Pizza Margherita",
        restaurantId: "rest1",
        customisations: [],
        tableNumber: 1,
        prepStatus: "ready",
        orderTime: "2024-01-01T10:30:00Z",
    },
}

// Simulate different table statuses for demo
const tableStatuses = {
    1: "ocupada" as const,
    2: "disponivel" as const,
    3: "conta_pedida" as const,
    4: "chamando_funcionario" as const,
    5: "disponivel" as const,
    6: "ocupada" as const,
}

type TableStatus = "disponivel" | "ocupada" | "conta_pedida" | "chamando_funcionario"

const getTableStatus = (table: Table): TableStatus => {
    return tableStatuses[table.number as keyof typeof tableStatuses] || "disponivel"
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
    const [selectedFilter, setSelectedFilter] = useState<TableStatus | "todas">("todas")
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const filteredTables = useMemo(() => {
        if (selectedFilter === "todas") return mockTables
        return mockTables.filter((table) => getTableStatus(table) === selectedFilter)
    }, [selectedFilter])

    const handleTableClick = (table: Table) => {
        setSelectedTable(table)
        setIsSheetOpen(true)
    }

    const handleMarkAsPaid = (sessionId: string) => {
        // In a real app, this would make an API call
        console.log("Marking session as paid:", sessionId)
        setIsSheetOpen(false)
    }

    const handleClearTable = (tableId: string) => {
        // In a real app, this would make an API call
        console.log("Clearing table:", tableId)
        setIsSheetOpen(false)
    }

    const handleStartSession = (tableId: string) => {
        // In a real app, this would make an API call
        console.log("Starting new session for table:", tableId)
        setIsSheetOpen(false)
    }

    const filters = [
        { key: "todas" as const, label: "Todas", count: mockTables.length },
        {
            key: "disponivel" as const,
            label: "Disponíveis",
            count: mockTables.filter((t) => getTableStatus(t) === "disponivel").length,
        },
        {
            key: "ocupada" as const,
            label: "Ocupadas",
            count: mockTables.filter((t) => getTableStatus(t) === "ocupada").length,
        },
        {
            key: "conta_pedida" as const,
            label: "Conta Pedida",
            count: mockTables.filter((t) => getTableStatus(t) === "conta_pedida").length,
        },
        {
            key: "chamando_funcionario" as const,
            label: "Chamando Funcionário",
            count: mockTables.filter((t) => getTableStatus(t) === "chamando_funcionario").length,
        },
    ]

    const selectedSession = selectedTable?.currentSessionId ? mockSessions[selectedTable.currentSessionId] : null
    const sessionOrders = selectedSession?.orders.map((orderId) => mockOrders[orderId]).filter(Boolean) || []

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
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
                        const status = getTableStatus(table)
                        const statusConfig = getStatusConfig(status)
                        const StatusIcon = statusConfig.icon
                        const session = table.currentSessionId ? mockSessions[table.currentSessionId] : null

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
                    <SheetContent className="w-full sm:max-w-md">
                        {selectedTable && (
                            <>
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        Mesa {selectedTable.number}
                                        <Badge className={getStatusConfig(getTableStatus(selectedTable)).color}>
                                            {getStatusConfig(getTableStatus(selectedTable)).label}
                                        </Badge>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="mt-6 space-y-6">
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
                                                        <span>{selectedSession.total ? formatCurrency(selectedSession.total) : "€0,00"}</span>
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
                                                    <p className="text-sm">Nenhuma sessão ativa</p>
                                                </div>
                                                <Button onClick={() => handleStartSession(selectedTable._id)} className="w-full" size="lg">
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
