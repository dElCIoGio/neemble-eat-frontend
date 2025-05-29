
import { useState } from "react"
import { Bell, Check, CheckCheck, Filter, Search, Settings, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Clock, Mail, MessageSquare } from "lucide-react"
import {toast} from "sonner";

interface Notification {
    id: string
    type: "sistema" | "dados" | "financeira" | "comunicado"
    title: string
    message: string
    date: string
    time: string
    isRead: boolean
    priority: "alta" | "media" | "baixa"
    category: string
}

interface NotificationSettings {
    types: {
        sistema: boolean
        dados: boolean
        financeira: boolean
        comunicado: boolean
    }
    channels: {
        app: boolean
        email: boolean
        sms: boolean
    }
    frequency: "immediate" | "daily" | "weekly"
    quietHours: {
        enabled: boolean
        start: string
        end: string
    }
    priorities: {
        alta: boolean
        media: boolean
        baixa: boolean
    }
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "sistema",
        title: "Nova funcionalidade disponível",
        message: "Sistema de gestão de stock foi atualizado com novas funcionalidades de controlo automático.",
        date: "27/05/2025",
        time: "14:30",
        isRead: false,
        priority: "alta",
        category: "Atualizações",
    },
    {
        id: "2",
        type: "dados",
        title: "Alerta de stock baixo",
        message: 'O ingrediente "Tomate" está com stock baixo (apenas 5 unidades restantes).',
        date: "27/05/2025",
        time: "12:15",
        isRead: false,
        priority: "alta",
        category: "Stock",
    },
    {
        id: "3",
        type: "financeira",
        title: "Comprovativo validado",
        message: "O comprovativo de pagamento do plano mensal foi validado com sucesso.",
        date: "26/05/2025",
        time: "09:45",
        isRead: true,
        priority: "media",
        category: "Pagamentos",
    },
    {
        id: "4",
        type: "dados",
        title: "Relatório mensal pronto",
        message: "O relatório de vendas de maio está disponível para visualização.",
        date: "26/05/2025",
        time: "08:00",
        isRead: true,
        priority: "media",
        category: "Relatórios",
    },
    {
        id: "5",
        type: "comunicado",
        title: "Evento Neemble Connect",
        message: "Está convidado para o evento Neemble Connect 2025. Inscrições abertas.",
        date: "25/05/2025",
        time: "16:20",
        isRead: false,
        priority: "baixa",
        category: "Eventos",
    },
    {
        id: "6",
        type: "sistema",
        title: "Manutenção programada",
        message: "Manutenção do sistema agendada para domingo, 30/05/2025 das 02:00 às 04:00.",
        date: "24/05/2025",
        time: "11:30",
        isRead: true,
        priority: "media",
        category: "Manutenção",
    },
]

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
    const [selectedType, setSelectedType] = useState<string>("todas")
    const [searchTerm, setSearchTerm] = useState("")
    const [showOnlyUnread, setShowOnlyUnread] = useState(false)
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

    const [showConfirmMarkAll, setShowConfirmMarkAll] = useState(false)
    const [isConfigOpen, setIsConfigOpen] = useState(false)
    const [settings, setSettings] = useState<NotificationSettings>({
        types: {
            sistema: true,
            dados: true,
            financeira: true,
            comunicado: true,
        },
        channels: {
            app: true,
            email: false,
            sms: false,
        },
        frequency: "immediate",
        quietHours: {
            enabled: false,
            start: "22:00",
            end: "08:00",
        },
        priorities: {
            alta: true,
            media: true,
            baixa: true,
        },
    })

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const filteredNotifications = notifications.filter((notification) => {
        const matchesType = selectedType === "todas" || notification.type === selectedType
        const matchesSearch =
            notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesReadStatus = !showOnlyUnread || !notification.isRead

        return matchesType && matchesSearch && matchesReadStatus
    })

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
        )
    }

    const markAsUnread = (id: string) => {
        setNotifications((prev) =>
            prev.map((notification) => (notification.id === id ? { ...notification, isRead: false } : notification)),
        )
    }

    const markAllAsRead = () => {
        const unreadNotifications = notifications.filter((n) => !n.isRead)
        if (unreadNotifications.length === 0) {
            toast.info("Nenhuma notificação para marcar", {
                description: "Todas as notificações já estão marcadas como lidas.",
            })
            return
        }

        setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
        setShowConfirmMarkAll(false)

        toast.success("Notificações marcadas como lidas", {
            description: `${unreadNotifications.length} notificação(ões) marcada(s) como lida(s).`,
        })
    }

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "sistema":
                return "⚙️"
            case "dados":
                return "📊"
            case "financeira":
                return "💳"
            case "comunicado":
                return "📢"
            default:
                return "🔔"
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "sistema":
                return "bg-blue-100 text-blue-800"
            case "dados":
                return "bg-green-100 text-green-800"
            case "financeira":
                return "bg-yellow-100 text-yellow-800"
            case "comunicado":
                return "bg-purple-100 text-purple-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "alta":
                return "bg-red-500"
            case "media":
                return "bg-yellow-500"
            case "baixa":
                return "bg-green-500"
            default:
                return "bg-gray-500"
        }
    }

    const saveSettings = () => {
        // Aqui você salvaria as configurações no backend
        toast.success("Configurações salvas", {
            description: "As suas preferências de notificação foram atualizadas com sucesso.",
        })
        setIsConfigOpen(false)
    }

    return (
        <div className="">
            <div className="">
                {/* Page title and overview */}
                <div className="">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
                        <div className="flex items-center space-x-3">
                            <Dialog open={showConfirmMarkAll} onOpenChange={setShowConfirmMarkAll}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="flex items-center space-x-2" disabled={unreadCount === 0}>
                                        <CheckCheck className="w-4 h-4" />
                                        <span>Marcar todas como lidas</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Confirmar ação</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <p className="text-gray-600">
                                            Tem certeza que deseja marcar todas as {unreadCount} notificação(ões) não lida(s) como lidas?
                                        </p>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="outline" onClick={() => setShowConfirmMarkAll(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={markAllAsRead}>Confirmar</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center space-x-2">
                                        <Settings className="w-4 h-4" />
                                        <span>Configurações</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center space-x-2">
                                            <Settings className="w-5 h-5" />
                                            <span>Configurações de Notificações</span>
                                        </DialogTitle>
                                    </DialogHeader>

                                    <Tabs defaultValue="types" className="w-full">
                                        <TabsList className="grid w-full grid-cols-4">
                                            <TabsTrigger value="types">Tipos</TabsTrigger>
                                            <TabsTrigger value="channels">Canais</TabsTrigger>
                                            <TabsTrigger value="schedule">Horários</TabsTrigger>
                                            <TabsTrigger value="priorities">Prioridades</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="types" className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-medium mb-4">Tipos de Notificação</h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-xl">⚙️</span>
                                                            <div>
                                                                <Label className="font-medium">Sistema e Plataforma</Label>
                                                                <p className="text-sm text-gray-600">
                                                                    Atualizações, manutenção e novas funcionalidades
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={settings.types.sistema}
                                                            onCheckedChange={(checked) =>
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    types: { ...prev.types, sistema: checked as boolean },
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-xl">📊</span>
                                                            <div>
                                                                <Label className="font-medium">Dados e Atividade</Label>
                                                                <p className="text-sm text-gray-600">
                                                                    Relatórios, alertas de stock e volume de pedidos
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={settings.types.dados}
                                                            onCheckedChange={(checked) =>
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    types: { ...prev.types, dados: checked as boolean },
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-xl">💳</span>
                                                            <div>
                                                                <Label className="font-medium">Financeiras</Label>
                                                                <p className="text-sm text-gray-600">Pagamentos, comprovantes e renovações</p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={settings.types.financeira}
                                                            onCheckedChange={(checked) =>
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    types: { ...prev.types, financeira: checked as boolean },
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-xl">📢</span>
                                                            <div>
                                                                <Label className="font-medium">Comunicados Gerais</Label>
                                                                <p className="text-sm text-gray-600">Eventos, informações e convites</p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={settings.types.comunicado}
                                                            onCheckedChange={(checked) =>
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    types: { ...prev.types, comunicado: checked as boolean },
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="channels" className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-medium mb-4">Canais de Notificação</h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <Bell className="w-5 h-5 text-blue-600" />
                                                            <div>
                                                                <Label className="font-medium">Aplicação Web</Label>
                                                                <p className="text-sm text-gray-600">Notificações dentro da plataforma</p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={settings.channels.app}
                                                            onCheckedChange={(checked) =>
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    channels: { ...prev.channels, app: checked as boolean },
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <Mail className="w-5 h-5 text-green-600" />
                                                            <div>
                                                                <Label className="font-medium">E-mail</Label>
                                                                <p className="text-sm text-gray-600">Notificações por correio eletrónico</p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={settings.channels.email}
                                                            onCheckedChange={(checked) =>
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    channels: { ...prev.channels, email: checked as boolean },
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <MessageSquare className="w-5 h-5 text-purple-600" />
                                                            <div>
                                                                <Label className="font-medium">SMS</Label>
                                                                <p className="text-sm text-gray-600">Notificações por mensagem de texto</p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={settings.channels.sms}
                                                            onCheckedChange={(checked) =>
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    channels: { ...prev.channels, sms: checked as boolean },
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="schedule" className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-medium mb-4">Configurações de Horário</h3>
                                                <div className="space-y-6">
                                                    <div>
                                                        <Label className="font-medium mb-3 block">Frequência de Notificações</Label>
                                                        <Select
                                                            value={settings.frequency}
                                                            onValueChange={(value: "immediate" | "daily" | "weekly") =>
                                                                setSettings((prev) => ({ ...prev, frequency: value }))
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="immediate">Imediata</SelectItem>
                                                                <SelectItem value="daily">Resumo diário</SelectItem>
                                                                <SelectItem value="weekly">Resumo semanal</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <Separator />

                                                    <div>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center space-x-3">
                                                                <Clock className="w-5 h-5 text-orange-600" />
                                                                <div>
                                                                    <Label className="font-medium">Horário de Silêncio</Label>
                                                                    <p className="text-sm text-gray-600">Não receber notificações durante este período</p>
                                                                </div>
                                                            </div>
                                                            <Checkbox
                                                                checked={settings.quietHours.enabled}
                                                                onCheckedChange={(checked) =>
                                                                    setSettings((prev) => ({
                                                                        ...prev,
                                                                        quietHours: { ...prev.quietHours, enabled: checked as boolean },
                                                                    }))
                                                                }
                                                            />
                                                        </div>

                                                        {settings.quietHours.enabled && (
                                                            <div className="grid grid-cols-2 gap-4 ml-8">
                                                                <div>
                                                                    <Label className="text-sm">Início</Label>
                                                                    <Input
                                                                        type="time"
                                                                        value={settings.quietHours.start}
                                                                        onChange={(e) =>
                                                                            setSettings((prev) => ({
                                                                                ...prev,
                                                                                quietHours: { ...prev.quietHours, start: e.target.value },
                                                                            }))
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-sm">Fim</Label>
                                                                    <Input
                                                                        type="time"
                                                                        value={settings.quietHours.end}
                                                                        onChange={(e) =>
                                                                            setSettings((prev) => ({
                                                                                ...prev,
                                                                                quietHours: { ...prev.quietHours, end: e.target.value },
                                                                            }))
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="priorities" className="space-y-4">
                                            <div>
                                                <h3 className="text-lg font-medium mb-4">Níveis de Prioridade</h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                            <div>
                                                                <Label className="font-medium">Alta Prioridade</Label>
                                                                <p className="text-sm text-gray-600">Notificações urgentes e críticas</p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={settings.priorities.alta}
                                                            onCheckedChange={(checked) =>
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    priorities: { ...prev.priorities, alta: checked as boolean },
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                            <div>
                                                                <Label className="font-medium">Média Prioridade</Label>
                                                                <p className="text-sm text-gray-600">Notificações importantes mas não urgentes</p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={settings.priorities.media}
                                                            onCheckedChange={(checked) =>
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    priorities: { ...prev.priorities, media: checked as boolean },
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    <Separator />

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                            <div>
                                                                <Label className="font-medium">Baixa Prioridade</Label>
                                                                <p className="text-sm text-gray-600">Notificações informativas</p>
                                                            </div>
                                                        </div>
                                                        <Checkbox
                                                            checked={settings.priorities.baixa}
                                                            onCheckedChange={(checked) =>
                                                                setSettings((prev) => ({
                                                                    ...prev,
                                                                    priorities: { ...prev.priorities, baixa: checked as boolean },
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    <div className="flex justify-end space-x-2 pt-4 border-t">
                                        <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={saveSettings}>Salvar Configurações</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <p className="text-gray-600">Acompanhe todas as notificações e comunicados importantes.</p>
                </div>

                {/* Overview cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Não Lidas</p>
                                    <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Sistema</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {notifications.filter((n) => n.type === "sistema").length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">⚙️</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Financeiras</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {notifications.filter((n) => n.type === "financeira").length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">💳</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Dados</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {notifications.filter((n) => n.type === "dados").length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">📊</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Filter className="w-5 h-5" />
                            <span>Filtros</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Pesquisar notificações
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="search"
                                        placeholder="Digite o título ou conteúdo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="type-filter" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Filtrar por tipo
                                </Label>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todas">Todas</SelectItem>
                                        <SelectItem value="sistema">Sistema</SelectItem>
                                        <SelectItem value="dados">Dados e Atividade</SelectItem>
                                        <SelectItem value="financeira">Financeiras</SelectItem>
                                        <SelectItem value="comunicado">Comunicados</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <div className="flex items-center space-x-2">
                                    <Switch id="unread-only" checked={showOnlyUnread} onCheckedChange={setShowOnlyUnread} />
                                    <Label htmlFor="unread-only" className="text-sm font-medium text-gray-700">
                                        Apenas não lidas
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications list */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Notificações</CardTitle>
                        <p className="text-sm text-gray-600">{filteredNotifications.length} notificação(ões) encontrada(s)</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer ${
                                        !notification.isRead ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                                    }`}
                                    onClick={() => setSelectedNotification(notification)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className="flex-shrink-0">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}
                                                >
                                                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className={`font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                                                        {notification.title}
                                                    </h3>
                                                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                                                    {!notification.isRead && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            Nova
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span>{notification.date}</span>
                                                    <span>{notification.time}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {notification.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (notification.isRead)
                                                        markAsUnread(notification.id)
                                                    else {
                                                        markAsRead(notification.id)

                                                    }
                                                }}
                                            >
                                                {notification.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteNotification(notification.id)
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredNotifications.length === 0 && (
                                <div className="text-center py-12">
                                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação encontrada</h3>
                                    <p className="text-gray-600">Tente ajustar os filtros para ver mais notificações.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notification detail modal */}
            {selectedNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(selectedNotification.type)}`}
                                    >
                                        <span className="text-xl">{getTypeIcon(selectedNotification.type)}</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl mb-2">{selectedNotification.title}</CardTitle>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>
                        {selectedNotification.date} às {selectedNotification.time}
                      </span>
                                            <Badge variant="outline">{selectedNotification.category}</Badge>
                                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedNotification.priority)}`}></div>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedNotification(null)}>
                                    ✕
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed mb-6">{selectedNotification.message}</p>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (selectedNotification.isRead){
                                                markAsUnread(selectedNotification.id)
                                            } else {
                                                markAsRead(selectedNotification.id)
                                            }
                                        }}
                                    >
                                        {selectedNotification.isRead ? (
                                            <>
                                                <EyeOff className="w-4 h-4 mr-2" />
                                                Marcar como não lida
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Marcar como lida
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            deleteNotification(selectedNotification.id)
                                            setSelectedNotification(null)
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar
                                    </Button>
                                </div>
                                <Button onClick={() => setSelectedNotification(null)}>Fechar</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
