import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { User } from "@/types/user"
import { Role as RoleType, SectionPermission } from "@/types/role"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {

    Edit,
    Mail,
    MoreHorizontal,
    Phone,
    Plus,
    Search,
    Settings,
    Trash2,
    Users,
    Clock,
    Eye,
    RefreshCw,
    Download,
    Upload,
    BarChart3,
    UserPlus,
    UserMinus,
    CheckCircle,
    XCircle,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import {useGetAllMembers} from "@/api/endpoints/restaurants/hooks";
import {useDashboardContext} from "@/context/dashboard-context";


interface Permission {
    id: string
    name: string
    description: string
    category: string
}


const availablePermissions: Permission[] = [
    {
        id: "view_orders",
        name: "Visualizar Pedidos",
        description: "Ver todos os pedidos do restaurante",
        category: "Pedidos",
    },
    { id: "manage_orders", name: "Gerir Pedidos", description: "Criar, editar e cancelar pedidos", category: "Pedidos" },
    { id: "edit_menu", name: "Editar Menu", description: "Adicionar, editar e remover itens do menu", category: "Menu" },
    {
        id: "viewytics",
        name: "Ver Analíticos",
        description: "Acesso ao painel de análise e relatórios",
        category: "Relatórios",
    },
    {
        id: "manage_team",
        name: "Gerir Equipa",
        description: "Adicionar, remover e editar membros da equipa",
        category: "Administração",
    },
    {
        id: "manage_reservations",
        name: "Gerir Reservas",
        description: "Criar, editar e cancelar reservas",
        category: "Reservas",
    },
    {
        id: "manage_payments",
        name: "Gerir Pagamentos",
        description: "Processar pagamentos e reembolsos",
        category: "Financeiro",
    },
    {
        id: "manage_inventory",
        name: "Gerir Inventário",
        description: "Controlar stock e fornecedores",
        category: "Inventário",
    },
    {
        id: "view_reports",
        name: "Ver Relatórios",
        description: "Acesso a relatórios básicos",
        category: "Relatórios",
    },
]

const defaultRoles: RoleType[] = [
    {
        id: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: "Gestor Geral",
        description: "Acesso completo ao sistema",
        permissions: [
            {
                id: "1",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                section: "all",
                permissions: ["view", "create", "update", "delete"]
            }
        ]
    },
    {
        id: "2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: "Chef Principal",
        description: "Responsável pela cozinha e menu",
        permissions: [
            {
                id: "2",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                section: "menu",
                permissions: ["view", "update"]
            }
        ]
    },
    {
        id: "3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: "Atendimento",
        description: "Atendimento ao cliente e reservas",
        permissions: [
            {
                id: "3",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                section: "all",
                permissions: ["view", "create", "update", "delete"]
            }
        ]
    },
    {
        id: "4",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: "Caixa",
        description: "Gestão de pagamentos",
        permissions: [
            {
                id: "4",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                section: "all",
                permissions: ["view", "create", "update", "delete"]
            }
        ]
    },
]

type SortableUserFields = keyof Pick<User, 'firstName' | 'lastName' | 'email' | 'isActive' | 'updatedAt'>

export default function Staff() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("todos")
    const [departmentFilter, setDepartmentFilter] = useState("todos")
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
    const [, setSelectedMember] = useState<User | null>(null)
    const [, setIsEditDialogOpen] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState<string[]>([])
    const [sortField, setSortField] = useState<SortableUserFields>("firstName")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [roles, setRoles] = useState<RoleType[]>(defaultRoles)
    const [viewMode, setViewMode] = useState<"table" | "cards">("table")

    const {
        restaurant
    } = useDashboardContext()

    // Form states
    const [inviteForm, setInviteForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        permissions: [] as SectionPermission[]
    })

    const [roleForm, setRoleForm] = useState({
        name: "",
        description: "",
        permissions: [] as SectionPermission[],
        color: "bg-gray-100 text-gray-800"
    })

    const {
        data: users = []
    } = useGetAllMembers({
        restaurantId: restaurant._id
    })


    const filteredMembers = users.filter((member) => {
        const matchesSearch =
            member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "todos" || member.isActive === (statusFilter === "ativo")
        const matchesDepartment = departmentFilter === "todos" || member.currentRestaurantId === departmentFilter
        return matchesSearch && matchesStatus && matchesDepartment
    })

    const sortedMembers = [...filteredMembers].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]
        
        if (aValue === undefined || bValue === undefined) return 0
        
        if (sortDirection === "asc") {
            return String(aValue) < String(bValue) ? -1 : String(aValue) > String(bValue) ? 1 : 0
        } else {
            return String(aValue) > String(bValue) ? -1 : String(aValue) < String(bValue) ? 1 : 0
        }
    })

    const paginatedMembers = sortedMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const totalPages = Math.ceil(sortedMembers.length / itemsPerPage)

    const departments = Array.from(new Set(users.map((member) => member.currentRestaurantId).filter(Boolean)))

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ativo":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
            case "pendente":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>
            case "desativado":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Desativado</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const handleRoleChange = (roleName: string) => {
        const role = roles.find((r) => r.name === roleName)
        if (role) {
            setInviteForm((prev) => ({
                ...prev,
                role: roleName,
                permissions: role.permissions
            }))
        }
    }

    const convertToSectionPermission = (permission: Permission): SectionPermission => ({
        id: permission.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        section: permission.category,
        permissions: ["view"] // Default to view permission
    })

    const handlePermissionToggle = (permission: Permission) => {
        const sectionPermission = convertToSectionPermission(permission)
        setInviteForm((prev) => ({
            ...prev,
            permissions: prev.permissions.some(p => p.id === sectionPermission.id)
                ? prev.permissions.filter((p) => p.id !== sectionPermission.id)
                : [...prev.permissions, sectionPermission]
        }))
    }

    const handleRolePermissionToggle = (permission: Permission) => {
        const sectionPermission = convertToSectionPermission(permission)
        setRoleForm((prev) => ({
            ...prev,
            permissions: prev.permissions.some(p => p.id === sectionPermission.id)
                ? prev.permissions.filter((p) => p.id !== sectionPermission.id)
                : [...prev.permissions, sectionPermission]
        }))
    }

    const handleInviteMember = () => {
        console.log("Convidar membro:", inviteForm)
        toast.success("Convite enviado", {
            description: `Convite enviado para ${inviteForm.email}`,
        })
        setIsInviteDialogOpen(false)
        setInviteForm({ name: "", email: "", phone: "", role: "", department: "", permissions: [] })
    }

    const handleCreateRole = () => {
        const newRole: RoleType = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            name: roleForm.name,
            description: roleForm.description,
            permissions: roleForm.permissions
        }
        setRoles([...roles, newRole])
        toast.success("Função criada", {
            description: `A função "${roleForm.name}" foi criada com sucesso`,
        })
        setIsRoleDialogOpen(false)
        setRoleForm({ 
            name: "", 
            description: "", 
            permissions: [], 
            color: "bg-gray-100 text-gray-800" 
        })
    }

    const handleEditMember = (member: User) => {
        setSelectedMember(member)
        setIsEditDialogOpen(true)
    }

    const handleSort = (field: SortableUserFields) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const handleSelectMember = (memberId: string) => {
        setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
    }

    const handleSelectAll = () => {
        if (selectedMembers.length === paginatedMembers.length) {
            setSelectedMembers([])
        } else {
            setSelectedMembers(paginatedMembers.map((member) => member.id))
        }
    }

    const handleBulkAction = (action: string) => {
        toast.success("Ação executada", {
            description: `${action} aplicado a ${selectedMembers.length} membro(s)`,
        })
        setSelectedMembers([])
    }

    const groupedPermissions = availablePermissions.reduce(
        (acc, permission) => {
            if (!acc[permission.category]) {
                acc[permission.category] = []
            }
            acc[permission.category].push(permission)
            return acc
        },
        {} as Record<string, Permission[]>,
    )

    const stats = {
        total: users.length,
        active: users.filter((m) => m.isActive).length,
        pending: users.filter((m) => !m.isActive && m.isVerified).length,
        inactive: users.filter((m) => !m.isActive && !m.isVerified).length,
    }


    const getRoleName = (roleId: string | undefined): string => {
        if (!roleId) return "Sem função"
        const role = roles.find(r => r.id === roleId)
        return role?.name || "Sem função"
    }

    const MemberCard = ({ member }: { member: User }) => (
        <Card className="p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleSelectMember(member.id)}
                    />
                    <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                            {`${member.firstName[0]}${member.lastName[0]}`.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{`${member.firstName} ${member.lastName}`}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditMember(member)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Permissões
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Redefinir Senha
                        </DropdownMenuItem>
                        {!member.isVerified && (
                            <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Reenviar Convite
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Função:</span>
                    <Badge variant="outline">
                        {getRoleName(member.memberships[0]?.roleId)}
                    </Badge>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Estado:</span>
                    {getStatusBadge(member.isActive ? "ativo" : "desativado")}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Último acesso:</span>
                    <span className="text-sm">{format(member.updatedAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <Phone className="w-3 h-3" />
                    {member.phoneNumber}
                </div>
            </div>
        </Card>
    )

    return (
        <div className="">

            <div className="">

                <div className="">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total</p>
                                        <p className="text-2xl font-bold">{stats.total}</p>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Ativos</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Pendentes</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Inativos</p>
                                        <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                                    </div>
                                    <XCircle className="w-8 h-8 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">Equipa do Restaurante</h1>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full sm:w-auto">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Gerir Funções
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Gerir Funções</DialogTitle>
                                            <DialogDescription>Crie e edite funções personalizadas para a sua equipa.</DialogDescription>
                                        </DialogHeader>

                                        <Tabs defaultValue="existing" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="existing">Funções Existentes</TabsTrigger>
                                                <TabsTrigger value="create">Criar Nova</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="existing" className="space-y-4">
                                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                                    {roles.map((role) => (
                                                        <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge className={roleForm.color}>{role.name}</Badge>
                                                                    <Badge variant="outline">Personalizada</Badge>
                                                                </div>
                                                                <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                                                <p className="text-xs text-gray-500 mt-1">{role.permissions.length} permissões</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button variant="ghost" size="sm">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="sm" className="text-red-600">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="create" className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="roleName">Nome da Função</Label>
                                                        <Input
                                                            id="roleName"
                                                            value={roleForm.name}
                                                            onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))}
                                                            placeholder="Ex: Supervisor de Turno"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="roleColor">Cor</Label>
                                                        <Select
                                                            value={roleForm.color}
                                                            onValueChange={(value) => setRoleForm((prev) => ({ ...prev, color: value }))}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="bg-blue-100 text-blue-800">Azul</SelectItem>
                                                                <SelectItem value="bg-green-100 text-green-800">Verde</SelectItem>
                                                                <SelectItem value="bg-purple-100 text-purple-800">Roxo</SelectItem>
                                                                <SelectItem value="bg-orange-100 text-orange-800">Laranja</SelectItem>
                                                                <SelectItem value="bg-pink-100 text-pink-800">Rosa</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label htmlFor="roleDescription">Descrição</Label>
                                                    <Textarea
                                                        id="roleDescription"
                                                        value={roleForm.description}
                                                        onChange={(e) => setRoleForm((prev) => ({ ...prev, description: e.target.value }))}
                                                        placeholder="Descreva as responsabilidades desta função..."
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Permissões</Label>
                                                    <div className="mt-2 space-y-4 max-h-48 overflow-y-auto">
                                                        {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                                            <div key={category}>
                                                                <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
                                                                <div className="space-y-2 ml-4">
                                                                    {permissions.map((permission) => (
                                                                        <div key={permission.id} className="flex items-start space-x-2">
                                                                            <Checkbox
                                                                                id={`role-${permission.id}`}
                                                                                checked={roleForm.permissions.some(p => p.id === permission.id)}
                                                                                onCheckedChange={() => handleRolePermissionToggle(permission)}
                                                                            />
                                                                            <div className="grid gap-1.5 leading-none">
                                                                                <Label
                                                                                    htmlFor={`role-${permission.id}`}
                                                                                    className="text-sm font-medium leading-none"
                                                                                >
                                                                                    {permission.name}
                                                                                </Label>
                                                                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                                                        Cancelar
                                                    </Button>
                                                    <Button onClick={handleCreateRole}>Criar Função</Button>
                                                </DialogFooter>
                                            </TabsContent>
                                        </Tabs>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-black hover:bg-gray-800 w-full sm:w-auto">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Convidar Membro
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Convidar Novo Membro</DialogTitle>
                                            <DialogDescription>
                                                Adicione um novo membro à equipa do restaurante e defina as suas permissões.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="name">Nome Completo</Label>
                                                    <Input
                                                        id="name"
                                                        value={inviteForm.name}
                                                        onChange={(e) => setInviteForm((prev) => ({ ...prev, name: e.target.value }))}
                                                        placeholder="Digite o nome completo"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={inviteForm.email}
                                                        onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                                                        placeholder="email@exemplo.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="phone">Telefone</Label>
                                                    <Input
                                                        id="phone"
                                                        value={inviteForm.phone}
                                                        onChange={(e) => setInviteForm((prev) => ({ ...prev, phone: e.target.value }))}
                                                        placeholder="+351 912 345 678"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="department">Departamento</Label>
                                                    <Select
                                                        value={inviteForm.department}
                                                        onValueChange={(value) => setInviteForm((prev) => ({ ...prev, department: value }))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Administração">Administração</SelectItem>
                                                            <SelectItem value="Cozinha">Cozinha</SelectItem>
                                                            <SelectItem value="Atendimento">Atendimento</SelectItem>
                                                            <SelectItem value="Financeiro">Financeiro</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="role">Função</Label>
                                                    <Select value={inviteForm.role} onValueChange={handleRoleChange}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione uma função" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {roles.map((role) => (
                                                                <SelectItem key={role.id} value={role.name}>
                                                                    {role.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div>
                                                <Label>Permissões</Label>
                                                <div className="mt-2 space-y-4 max-h-48 overflow-y-auto border rounded-lg p-4">
                                                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                                        <div key={category}>
                                                            <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
                                                            <div className="space-y-2 ml-4">
                                                                {permissions.map((permission) => (
                                                                    <div key={permission.id} className="flex items-start space-x-2">
                                                                        <Checkbox
                                                                            id={permission.id}
                                                                            checked={inviteForm.permissions.some(p => p.id === permission.id)}
                                                                            onCheckedChange={() => handlePermissionToggle(permission)}
                                                                        />
                                                                        <div className="grid gap-1.5 leading-none">
                                                                            <Label htmlFor={permission.id} className="text-sm font-medium leading-none">
                                                                                {permission.name}
                                                                            </Label>
                                                                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                                                Cancelar
                                            </Button>
                                            <Button onClick={handleInviteMember}>Enviar Convite</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <p className="text-gray-600">Gerir membros da equipa, permissões e acessos do restaurante.</p>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg">Filtros</CardTitle>
                                    <CardDescription>Pesquise e filtre os membros da equipa por critérios específicos.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={viewMode === "table" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode("table")}
                                        className="hidden lg:flex"
                                    >
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        Tabela
                                    </Button>
                                    <Button
                                        variant={viewMode === "cards" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode("cards")}
                                        className="lg:hidden"
                                    >
                                        Cards
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                <div className="lg:col-span-2">
                                    <Label htmlFor="search">Pesquisar por nome ou email</Label>
                                    <div className="relative mt-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            id="search"
                                            placeholder="Digite o nome ou email do membro..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="status">Estado</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="ativo">Ativo</SelectItem>
                                            <SelectItem value="pendente">Pendente</SelectItem>
                                            <SelectItem value="desativado">Desativado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="department">Departamento</Label>
                                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept || 'default'} value={dept || 'default'}>
                                                    {dept || 'Sem departamento'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bulk Actions */}
                    {selectedMembers.length > 0 && (
                        <Card className="mb-6 border-blue-200 bg-blue-50">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{selectedMembers.length} membro(s) selecionado(s)</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleBulkAction("Ativar")}>
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Ativar
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleBulkAction("Desativar")}>
                                            <UserMinus className="w-4 h-4 mr-2" />
                                            Desativar
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleBulkAction("Exportar")}>
                                            <Download className="w-4 h-4 mr-2" />
                                            Exportar
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Team Members List */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg">Lista de Membros</CardTitle>
                                    <CardDescription>{sortedMembers.length} membro(s) encontrado(s)</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Importar
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Exportar
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={selectedMembers.length === paginatedMembers.length && paginatedMembers.length > 0}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort("firstName")} className="h-auto p-0 font-medium">
                                                    Membro
                                                    <ArrowUpDown className="w-4 h-4 ml-2" />
                                                </Button>
                                            </TableHead>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort("email")} className="h-auto p-0 font-medium">
                                                    Função
                                                    <ArrowUpDown className="w-4 h-4 ml-2" />
                                                </Button>
                                            </TableHead>
                                            <TableHead>Contacto</TableHead>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort("isActive")} className="h-auto p-0 font-medium">
                                                    Estado
                                                    <ArrowUpDown className="w-4 h-4 ml-2" />
                                                </Button>
                                            </TableHead>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort("updatedAt")} className="h-auto p-0 font-medium">
                                                    Último Acesso
                                                    <ArrowUpDown className="w-4 h-4 ml-2" />
                                                </Button>
                                            </TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedMembers.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedMembers.includes(member.id)}
                                                        onCheckedChange={() => handleSelectMember(member.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src="/placeholder.svg" />
                                                            <AvatarFallback>
                                                                {`${member.firstName[0]}${member.lastName[0]}`.toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{`${member.firstName} ${member.lastName}`}</div>
                                                            <div className="text-sm text-gray-500">{member.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <Badge variant="outline">
                                                            {getRoleName(member.memberships[0]?.roleId)}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Mail className="w-3 h-3" />
                                                            {member.email}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Phone className="w-3 h-3" />
                                                            {member.phoneNumber}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(member.isActive ? "ativo" : "desativado")}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Clock className="w-3 h-3" />
                                                        {format(member.updatedAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleEditMember(member)}>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Ver Permissões
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                                Redefinir Senha
                                                            </DropdownMenuItem>
                                                            {!member.isVerified && (
                                                                <DropdownMenuItem>
                                                                    <Mail className="w-4 h-4 mr-2" />
                                                                    Reenviar Convite
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Remover
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Cards View */}
                            <div className="lg:hidden space-y-4">
                                {paginatedMembers.map((member) => (
                                    <MemberCard key={member.id} member={member} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-500">
                                        Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                                        {Math.min(currentPage * itemsPerPage, sortedMembers.length)} de {sortedMembers.length} resultados
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <span className="text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
