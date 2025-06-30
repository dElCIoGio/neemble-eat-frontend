
import { useState } from "react"
import { Bell, Settings, Search, Trash2, Eye, EyeOff, Wrench, HardDrive, DollarSign, Megaphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import type { Notification, NotificationSettings, NotificationFilterType } from "@/types/notification"
import {
    useListNotifications,
    useUnreadCount,
    useMarkAllRead,
    useMarkNotificationRead,
    useMarkNotificationUnread,
    useDeleteNotification
} from "@/api/endpoints/notifications/hooks"


const notificationTypes = [
    { value: "todas" as const, label: "Todas" },
    { value: "system" as const, label: "Sistema" },
    { value: "data" as const, label: "Dados" },
    { value: "finances" as const, label: "Financeira" },
    { value: "notice" as const, label: "Comunicado" },
] as const

const priorityColors: Record<Notification["priority"], string> = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
}

export default function NotificationsPage() {
    const [selectedType, setSelectedType] = useState<NotificationFilterType>("todas")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false)
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)

    const { data: notifications = [] } = useListNotifications({
        notificationType: selectedType,
        isRead: showUnreadOnly ? false : undefined,
        search: searchQuery,
        page: 1,
    })

    const { data: unreadCount = 0 } = useUnreadCount()

    const markAllReadMutation = useMarkAllRead()
    const markReadMutation = useMarkNotificationRead()
    const markUnreadMutation = useMarkNotificationUnread()
    const deleteNotificationMutation = useDeleteNotification()

    // Settings state
    const [settings, setSettings] = useState<NotificationSettings>({
        types: {
            system: true,
            data: true,
            finance: true,
            notice: true,
        },
        channels: {
            app: true,
            email: true,
            sms: false,
        },
        frequency: "immediate",
        quietHours: {
            enabled: false,
            start: "22:00",
            end: "08:00",
        },
        priorities: {
            high: true,
            medium: true,
            low: false,
        },
    })

    const filteredNotifications = notifications.filter((notification) => {
        const matchesType = selectedType === "todas" || notification.notificationType === selectedType
        const matchesSearch =
            searchQuery === "" ||
            notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesReadStatus = !showUnreadOnly || !notification.isRead

        return matchesType && matchesSearch && matchesReadStatus
    })

    const markAllAsRead = (): void => {
        markAllReadMutation.mutate()
        toast.success("Todas as notificações foram marcadas como lidas.")
    }

    const toggleReadStatus = (id: string): void => {
        const notification = notifications.find((n) => n._id === id)
        if (!notification) return
        if (notification.isRead) {
            markUnreadMutation.mutate(id)
        } else {
            markReadMutation.mutate(id)
        }
        toast.success(`Notificação marcada como ${notification.isRead ? "não lida" : "lida"}.`)
    }

    const deleteNotification = (id: string): void => {
        deleteNotificationMutation.mutate(id)
        setSelectedNotification(null)
        toast.success("Notificação excluída com sucesso.")
    }

    const saveSettings = (): void => {
        // Here you would typically save to an API
        setSettingsOpen(false)
        toast.success("Suas preferências de notificação foram atualizadas.")
    }

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    const getNotificationIcon = (notificationType: Notification["notificationType"]): React.ReactNode => {
        const iconProps = { className: "h-5 w-5" }

        switch (notificationType) {
            case "system":
                return <Wrench {...iconProps} />
            case "data":
                return <HardDrive {...iconProps} />
            case "finances":
                return <DollarSign {...iconProps} />
            case "notice":
                return <Megaphone {...iconProps} />
            default:
                return <Bell {...iconProps} />
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">Notificações</h1>
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="text-sm">
                            {unreadCount}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        Marcar todas como lidas
                    </Button>
                    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Configurações de Notificação</DialogTitle>
                            </DialogHeader>
                            <Tabs defaultValue="types" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="types">Tipos</TabsTrigger>
                                    <TabsTrigger value="channels">Canais</TabsTrigger>
                                    <TabsTrigger value="schedule">Horários</TabsTrigger>
                                    <TabsTrigger value="priorities">Prioridades</TabsTrigger>
                                </TabsList>

                                <TabsContent value="types" className="space-y-4">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Tipos de Notificação</h3>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="system">Sistema</Label>
                                            <Switch
                                                id="system"
                                                checked={settings.types.system}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        types: { ...prev.types, system: checked },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="data">Dados</Label>
                                            <Switch
                                                id="data"
                                                checked={settings.types.data}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        types: { ...prev.types, data: checked },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="finance">Financeira</Label>
                                            <Switch
                                                id="finance"
                                                checked={settings.types.finance}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        types: { ...prev.types, finance: checked },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="notice">Comunicado</Label>
                                            <Switch
                                                id="notice"
                                                checked={settings.types.notice}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        types: { ...prev.types, notice: checked },
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="channels" className="space-y-4">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Canais de Entrega</h3>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="app">Aplicação</Label>
                                            <Switch
                                                id="app"
                                                checked={settings.channels.app}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        channels: { ...prev.channels, app: checked },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="email">Email</Label>
                                            <Switch
                                                id="email"
                                                checked={settings.channels.email}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        channels: { ...prev.channels, email: checked },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="sms">SMS</Label>
                                            <Switch
                                                id="sms"
                                                checked={settings.channels.sms}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        channels: { ...prev.channels, sms: checked },
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="schedule" className="space-y-4">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Frequência de Entrega</h3>
                                        <Select
                                            value={settings.frequency}
                                            onValueChange={(value: "immediate" | "daily" | "weekly") =>
                                                setSettings((prev) => ({
                                                    ...prev,
                                                    frequency: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="immediate">Imediato</SelectItem>
                                                <SelectItem value="daily">Diário</SelectItem>
                                                <SelectItem value="weekly">Semanal</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="quiet-hours">Horário Silencioso</Label>
                                            <Switch
                                                id="quiet-hours"
                                                checked={settings.quietHours.enabled}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        quietHours: { ...prev.quietHours, enabled: checked },
                                                    }))
                                                }
                                            />
                                        </div>

                                        {settings.quietHours.enabled && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="quiet-start">Início</Label>
                                                    <Input
                                                        id="quiet-start"
                                                        type="time"
                                                        value={settings.quietHours.start}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                            setSettings((prev) => ({
                                                                ...prev,
                                                                quietHours: { ...prev.quietHours, start: e.target.value },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="quiet-end">Fim</Label>
                                                    <Input
                                                        id="quiet-end"
                                                        type="time"
                                                        value={settings.quietHours.end}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                                </TabsContent>

                                <TabsContent value="priorities" className="space-y-4">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Níveis de Prioridade</h3>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="priority-high">Alta</Label>
                                            <Switch
                                                id="priority-high"
                                                checked={settings.priorities.high}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        priorities: { ...prev.priorities, high: checked },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="priority-medium">Média</Label>
                                            <Switch
                                                id="priority-medium"
                                                checked={settings.priorities.medium}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        priorities: { ...prev.priorities, medium: checked },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="priority-low">Baixa</Label>
                                            <Switch
                                                id="priority-low"
                                                checked={settings.priorities.low}
                                                onCheckedChange={(checked: boolean) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        priorities: { ...prev.priorities, low: checked },
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={saveSettings}>Salvar Configurações</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar por título ou mensagem..."
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch id="unread-only" checked={showUnreadOnly} onCheckedChange={setShowUnreadOnly} />
                            <Label htmlFor="unread-only">Apenas não lidas</Label>
                        </div>
                    </div>

                    <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as NotificationFilterType)}>
                        <TabsList className="grid w-full grid-cols-5">
                            {notificationTypes.map((notificationType) => (
                                <TabsTrigger key={notificationType.value} value={notificationType.value}>
                                    {notificationType.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Notification List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Bell className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação encontrada</h3>
                            <p className="text-gray-500 text-center">
                                Não há notificações que correspondam aos filtros selecionados.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification._id}
                            className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                                !notification.isRead ? "border-l-4 border-l-blue-500" : ""
                            }`}
                            onClick={() => setSelectedNotification(notification)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                                        {getNotificationIcon(notification.notificationType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <h3 className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${priorityColors[notification.priority]}`} />
                                                <Badge variant="secondary" className="text-xs">
                                                    {notification.category}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e: React.MouseEvent) => {
                                                        e.stopPropagation()
                                                        toggleReadStatus(notification._id)
                                                    }}
                                                >
                                                    {notification.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e: React.MouseEvent) => {
                                                        e.stopPropagation()
                                                        deleteNotification(notification._id)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
                <DialogContent className="max-w-2xl">
                    {selectedNotification && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                                        {getNotificationIcon(selectedNotification.notificationType)}
                                    </div>
                                    <div className="flex-1">
                                        <DialogTitle className="text-left">{selectedNotification.title}</DialogTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary">{selectedNotification.category}</Badge>
                                            <div className={`w-2 h-2 rounded-full ${priorityColors[selectedNotification.priority]}`} />
                                            <span className="text-sm text-gray-500">{formatDate(selectedNotification.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="py-4">
                                <p className="text-gray-700 leading-relaxed">{selectedNotification.message}</p>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center pt-4">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => toggleReadStatus(selectedNotification._id)}>
                                        {selectedNotification.isRead ? (
                                            <>
                                                <EyeOff className="h-4 w-4 mr-2" />
                                                Marcar como não lida
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-4 w-4 mr-2" />
                                                Marcar como lida
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => deleteNotification(selectedNotification._id)}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir
                                    </Button>
                                </div>
                                <Button onClick={() => setSelectedNotification(null)}>Fechar</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
