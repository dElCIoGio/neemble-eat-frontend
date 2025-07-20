import { useState, useEffect } from "react"
import { toast, Toaster } from "sonner"
import {
    Calendar,
    Upload,
    Download,
    CreditCard,
    Building2,
    Banknote,
    Phone,
    Mail,
    FileText,
    AlertTriangle,
    ArrowUpCircle,
    Settings,
    Users,
    BarChart3,
    Bell,
    Pause,
    Gift,
    Shield,
    MessageCircle,
    Check,
    Zap,
    Crown,
    Star,
    Copy,
    Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    useGetCurrentSubscription,
    useGetUsageMetrics,
    useGetPaymentHistory,
    useGetPlans,
    useUploadPaymentProof,
    useChangePlan,
    useDownloadInvoice,
    useGetLatestInvoice,
    usePauseSubscription,
    useBackupAccountData,
} from "@/api/endpoints/subscriptions/hooks"
import { showPromiseToast } from "@/utils/notifications/toast"
import type {
    PaymentHistory,
    Subscription,
    Plan,
    UsageMetrics,
    PaymentForm,
    NotificationSettings,
} from "@/types/subscription"

export default function Subscription() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [paymentForm, setPaymentForm] = useState<PaymentForm>({
        holderName: "",
        paymentReference: "",
        paymentDate: "",
        amountPaid: "",
        notes: "",
    })

    // Loading states for local actions
    const [loadingStates, setLoadingStates] = useState({
        support: false,
        invite: false,
        chat: false,
    })

    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [showPlanChangeDialog, setShowPlanChangeDialog] = useState(false)
    const [showPauseDialog, setShowPauseDialog] = useState(false)
    const [showInviteDialog, setShowInviteDialog] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [autoRenewal, setAutoRenewal] = useState(true)
    const [notifications, setNotifications] = useState<NotificationSettings>({
        email: true,
        sms: false,
        whatsapp: true,
    })
    const [copiedCode, setCopiedCode] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")

    const { data: availablePlans } = useGetPlans()
    const { data: currentSubscription } = useGetCurrentSubscription()
    const { data: usageMetrics } = useGetUsageMetrics()
    const { data: paymentHistory } = useGetPaymentHistory()
    const { refetch: fetchLatestInvoice } = useGetLatestInvoice()

    const uploadPaymentProof = useUploadPaymentProof()
    const changePlanMutation = useChangePlan()
    const downloadInvoiceMutation = useDownloadInvoice()
    const pauseSubscriptionMutation = usePauseSubscription()
    const backupAccountMutation = useBackupAccountData()

    useEffect(() => {
        if (currentSubscription?.autoRenew !== undefined) {
            setAutoRenewal(!!currentSubscription.autoRenew)
        }
    }, [currentSubscription])

    const currentPlan = availablePlans?.find((p) => p._id === currentSubscription?.planId)





    // 1. Submeter Comprovativo
    const handleSubmitPayment = async () => {
        // Validation
        if (!paymentForm.holderName || !paymentForm.paymentDate || !paymentForm.amountPaid || !uploadedFile) {
            toast.error("Por favor, preencha todos os campos obrigatórios e anexe o comprovativo.")
            return
        }

        // File validation
        if (uploadedFile.size > 5 * 1024 * 1024) {
            toast.error("O arquivo deve ter no máximo 5MB.")
            return
        }

        const formData = new FormData()
        formData.append("holderName", paymentForm.holderName)
        formData.append("paymentReference", paymentForm.paymentReference)
        formData.append("paymentDate", paymentForm.paymentDate)
        formData.append("amountPaid", paymentForm.amountPaid)
        formData.append("notes", paymentForm.notes)
        formData.append("file", uploadedFile)

        showPromiseToast(
            uploadPaymentProof.mutateAsync(formData).then(() => {
                setPaymentForm({
                    holderName: "",
                    paymentReference: "",
                    paymentDate: "",
                    amountPaid: "",
                    notes: "",
                })
                setUploadedFile(null)
                setShowUploadDialog(false)
            }),
            {
                loading: "Enviando comprovativo...",
                success: "Comprovativo enviado com sucesso!",
                error: "Erro ao enviar comprovativo.",
            }
        )
    }

    // 2. Fazer Upgrade
    const handleUpgrade = () => {
        setActiveTab("plans")
        toast.info("Escolha o plano desejado para fazer o upgrade.")
    }

    // 3. Solicitar Fatura
    const handleRequestInvoice = async () => {
        showPromiseToast(
            fetchLatestInvoice().then(({ data }) => {
                if (!data) throw new Error("Sem fatura disponível")
                return downloadInvoiceMutation
                    .mutateAsync(data._id)
                    .then((blob) => {
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `fatura-${data._id}.pdf`
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                    })
            }),
            {
                loading: "Gerando fatura...",
                success: "Fatura baixada com sucesso!",
                error: "Erro ao gerar fatura.",
            }
        )
    }

    // 4. Suporte Prioritário
    const handlePrioritySupport = async () => {
        setLoadingStates((s) => ({ ...s, support: true }))

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Simulate opening support ticket
            const ticketNumber = Math.random().toString(36).substr(2, 8).toUpperCase()

            toast.success(`Ticket de suporte #${ticketNumber} criado. Nossa equipe entrará em contato em até 30 minutos.`)

            // Simulate opening WhatsApp
            const message = encodeURIComponent("Olá! Preciso de suporte prioritário para minha conta Neemble Eat.")
            window.open(`https://wa.me/244923456789?text=${message}`, "_blank")
        } catch {
            toast.error("Erro ao abrir suporte. Tente novamente.")
        } finally {
            setLoadingStates((s) => ({ ...s, support: false }))
        }
    }

    // 5. Convidar Amigos
    const handleInviteFriends = async () => {
        setLoadingStates((s) => ({ ...s, invite: true }))

        try {
            await new Promise((resolve) => setTimeout(resolve, 800))
            setShowInviteDialog(true)
            toast.info("Compartilhe seu código de indicação e ganhe benefícios!")
        } catch {
            toast.error("Erro ao carregar programa de indicação.")
        } finally {
            setLoadingStates((s) => ({ ...s, invite: false }))
        }
    }

    // Copy referral code
    const copyReferralCode = async () => {
        try {
            await navigator.clipboard.writeText("NEEMBLE-REF-2025")
            setCopiedCode(true)
            toast.success("Código copiado para a área de transferência!")
            setTimeout(() => setCopiedCode(false), 2000)
        } catch {
            toast.error("Erro ao copiar código.")
        }
    }

    // 6. Pausar Conta Temporariamente
    const handlePauseAccount = async () => {
        showPromiseToast(
            pauseSubscriptionMutation.mutateAsync().then(() => {
                setShowPauseDialog(false)
            }),
            {
                loading: "Enviando solicitação...",
                success: "Subscrição pausada",
                error: "Erro ao pausar conta.",
            }
        )
    }

    // 7. Backup de Dados
    const handleBackupData = async () => {
        showPromiseToast(
            backupAccountMutation.mutateAsync().then((blob) => {
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `backup-${new Date().toISOString().split("T")[0]}.json`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            }),
            {
                loading: "Gerando backup...",
                success: "Backup baixado com sucesso!",
                error: "Erro ao realizar backup.",
            }
        )
    }

    // 8. Chat ao Vivo
    const handleLiveChat = async () => {
        setLoadingStates((s) => ({ ...s, chat: true }))

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Simulate opening chat widget
            toast.info("Conectando com suporte ao vivo...")

            setTimeout(() => {
                toast.success("Conectado! Um agente estará com você em instantes.")
                // Here you would typically initialize a chat widget like Intercom, Zendesk, etc.
            }, 2000)
        } catch {
            toast.error("Erro ao conectar com chat. Tente novamente.")
        } finally {
            setLoadingStates((s) => ({ ...s, chat: false }))
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setUploadedFile(file)
        }
    }

    const handlePlanChange = async () => {
        if (!selectedPlan) return
        showPromiseToast(
            changePlanMutation.mutateAsync({ planId: selectedPlan }).then(() => {
                setShowPlanChangeDialog(false)
                setSelectedPlan(null)
            }),
            {
                loading: "Solicitando mudança...",
                success: "Plano alterado com sucesso!",
                error: "Falha ao alterar plano.",
            }
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ativa":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativa</Badge>
            case "pendente":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>
            case "suspensa":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspensa</Badge>
            case "pago":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pago</Badge>
            case "em_falta":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Em Falta</Badge>
            case "em_analise":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Em Análise</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getUsagePercentage = (used: number, limit: number) => {
        if (limit === -1) return 0 // Unlimited
        return Math.min((used / limit) * 100, 100)
    }

    const formatLimit = (limit: number) => {
        return limit === -1 ? "Ilimitado" : limit.toString()
    }

    return (
        <div className="">
            <Toaster position="top-right" />
            {/* Main Content */}
            <div className="">
                <div className=" mx-auto">

                    {/* Payment Alert */}
                    <Alert className="mb-6 border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                            <strong>Atenção:</strong> O não pagamento até ao dia 31 de Julho implica a suspensão temporária da conta.
                        </AlertDescription>
                    </Alert>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="">
                            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                            <TabsTrigger value="plans">Planos</TabsTrigger>
                            <TabsTrigger value="history">Histórico</TabsTrigger>
                            <TabsTrigger value="settings">Configurações</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Current Plan */}
                                <div className="lg:col-span-2 space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Crown className="h-5 w-5 text-yellow-600" />
                                                Plano Atual
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{currentPlan?.name}</h3>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        Kz {currentPlan?.price}
                                                        <span className="text-sm font-normal text-gray-500">/mês</span>
                                                    </p>
                                                </div>
                                                {currentSubscription && getStatusBadge(currentSubscription.status)}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                Período de vigência: {currentSubscription?.startDate} a {currentSubscription?.endDate}
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-medium text-sm">Funcionalidades incluídas:</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {(currentPlan?.features || []).map((feature, index) => (
                                                        <li key={index} className="flex items-center gap-2">
                                                            <Check className="h-3 w-3 text-green-600" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Usage Metrics */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <BarChart3 className="h-5 w-5" />
                                                Uso do Plano
                                            </CardTitle>
                                            <CardDescription>Acompanhe o uso dos recursos do seu plano atual.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Restaurantes</span>
                                                        <span>
                              {usageMetrics?.restaurants.used}/{formatLimit(usageMetrics?.restaurants.limit ?? 0)}
                            </span>
                                                    </div>
                                                    <Progress
                                                        value={getUsagePercentage(usageMetrics?.restaurants.used ?? 0, usageMetrics?.restaurants.limit ?? 0)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Membros da Equipe</span>
                                                        <span>
                              {usageMetrics?.staff.used}/{formatLimit(usageMetrics?.staff.limit ?? 0)}
                            </span>
                                                    </div>
                                                    <Progress value={getUsagePercentage(usageMetrics?.staff.used ?? 0, usageMetrics?.staff.limit ?? 0)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Mesas</span>
                                                        <span>
                              {usageMetrics?.tables.used}/{formatLimit(usageMetrics?.tables.limit ?? 0)}
                            </span>
                                                    </div>
                                                    <Progress value={getUsagePercentage(usageMetrics?.tables.used ?? 0, usageMetrics?.tables.limit ?? 0)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Reservas (este mês)</span>
                                                        <span>
                              {usageMetrics?.reservations.used}/{formatLimit(usageMetrics?.reservations.limit ?? 0)}
                            </span>
                                                    </div>
                                                    <Progress
                                                        value={getUsagePercentage(usageMetrics?.reservations.used ?? 0, usageMetrics?.reservations.limit ?? 0)}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Sidebar Actions */}
                                <div className="space-y-6">
                                    {/* Quick Actions */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {/* 1. Submeter Comprovativo */}
                                            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                                                <DialogTrigger asChild>
                                                    <Button className="w-full" disabled={uploadPaymentProof.isPending}>
                                                        {uploadPaymentProof.isPending ? (
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <Upload className="h-4 w-4 mr-2" />
                                                        )}
                                                        Submeter Comprovativo
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>Submeter Comprovativo de Pagamento</DialogTitle>
                                                        <DialogDescription>
                                                            Preencha os dados do pagamento e anexe o comprovativo.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="holderName">Nome do Titular *</Label>
                                                            <Input
                                                                id="holderName"
                                                                value={paymentForm.holderName}
                                                                onChange={(e) => setPaymentForm({ ...paymentForm, holderName: e.target.value })}
                                                                placeholder="Nome completo do titular"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="paymentReference">Referência do Pagamento</Label>
                                                            <Input
                                                                id="paymentReference"
                                                                value={paymentForm.paymentReference}
                                                                onChange={(e) => setPaymentForm({ ...paymentForm, paymentReference: e.target.value })}
                                                                placeholder="Referência (opcional)"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="paymentDate">Data do Pagamento *</Label>
                                                            <Input
                                                                id="paymentDate"
                                                                type="date"
                                                                value={paymentForm.paymentDate}
                                                                onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="amountPaid">Valor Pago *</Label>
                                                            <Input
                                                                id="amountPaid"
                                                                value={paymentForm.amountPaid}
                                                                onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
                                                                placeholder="Kz 28.000"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="receipt">Comprovativo *</Label>
                                                            <Input
                                                                id="receipt"
                                                                type="file"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                onChange={handleFileUpload}
                                                                required
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">PDF, JPEG, PNG (máx. 5MB)</p>
                                                            {uploadedFile && (
                                                                <p className="text-xs text-green-600 mt-1">Arquivo selecionado: {uploadedFile.name}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="notes">Observações</Label>
                                                            <Textarea
                                                                id="notes"
                                                                value={paymentForm.notes}
                                                                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                                                                placeholder="Informações adicionais (opcional)"
                                                                rows={3}
                                                            />
                                                        </div>
                                                        <Button
                                                            onClick={handleSubmitPayment}
                                                            disabled={uploadPaymentProof.isPending}
                                                            className="w-full"
                                                        >
                                                            {uploadPaymentProof.isPending ? (
                                                                <>
                                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                    Enviando...
                                                                </>
                                                            ) : (
                                                                "Submeter Comprovativo"
                                                            )}
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            {/* 2. Fazer Upgrade */}
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={handleUpgrade}
                                            >
                                                <ArrowUpCircle className="h-4 w-4 mr-2" />
                                                Fazer Upgrade
                                            </Button>

                                            {/* 3. Solicitar Fatura */}
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={handleRequestInvoice}
                                                disabled={downloadInvoiceMutation.isPending}
                                            >
                                                {downloadInvoiceMutation.isPending ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <FileText className="h-4 w-4 mr-2" />
                                                )}
                                                Solicitar Fatura
                                            </Button>

                                            {/* 4. Suporte Prioritário */}
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={handlePrioritySupport}
                                                disabled={loadingStates.support}
                                            >
                                                {loadingStates.support ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <MessageCircle className="h-4 w-4 mr-2" />
                                                )}
                                                Suporte Prioritário
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    {/* Referral Program */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Gift className="h-5 w-5 text-purple-600" />
                                                Programa de Indicação
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <p className="text-sm text-gray-600">
                                                Indique amigos e ganhe 1 mês gratuito para cada novo cliente!
                                            </p>
                                            <div className="p-3 bg-purple-50 rounded-lg">
                                                <p className="text-xs font-medium text-purple-700 mb-1">Seu código de indicação:</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-mono text-purple-800 flex-1">NEEMBLE-REF-2025</p>
                                                    <Button variant="ghost" size="sm" onClick={copyReferralCode} className="h-6 w-6 p-0">
                                                        {copiedCode ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* 5. Convidar Amigos */}
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={handleInviteFriends}
                                                disabled={loadingStates.invite}
                                            >
                                                {loadingStates.invite ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Users className="h-4 w-4 mr-2" />
                                                )}
                                                Convidar Amigos
                                            </Button>

                                            {/* Invite Friends Dialog */}
                                            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Convidar Amigos</DialogTitle>
                                                        <DialogDescription>
                                                            Compartilhe o Neemble Eat com seus amigos e ganhe benefícios!
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                                                            <h4 className="font-medium mb-2">Como funciona:</h4>
                                                            <ul className="text-sm text-gray-600 space-y-1">
                                                                <li>• Compartilhe seu código de indicação</li>
                                                                <li>• Seu amigo se cadastra usando o código</li>
                                                                <li>• Vocês dois ganham 1 mês grátis!</li>
                                                            </ul>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Compartilhar via:</Label>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    className="flex-1"
                                                                    onClick={() => {
                                                                        const text = `Experimente o Neemble Eat! Use meu código NEEMBLE-REF-2025 e ganhe 1 mês grátis. https://neemble.com/signup`
                                                                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
                                                                    }}
                                                                >
                                                                    WhatsApp
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    className="flex-1"
                                                                    onClick={() => {
                                                                        const text = `Experimente o Neemble Eat! Use meu código NEEMBLE-REF-2025 e ganhe 1 mês grátis.`
                                                                        window.open(
                                                                            `mailto:?subject=Convite Neemble Eat&body=${encodeURIComponent(text)}`,
                                                                            "_blank",
                                                                        )
                                                                    }}
                                                                >
                                                                    Email
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="plans" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {availablePlans.map((plan) => (
                                    <Card key={plan._id} className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <Badge className="bg-blue-500 text-white">Mais Popular</Badge>
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                {plan._id === "enterprise" && <Crown className="h-5 w-5 text-yellow-600" />}
                                                {plan._id === "professional" && <Star className="h-5 w-5 text-blue-600" />}
                                                {plan._id === "basic" && <Zap className="h-5 w-5 text-green-600" />}
                                                {plan.name}
                                            </CardTitle>
                                            <div className="text-2xl font-bold">
                                                {plan.price}
                                                <span className="text-sm font-normal text-gray-500">/mês</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <ul className="space-y-2">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm">
                                                        <Check className="h-3 w-3 text-green-600" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Dialog open={showPlanChangeDialog} onOpenChange={setShowPlanChangeDialog}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        className="w-full"
                                                        variant={plan._id === "professional" ? "default" : "outline"}
                                                        onClick={() => setSelectedPlan(plan._id)}
                                                        disabled={plan._id === "professional"}
                                                    >
                                                        {plan._id === "professional" ? "Plano Atual" : "Solicitar Mudança"}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Solicitar Mudança de Plano</DialogTitle>
                                                        <DialogDescription>
                                                            Você está solicitando mudança para o{" "}
                                                            {availablePlans?.find((p) => p._id === selectedPlan)?.name}.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                            <h4 className="font-medium mb-2">Detalhes da mudança:</h4>
                                                            <p className="text-sm text-gray-600">
                                                                Plano atual: {currentPlan?.name} (Kz {currentPlan?.price}/mês)
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Novo plano: {availablePlans?.find((p) => p._id === selectedPlan)?.name} (
                                                                {availablePlans?.find((p) => p._id === selectedPlan)?.price}/mês)
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="changeReason">Motivo da mudança (opcional)</Label>
                                                            <Textarea
                                                                id="changeReason"
                                                                placeholder="Descreva o motivo da mudança de plano..."
                                                                rows={3}
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={handlePlanChange}
                                                                disabled={changePlanMutation.isPending}
                                                                className="flex-1"
                                                            >
                                                                {changePlanMutation.isPending ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        Processando...
                                                                    </>
                                                                ) : (
                                                                    "Confirmar Mudança"
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => setShowPlanChangeDialog(false)}
                                                                className="flex-1"
                                                            >
                                                                Cancelar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="history" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Histórico de Pagamentos</CardTitle>
                                    <CardDescription>Acompanhe todos os seus pagamentos e comprovativos.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Mês/Período</TableHead>
                                                <TableHead>Valor</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Data de Pagamento</TableHead>
                                                <TableHead>Comprovativo</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(paymentHistory || []).map((payment) => (
                                                <TableRow key={payment._id}>
                                                    <TableCell className="font-medium">{payment.period}</TableCell>
                                                    <TableCell>{payment.amount}</TableCell>
                                                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                                    <TableCell>{payment.paymentDate}</TableCell>
                                                    <TableCell>
                                                        {payment.receiptUrl ? (
                                                            <Button variant="ghost" size="sm">
                                                                <Download className="h-4 w-4 mr-1" />
                                                                Download
                                                            </Button>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">N/A</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Subscription Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="h-5 w-5" />
                                            Configurações da Subscrição
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="auto-renewal">Renovação Automática</Label>
                                                <p className="text-sm text-gray-500">Renovar automaticamente no final do período</p>
                                            </div>
                                            <Switch id="auto-renewal" checked={autoRenewal} onCheckedChange={setAutoRenewal} />
                                        </div>
                                        <div className="space-y-3">
                                            {/* 6. Pausar Conta Temporariamente */}
                                            <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start" disabled={pauseSubscriptionMutation.isPending}>
                                                        {pauseSubscriptionMutation.isPending ? (
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <Pause className="h-4 w-4 mr-2" />
                                                        )}
                                                        Pausar Conta Temporariamente
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Pausar Conta Temporariamente</DialogTitle>
                                                        <DialogDescription>
                                                            Sua conta será pausada e você não será cobrado durante este período.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <Alert className="border-yellow-200 bg-yellow-50">
                                                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                                            <AlertDescription className="text-yellow-800">
                                                                <strong>Atenção:</strong> Durante a pausa, você não terá acesso ao sistema e seus dados
                                                                ficarão inativos.
                                                            </AlertDescription>
                                                        </Alert>
                                                        <div>
                                                            <Label htmlFor="pauseReason">Motivo da pausa (opcional)</Label>
                                                            <Textarea id="pauseReason" placeholder="Descreva o motivo da pausa..." rows={3} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={handlePauseAccount}
                                                                disabled={pauseSubscriptionMutation.isPending}
                                                                className="flex-1"
                                                                variant="destructive"
                                                            >
                                                                {pauseSubscriptionMutation.isPending ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                        Pausando...
                                                                    </>
                                                                ) : (
                                                                    "Confirmar Pausa"
                                                                )}
                                                            </Button>
                                                            <Button variant="outline" onClick={() => setShowPauseDialog(false)} className="flex-1">
                                                                Cancelar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            {/* 7. Backup de Dados */}
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start"
                                                onClick={handleBackupData}
                                                disabled={backupAccountMutation.isPending}
                                            >
                                                {backupAccountMutation.isPending ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Shield className="h-4 w-4 mr-2" />
                                                )}
                                                Backup de Dados
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Notification Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Bell className="h-5 w-5" />
                                            Preferências de Notificação
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="email-notifications">Email</Label>
                                                <p className="text-sm text-gray-500">Receber notificações por email</p>
                                            </div>
                                            <Switch
                                                id="email-notifications"
                                                checked={notifications.email}
                                                onCheckedChange={(checked) => {
                                                    setNotifications({ ...notifications, email: checked })
                                                    toast.success(`Notificações por email ${checked ? "ativadas" : "desativadas"}`)
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="sms-notifications">SMS</Label>
                                                <p className="text-sm text-gray-500">Receber notificações por SMS</p>
                                            </div>
                                            <Switch
                                                id="sms-notifications"
                                                checked={notifications.sms}
                                                onCheckedChange={(checked) => {
                                                    setNotifications({ ...notifications, sms: checked })
                                                    toast.success(`Notificações por SMS ${checked ? "ativadas" : "desativadas"}`)
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="whatsapp-notifications">WhatsApp</Label>
                                                <p className="text-sm text-gray-500">Receber notificações via WhatsApp</p>
                                            </div>
                                            <Switch
                                                id="whatsapp-notifications"
                                                checked={notifications.whatsapp}
                                                onCheckedChange={(checked) => {
                                                    setNotifications({ ...notifications, whatsapp: checked })
                                                    toast.success(`Notificações por WhatsApp ${checked ? "ativadas" : "desativadas"}`)
                                                }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment Methods */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Formas de Pagamento</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                                            <CreditCard className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm font-medium">Multicaixa Express</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                                            <Building2 className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-medium">Transferência Bancária</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                                            <Banknote className="h-5 w-5 text-orange-600" />
                                            <span className="text-sm font-medium">Dinheiro</span>
                                        </div>

                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs font-medium text-gray-700 mb-2">IBAN Neemble Eat:</p>
                                            <p className="text-xs text-gray-600 font-mono">AO06 0040 0000 1234 5678 9012 3</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Para pagamento em dinheiro, contacte-nos previamente.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Customer Support */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Apoio ao Cliente</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-gray-600" />
                                            <div>
                                                <p className="text-sm font-medium">Email</p>
                                                <p className="text-xs text-gray-600">financeiro@neemble.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-gray-600" />
                                            <div>
                                                <p className="text-sm font-medium">WhatsApp</p>
                                                <p className="text-xs text-gray-600">+244 923 456 789</p>
                                            </div>
                                        </div>

                                        {/* 8. Chat ao Vivo */}
                                        <Button
                                            variant="outline"
                                            className="w-full mt-4"
                                            onClick={handleLiveChat}
                                            disabled={loadingStates.chat}
                                        >
                                            {loadingStates.chat ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                            )}
                                            Chat ao Vivo
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
