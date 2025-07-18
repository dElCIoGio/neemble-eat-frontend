
import { useState, useEffect } from "react"
import { Check, Save} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {useDashboardContext} from "@/context/dashboard-context";
import {
    useUpdateRestaurantOpeningHours,
    useUpdateRestaurantBanner,
    useUpdateRestaurantLogo,
    useUpdateRestaurantAutomaticStock,
} from "@/api/endpoints/restaurants/hooks";
import {showPromiseToast, showErrorToast} from "@/utils/notifications/toast";
import { MAX_IMAGE_SIZE } from "@/utils/image/image-handler";
import {useQueryClient} from "@tanstack/react-query";
import {OpeningHours} from "@/types/restaurant";

export default function Settings() {
    const [saved, setSaved] = useState(false)

    const { restaurant } = useDashboardContext()
    const queryClient = useQueryClient()
    const updateOpeningHoursMutation = useUpdateRestaurantOpeningHours(restaurant._id)
    const updateBannerMutation = useUpdateRestaurantBanner(restaurant._id)
    const updateLogoMutation = useUpdateRestaurantLogo(restaurant._id)
    const updateAutomaticStockMutation = useUpdateRestaurantAutomaticStock(restaurant._id)

    const [openingHours, setOpeningHours] = useState<OpeningHours>(restaurant.settings.openingHours || {})
    const [automaticStock, setAutomaticStock] = useState<boolean>(
        restaurant.settings.automaticStockAdjustments,
    )

    const weekDayLabels: Record<string, string> = {
        sunday: "Domingo",
        monday: "Segunda-feira",
        tuesday: "Terça-feira",
        wednesday: "Quarta-feira",
        thursday: "Quinta-feira",
        friday: "Sexta-feira",
        saturday: "Sábado",
    }

    useEffect(() => {
        setOpeningHours(restaurant.settings.openingHours || {})
        setAutomaticStock(restaurant.settings.automaticStockAdjustments)
    }, [restaurant.settings.openingHours, restaurant.settings.automaticStockAdjustments])

    const handleSave = () => {
        const promise = updateOpeningHoursMutation
            .mutateAsync(openingHours)
            .then((updated) => {
                queryClient.setQueryData(["currentRestaurantId"], updated)
            })
        showPromiseToast(promise, {
            loading: "Atualizando horário...",
            success: "Horário atualizado com sucesso",
            error: "Erro ao atualizar horário",
        })
        promise.then(() => {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        })
    }

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > MAX_IMAGE_SIZE) {
            showErrorToast(`Banner deve ter no máximo ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`)
            return
        }
        const promise = updateBannerMutation
            .mutateAsync(file)
            .then((updated) => {
                queryClient.setQueryData(["currentRestaurantId"], updated)
            })
        showPromiseToast(promise, {
            loading: "Atualizando banner...",
            success: "Banner atualizado com sucesso",
            error: "Erro ao atualizar banner",
        })
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > MAX_IMAGE_SIZE) {
            showErrorToast(`Logo deve ter no máximo ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`)
            return
        }
        const promise = updateLogoMutation
            .mutateAsync(file)
            .then((updated) => {
                queryClient.setQueryData(["currentRestaurantId"], updated)
            })
        showPromiseToast(promise, {
            loading: "Atualizando logo...",
            success: "Logo atualizado com sucesso",
            error: "Erro ao atualizar logo",
        })
    }

    const handleAutomaticStockChange = (checked: boolean) => {
        setAutomaticStock(checked)
        const promise = updateAutomaticStockMutation
            .mutateAsync(checked)
            .then((updated) => {
                queryClient.setQueryData(["currentRestaurantId"], updated)
            })
        showPromiseToast(promise, {
            loading: "Atualizando configura\u00e7\u00e3o...",
            success: "Configura\u00e7\u00e3o de estoque atualizada",
            error: "Erro ao atualizar configura\u00e7\u00e3o",
        })
    }


    return (
        <div className="flex-1 overflow-auto">
            <div className="">
                <div className="mb-6 flex items-center justify-end">
                    <Button onClick={handleSave} className="bg-[#1a1a2e] hover:bg-[#2d2d44]">
                        {saved ? (
                            <>
                                <Check className="mr-2 h-4 w-4" /> Guardado
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Guardar alterações
                            </>
                        )}
                    </Button>
                </div>

                <Tabs defaultValue="geral">
                    <TabsList className="mb-4 w-full bg-transparent p-0">
                        <TabsTrigger
                            value="geral"
                            className=""
                        >
                            Geral
                        </TabsTrigger>
                        <TabsTrigger
                            value="restaurante"
                            className=""
                        >
                            Restaurante
                        </TabsTrigger>
                        <TabsTrigger
                            value="notificacoes"
                            className=""
                        >
                            Notificações
                        </TabsTrigger>
                        <TabsTrigger
                            value="integracao"
                            className=""
                        >
                            Integração
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="geral" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Restaurante</CardTitle>
                                <CardDescription>Atualize as informações básicas do seu restaurante.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="restaurant-name">Nome do Restaurante</Label>
                                        <Input id="restaurant-name" defaultValue={restaurant.name} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="restaurant-description">Descrição</Label>
                                    <textarea
                                        id="restaurant-description"
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        rows={3}
                                        defaultValue={restaurant.description}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="restaurant-phone">Telefone</Label>
                                        <Input id="restaurant-phone" type="tel" defaultValue={restaurant.phoneNumber} />
                                    </div>
                                    <div className="space-y-2 hidden">
                                        <Label htmlFor="restaurant-email">Email</Label>
                                        <Input id="restaurant-email" type="email"/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Endereço</CardTitle>
                                <CardDescription>Atualize o endereço do seu restaurante.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address-line1">Endereço</Label>
                                    <Input id="address-line1" placeholder={restaurant.address} />
                                </div>

                                {/* In the future i will include more details on the address*/}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 hidden">
                                    <div className="space-y-2">
                                        <Label htmlFor="address-city">Cidade</Label>
                                        <Input id="address-city" placeholder="Luanda" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address-state">Bairro</Label>
                                        <Input id="address-state" placeholder="Talatona" />
                                    </div>
                                    <div className="space-y-2 hidden">
                                        <Label htmlFor="address-zip">Código Postal</Label>
                                        <Input id="address-zip" placeholder="1000-001" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {
                        !!restaurant.settings.openingHours &&
                            <TabsContent value="restaurante" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Imagens</CardTitle>
                                        <CardDescription>Atualize o banner e o logo do restaurante.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="grid items-center gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Banner atual</Label>
                                                    <img
                                                        src={restaurant.bannerUrl || "/placeholder.svg"}
                                                        alt="Banner atual"
                                                        className="h-24 w-full rounded-md border object-cover"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="banner-upload">Novo banner</Label>
                                                    <Input
                                                        id="banner-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleBannerChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid items-center gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Logo atual</Label>
                                                    <img
                                                        src={restaurant.logoUrl || "/placeholder.svg"}
                                                        alt="Logo atual"
                                                        className="h-20 w-20 rounded-md border object-cover"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="logo-upload">Novo logo</Label>
                                                    <Input
                                                        id="logo-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleLogoChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Horário de Funcionamento</CardTitle>
                                        <CardDescription>
                                            Configure os horários de funcionamento do seu restaurante.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">


                                            {
                                                [
                                                    "sunday",
                                                    "monday",
                                                    "tuesday",
                                                    "wednesday",
                                                    "thursday",
                                                    "friday",
                                                    "saturday",
                                                ].map((day) => {
                                                    const key = day as keyof typeof weekDayLabels
                                                    const value = openingHours[key as keyof typeof openingHours]
                                                    const [open, close] = value ? value.split("-") : ["10:00", "22:00"]
                                                    return (
                                                        <div key={day} className="flex items-center justify-between border-b pb-2">
                                                            <div className="flex items-center gap-4">
                                                                <Switch id={`day-${day}`}
                                                                        checked={!!value}
                                                                        onCheckedChange={(checked) => {
                                                                            setOpeningHours(prev => ({
                                                                                ...prev,
                                                                                [key]: checked ? `${open}-${close}` : undefined,
                                                                            }))
                                                                        }}/>
                                                                <Label htmlFor={`day-${day}`}>{weekDayLabels[key]}</Label>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Select value={open}
                                                                        onValueChange={(val) => setOpeningHours(prev => ({
                                                                            ...prev,
                                                                            [day]: `${val}-${close}`,
                                                                        }))}
                                                                        disabled={!value}
                                                                >
                                                                    <SelectTrigger className="w-24">
                                                                        <SelectValue placeholder="Abertura"/>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Array.from({length: 14}, (_, i) => i + 8).map((hour) => (
                                                                            <SelectItem key={hour} value={`${hour}:00`}>
                                                                                {`${hour}:00`}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <span>até</span>
                                                                <Select value={close}
                                                                        onValueChange={(val) => setOpeningHours(prev => ({
                                                                            ...prev,
                                                                            [day]: `${open}-${val}`,
                                                                        }))}
                                                                        disabled={!value}
                                                                >
                                                                    <SelectTrigger className="w-24">
                                                                        <SelectValue placeholder="Fecho"/>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Array.from({length: 10}, (_, i) => i + 16).map((hour) => (
                                                                            <SelectItem key={hour} value={`${hour}:00`}>
                                                                                {`${hour}:00`}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    )
                                                })

                                            }


                                        </div>
                                    </CardContent>
                                </Card>


                                <Card>
                                    <CardHeader>
                                        <CardTitle>Inventário</CardTitle>
                                        <CardDescription>Opções relacionadas ao estoque.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="auto-reduce-stock" className="text-base">
                                                    Reduzir Estoque Automaticamente
                                                </Label>
                                                <p className="text-sm text-muted-foreground">Descontar itens de estoque ao vender um produto</p>
                                            </div>
                                            <Switch
                                                id="auto-reduce-stock"
                                                checked={automaticStock}
                                                onCheckedChange={handleAutomaticStockChange}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="hidden">
                                    <CardHeader>
                                        <CardTitle>Opções de Serviço</CardTitle>
                                        <CardDescription>Configure as opções de serviço disponíveis.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="service-dine-in" className="text-base">
                                                        Consumo no Local
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">Permitir pedidos para
                                                        consumo no restaurante</p>
                                                </div>
                                                <Switch id="service-dine-in" defaultChecked/>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="service-takeaway" className="text-base">
                                                        Takeaway
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">Permitir pedidos para
                                                        levar</p>
                                                </div>
                                                <Switch id="service-takeaway" defaultChecked/>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="service-delivery" className="text-base">
                                                        Entrega
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">Permitir pedidos para
                                                        entrega</p>
                                                </div>
                                                <Switch id="service-delivery" defaultChecked />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                    }



                    <TabsContent value="notificacoes" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notificações por Email</CardTitle>
                                <CardDescription>Configure quais notificações deseja receber por email.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="email-new-order" className="text-base">
                                                Novos Pedidos
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receber notificações quando houver novos pedidos
                                            </p>
                                        </div>
                                        <Switch id="email-new-order" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="email-canceled-order" className="text-base">
                                                Pedidos Cancelados
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receber notificações quando pedidos forem cancelados
                                            </p>
                                        </div>
                                        <Switch id="email-canceled-order" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="email-daily-summary" className="text-base">
                                                Resumo Diário
                                            </Label>
                                            <p className="text-sm text-muted-foreground">Receber um resumo diário das atividades</p>
                                        </div>
                                        <Switch id="email-daily-summary" defaultChecked />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notificações no Sistema</CardTitle>
                                <CardDescription>Configure quais notificações deseja receber no sistema.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="system-new-order" className="text-base">
                                                Novos Pedidos
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Mostrar notificações quando houver novos pedidos
                                            </p>
                                        </div>
                                        <Switch id="system-new-order" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="system-order-status" className="text-base">
                                                Alterações de Status
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Mostrar notificações quando o status de um pedido mudar
                                            </p>
                                        </div>
                                        <Switch id="system-order-status" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="system-low-stock" className="text-base">
                                                Estoque Baixo
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Mostrar notificações quando itens estiverem com estoque baixo
                                            </p>
                                        </div>
                                        <Switch id="system-low-stock" defaultChecked />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="integracao" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Integrações de Pagamento</CardTitle>
                                <CardDescription>Configure as integrações com provedores de pagamento.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                                                <svg viewBox="0 0 24 24" className="h-6 w-6">
                                                    <path
                                                        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                                                        fill="#6772E5"
                                                    />
                                                    <path
                                                        d="M13.5 9.5c0-.69-.31-1.25-.93-1.25-.62 0-1 .55-1.07 1.25H13.5zm-2 .75c0 .7.33 1.25.94 1.25.26 0 .48-.1.65-.26l.55.7c-.33.3-.75.46-1.2.46-1 0-1.79-.76-1.79-2.15 0-1.3.76-2.15 1.79-2.15.44 0 .85.16 1.18.46l-.55.7a.97.97 0 00-.63-.26c-.61 0-.94.56-.94 1.25zm3.5 1.4h-.9l1.75-4.3h.9l-1.75 4.3zm1.75 0h-.9l1.75-4.3h.9l-1.75 4.3zm.5-1.65c0-1.3.83-2.15 2.02-2.15 1.19 0 2.02.85 2.02 2.15 0 1.3-.83 2.15-2.02 2.15-1.19 0-2.02-.85-2.02-2.15zm3.04 0c0-.7-.37-1.25-1.02-1.25-.65 0-1.02.55-1.02 1.25 0 .7.37 1.25 1.02 1.25.65 0 1.02-.55 1.02-1.25zm-7.04-1.5c0-.69-.31-1.25-.93-1.25-.62 0-1 .55-1.07 1.25h2z"
                                                        fill="#FFF"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium">Stripe</p>
                                                <p className="text-sm text-muted-foreground">Processamento de pagamentos com cartão</p>
                                            </div>
                                        </div>
                                        <Switch id="stripe-integration" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                                                <svg viewBox="0 0 24 24" className="h-6 w-6">
                                                    <rect width="24" height="24" rx="4" fill="#003087" />
                                                    <path
                                                        d="M7.5 11.25h1.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5H7.5v3zm0 1.5H6v-6h3c1.66 0 3 1.34 3 3s-1.34 3-3 3zm6-4.5h-1.5v1.5h1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H12v1.5h1.5c1.66 0 3-1.34 3-3s-1.34-3-3-3z"
                                                        fill="#FFF"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium">PayPal</p>
                                                <p className="text-sm text-muted-foreground">Pagamentos via PayPal e carteiras digitais</p>
                                            </div>
                                        </div>
                                        <Switch id="paypal-integration" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                                                <svg viewBox="0 0 24 24" className="h-6 w-6">
                                                    <rect width="24" height="24" rx="4" fill="#5F259F" />
                                                    <path
                                                        d="M6.72 8.56h2.59c.71 0 1.25.2 1.6.59.36.39.52.87.52 1.44 0 .57-.17 1.03-.52 1.4-.34.36-.89.54-1.64.54H8.14v2.27H6.72V8.56zm1.42 1.08v1.81h.86c.71 0 1.06-.3 1.06-.9 0-.61-.35-.91-1.06-.91h-.86zm4.35-1.08h1.42v4.16h2.52v1.08h-3.94V8.56z"
                                                        fill="#FFF"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium">Multibanco</p>
                                                <p className="text-sm text-muted-foreground">Pagamentos via referência Multibanco</p>
                                            </div>
                                        </div>
                                        <Switch id="multibanco-integration" defaultChecked />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Integrações de Delivery</CardTitle>
                                <CardDescription>Configure as integrações com serviços de entrega.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                                                <svg viewBox="0 0 24 24" className="h-6 w-6">
                                                    <rect width="24" height="24" rx="4" fill="#00C2B3" />
                                                    <path
                                                        d="M7 7.5h10c.28 0 .5.22.5.5v8c0 .28-.22.5-.5.5H7c-.28 0-.5-.22-.5-.5V8c0-.28.22-.5.5-.5zm5 7.5c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"
                                                        fill="#FFF"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium">Glovo</p>
                                                <p className="text-sm text-muted-foreground">Integração com serviço de entrega Glovo</p>
                                            </div>
                                        </div>
                                        <Switch id="glovo-integration" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                                                <svg viewBox="0 0 24 24" className="h-6 w-6">
                                                    <rect width="24" height="24" rx="4" fill="#EA5252" />
                                                    <path
                                                        d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm2.39 9.5l-2.39-1.5-2.39 1.5.63-2.7-2.1-1.82 2.77-.24L12 9.17l1.09 2.57 2.77.24-2.1 1.82.63 2.7z"
                                                        fill="#FFF"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium">Uber Eats</p>
                                                <p className="text-sm text-muted-foreground">Integração com serviço de entrega Uber Eats</p>
                                            </div>
                                        </div>
                                        <Switch id="ubereats-integration" defaultChecked />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

