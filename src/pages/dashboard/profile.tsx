
import { useEffect, useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Code,
    CheckCircle,
    XCircle,
    Building2,
    Trash2,
    Bell,
    Moon,
    Globe,
} from "lucide-react"
import {Restaurant} from "@/types/restaurant";
import {User as UserType} from "@/types/user";
import {Role} from "@/types/role";
import { restaurantApi } from "@/api/endpoints/restaurants/requests";
import { roleApi } from "@/api/endpoints/role/requests";
import { useQueryClient } from "@tanstack/react-query";
import { showSuccessToast, showErrorToast } from "@/utils/notifications/toast";
import { useUpdatePreferences, useUpdateUser } from "@/api/endpoints/user/hooks";
import { Loader } from "@/components/ui/loader";
import {useDashboardContext} from "@/context/dashboard-context";

export default function UserProfile() {
    const {user} = useDashboardContext()
    const [roles, setRoles] = useState<Record<string, Role>>({})
    const [restaurants, setRestaurants] = useState<Record<string, Restaurant>>({})
    const queryClient = useQueryClient()
    const updatePreferencesMutation = useUpdatePreferences()
    const updateUserMutation = useUpdateUser()

    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        phoneNumber: user?.phoneNumber ?? "",
    })


    useEffect(() => {
        setEditData({
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            phoneNumber: user?.phoneNumber ?? "",
        })
        const load = async () => {
            if (!user) return
            try {
                const roleResults = await Promise.all(user.memberships.map(m => roleApi.getRole(m.roleId)))
                const roleMap: Record<string, Role> = {}
                roleResults.forEach(r => { roleMap[r._id] = r })
                setRoles(roleMap)

                const restaurantIds = Array.from(new Set(roleResults.map(r => r.restaurantId)))
                const restaurantResults = await Promise.all(restaurantIds.map(id => restaurantApi.getRestaurant(id)))
                const restaurantMap: Record<string, Restaurant> = {}
                restaurantResults.forEach(r => { restaurantMap[r._id] = r })
                setRestaurants(restaurantMap)
            } catch {
                showErrorToast("Falha ao carregar restaurantes do usuário")
            }
        }
        load()
    }, [user])

    const handleRemoveMembership = async (restaurantId: string) => {
        if (!user) return
        try {
            await restaurantApi.removeMember(restaurantId, user._id)
            queryClient.invalidateQueries({ queryKey: ["me"] })
            showSuccessToast("Associação de restaurante removida com sucesso")
        } catch {
            showErrorToast("Falha ao remover associação de restaurante")
        }
    }

    const handlePreferenceChange = (key: keyof UserType["preferences"], value: boolean | string) => {
        if (!user) return;
        const newPrefs = {
            ...user.preferences,
            [key]: value,
        }
        updatePreferencesMutation.mutate(newPrefs)
    }

    const handleSaveProfile = () => {
        if (!user) return
        updateUserMutation.mutate(
            { userId: user._id, data: editData },
            { onSuccess: () => setIsEditing(false) }
        )
    }

    const handleCancelEdit = () => {
        if (!user) return
        setEditData({
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
        })
        setIsEditing(false)
    }

    const restaurantMemberships = useMemo(() => {
        if (!user) return []
        return user.memberships
            .map((membership) => {
                const role = roles[membership.roleId]
                const restaurant = role ? restaurants[role.restaurantId] : undefined
                return { membership, role, restaurant }
            })
            .filter((item) => item.role && item.restaurant)
    }, [user, roles, restaurants])


    const formatDate = (date: Date) => {

        console.log("DATE")
        console.log(date)


        return new Intl.DateTimeFormat("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date)
    }

    if (!user) {
        return <Loader />
    }

    return (
        <div className="">
            <div className="">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfil do Usuário</h1>
                    <p className="text-gray-600">Gerencie suas informações de conta e associações de restaurantes</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - User Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informações Pessoais */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informações Pessoais
                                </CardTitle>
                                <CardDescription>Seus dados básicos de conta</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4 mb-6">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt={`${user.firstName} ${user.lastName}`} />
                                        <AvatarFallback className="text-lg">
                                            {user.firstName[0]}
                                            {user.lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                        {isEditing ? (
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <div className="space-y-1">
                                                    <Label htmlFor="firstName">Nome</Label>
                                                    <Input
                                                        id="firstName"
                                                        value={editData.firstName}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, firstName: e.target.value })
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="lastName">Sobrenome</Label>
                                                    <Input
                                                        id="lastName"
                                                        value={editData.lastName}
                                                        onChange={(e) =>
                                                            setEditData({ ...editData, lastName: e.target.value })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="text-xl font-semibold">
                                                    {user.firstName} {user.lastName}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {user.isVerified && (
                                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Verificado
                                                        </Badge>
                                                    )}
                                                    {user.isAdmin && (
                                                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                                            <Shield className="h-3 w-3 mr-1" />
                                                            Administrador
                                                        </Badge>
                                                    )}
                                                    {user.isDeveloper && (
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                            <Code className="h-3 w-3 mr-1" />
                                                            Desenvolvedor
                                                        </Badge>
                                                    )}
                                                    {!user.isActive && (
                                                        <Badge variant="destructive">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Inativo
                                                        </Badge>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="phoneNumber">Telefone</Label>
                                            <Input
                                                id="phoneNumber"
                                                value={editData.phoneNumber}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, phoneNumber: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={handleCancelEdit}>
                                                Cancelar
                                            </Button>
                                            <Button onClick={handleSaveProfile} disabled={updateUserMutation.isLoading}>
                                                Salvar
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Telefone</p>
                                                <p className="font-medium">{user.phoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Membro desde</p>
                                                <p className="font-medium">{formatDate(user.createdAt)}</p>
                                            </div>
                                        </div>
                                        {user.lastLogged && (
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Último Login</p>
                                                    <p className="font-medium">{formatDate(user.lastLogged)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Restaurant Memberships */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Associações de Restaurantes
                                </CardTitle>
                                <CardDescription>Restaurantes aos quais você está associado e seus papéis</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {restaurantMemberships.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">Nenhuma associação de restaurante encontrada</p>
                                    ) : (
                                        restaurantMemberships.map(({ membership, role, restaurant }) => (
                                            <div key={role!._id} className="border rounded-lg p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <img
                                                                src={restaurant!.logoUrl || "/placeholder.svg?height=40&width=40"}
                                                                alt={restaurant!.name}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                            <div>
                                                                <h4 className="font-semibold">{restaurant!.name}</h4>
                                                                <p className="text-sm text-gray-600">{restaurant!.address}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500">Função:</span>
                                                                <Badge variant="outline">{role!.name}</Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-gray-500">Status:</span>
                                                                <Badge variant={membership.isActive ? "default" : "secondary"}>
                                                                    {membership.isActive ? "Ativo" : "Inativo"}
                                                                </Badge>
                                                            </div>
                                                            {!restaurant!.isActive && <Badge variant="destructive">Restaurante Inativo</Badge>}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-2">{role!.description}</p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleRemoveMembership(restaurant!._id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Remover
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Coluna Direita - Preferências & Status */}
                    <div className="space-y-6">
                        {/* Status da Conta */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status da Conta</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Conta Ativa</span>
                                    {user.isActive ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Email Verificado</span>
                                    {user.isVerified ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Onboarding Completo</span>
                                    {user.isOnboardingCompleted ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preferências */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferências</CardTitle>
                                <CardDescription>Personalize sua experiência</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        <Label htmlFor="notifications">Notificações</Label>
                                    </div>
                                    <Switch
                                        id="notifications"
                                        checked={user.preferences.notificationsEnabled}
                                        onCheckedChange={(checked) => handlePreferenceChange("notificationsEnabled", checked)}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" />
                                        <Label htmlFor="darkmode">Modo Escuro</Label>
                                    </div>
                                    <Switch
                                        id="darkmode"
                                        checked={user.preferences.darkMode}
                                        onCheckedChange={(checked) => handlePreferenceChange("darkMode", checked)}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        <div>
                                            <Label>Idioma</Label>
                                            <p className="text-sm text-gray-500">{user.preferences.language}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Alterar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ações Rápidas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ações Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {isEditing ? (
                                    <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleCancelEdit}>
                                        Cancelar Edição
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => setIsEditing(true)}>
                                        Editar Perfil
                                    </Button>
                                )}
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    Alterar Senha
                                </Button>
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    Baixar Dados
                                </Button>
                                <Button variant="destructive" className="w-full justify-start">
                                    Excluir Conta
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
