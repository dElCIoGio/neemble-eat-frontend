import { User } from "@/types/user"
import { RoleCreate, SectionPermission } from "@/types/role"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InvitationCreate } from "@/types/invitation"

import {
    Edit,
    Plus,
    Settings, Trash2,
} from "lucide-react"
import { roleApi } from "@/api/endpoints/role/requests"
import { useMutation } from "@tanstack/react-query"
import { showSuccessToast, showErrorToast, showPromiseToast } from "@/utils/notifications/toast"
import { invitationApi } from "@/api/endpoints/invitation/requests"
import { DashboardStaffProvider, useDashboardStaff } from "@/context/dashboard-staff-context"
import { Stats } from "@/components/pages/dashboard-staff/stats"
import { Filters } from "@/components/pages/dashboard-staff/filters"
import { BulkActions } from "@/components/pages/dashboard-staff/bulk-actions"
import { MembersTable } from "@/components/pages/dashboard-staff/members-table"
import { MemberCard } from "@/components/pages/dashboard-staff/member-card"
import { Pagination } from "@/components/pages/dashboard-staff/pagination"
import { useGetAllMembers } from "@/hooks/use-get-all-members"
import { useListRestaurantRoles } from "@/hooks/use-list-restaurant-roles"
import { useDashboardContext } from "@/context/dashboard-context"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";


const defaultSectionPermissions: SectionPermission[] = [
    // 🍽️ Menu & Ordering
    { section: "menus", permissions: ["view", "create", "update", "delete"] },
    { section: "categories", permissions: ["view", "create", "update", "delete"] },
    { section: "items", permissions: ["view", "create", "update", "delete"] },
    { section: "customizations", permissions: ["view", "create", "update", "delete"] },
    { section: "orders", permissions: ["view", "update"] },

    // 🛒 Customer Experience
    { section: "cart_view", permissions: ["view"] },
    { section: "customer_orders_summary", permissions: ["view"] },
    { section: "table_qr_access_control", permissions: ["view", "update"] },

    // 👨‍🍳 Restaurant Operations
    { section: "kitchen_view", permissions: ["view", "update"] },
    { section: "bar_view", permissions: ["view", "update"] },
    { section: "order_queue", permissions: ["view", "update"] },
    { section: "tables", permissions: ["view", "create", "update", "delete"] },
    { section: "reservations", permissions: ["view", "create", "update", "delete"] },

    // 👥 Team & Roles
    { section: "users", permissions: ["view", "create", "update", "delete"] },
    { section: "roles", permissions: ["view", "create", "update", "delete"] },
    { section: "permissions", permissions: ["view", "update"] },

    // 💳 Sales & Billing
    { section: "sales_dashboard", permissions: ["view"] },
    { section: "invoices", permissions: ["view", "update"] },
    { section: "payments", permissions: ["view"] },
    { section: "reports", permissions: ["view", "create"] },

    // 📊 Analytics & Insights
    { section: "performance_insights", permissions: ["view"] },
    { section: "product_popularity", permissions: ["view"] },
    { section: "revenue_trends", permissions: ["view"] },
    { section: "customer_feedback", permissions: ["view"] },

    // ⚙️ Settings & Config
    { section: "restaurant_settings", permissions: ["view", "update"] },
    { section: "opening_hours", permissions: ["view", "update"] },
    { section: "printer_setup", permissions: ["view", "update"] },
    { section: "table_qr_configuration", permissions: ["view", "update"] },

    // 📢 Marketing & Communication
    { section: "promotions", permissions: ["view", "create", "update", "delete"] },
    { section: "announcements", permissions: ["view", "create", "update", "delete"] },
    { section: "customer_reviews", permissions: ["view", "update", "delete"] },

    // 🛠️ Support & Maintenance
    { section: "system_logs", permissions: ["view"] },
    { section: "integration_settings", permissions: ["view", "update"] },
    { section: "help_requests", permissions: ["view", "update", "delete"] },
];

const useCreateRole = () => {
    return useMutation({
        mutationFn: (roleData: RoleCreate) => roleApi.createRole(roleData),
        onSuccess: () => {
            showSuccessToast("Função criada com sucesso")
        },
        onError: () => {
            showErrorToast("Erro ao criar função", "Tente novamente mais tarde")
        }
    })
}


function StaffContent() {
    const {
        searchTerm,
        statusFilter,
        sortField,
        sortDirection,
        currentPage,
        itemsPerPage,
        inviteForm,
        setInviteForm,
        roleForm,
        setRoleForm,
        setIsRoleDialogOpen,
        isRoleDialogOpen,
        isInviteDialogOpen,
        setIsInviteDialogOpen,

    } = useDashboardStaff()

    const { restaurant, user } = useDashboardContext()

    const {
        data: roles,
        addRole,
        removeRole
    } = useListRestaurantRoles(restaurant._id)

    console.log("ROLES:", roles)

    const { data: users = [] } = useGetAllMembers({
        restaurantId: restaurant._id
    })

    const createRoleMutation = useCreateRole()

    const filteredMembers = users.filter((member) => {
        const matchesSearch =
            member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "todos" || member.isActive === (statusFilter === "ativo")
        return matchesSearch && matchesStatus
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

    const handleRoleChange = (roleName: string) => {
        const role = roles?.find((r) => r.name === roleName)
        if (role) {
            setInviteForm({
                ...inviteForm,
                role: roleName
            })
        }
    }

    const convertToSectionPermission = (section: string): SectionPermission => ({
        section,
        permissions: ["view"]
    })

    const handleRolePermissionToggle = (section: string) => {
        const sectionPermission = convertToSectionPermission(section)

        setRoleForm({
            ...roleForm,
            permissions: roleForm.permissions.some(p => p.section === sectionPermission.section)
                ? roleForm.permissions.filter((p) => p.section !== sectionPermission.section)
                : [...roleForm.permissions, sectionPermission]
        })
    }

    const handleInviteMember = () => {
        const invitationData: InvitationCreate = {
            name: "", // Required by InvitationCreate type
            email: inviteForm.email,
            role: inviteForm.role,
            managerId: user._id,
            restaurantId: restaurant._id
        }

        showPromiseToast(
            invitationApi.createInvitation(invitationData),
            {
                loading: `Criando convite...`,
                success: `Convite enviado com sucesso!`,
                error: "Falha ao criar o convite. Tente novamente."
            }
        )
    }


    const handleCreateRole = () => {
        const roleData: RoleCreate = {
            name: roleForm.name,
            description: roleForm.description,
            permissions: roleForm.permissions,
            color: roleForm.color
        }
        
        createRoleMutation.mutate(roleData, {
            onSuccess: (newRole) => {
                addRole(newRole)
                setIsRoleDialogOpen(false)
                setRoleForm({
                    name: "",
                    description: "",
                    permissions: [],
                    color: "bg-gray-100 text-gray-800"
                })
            }
        })
    }

    const handleDeleteRole = (roleId: string) => {

        setIsRoleDialogOpen(true)

        showPromiseToast(
            roleApi.deleteRole(roleId)
                .then(() => {
                    removeRole(roleId)
                    setIsRoleDialogOpen(false)

                }).
                finally(() => setIsRoleDialogOpen(false)
            ),
            {
                loading: `Eliminando cargo...`,
                success: `Cargo eliminado com sucesso!`,
                error: "Falha ao eliminar cargo. Tente novamente."
            }
        )
        setIsRoleDialogOpen(false)
    }



    const groupedPermissions = defaultSectionPermissions.reduce(
        (acc: Record<string, SectionPermission[]>, permission: SectionPermission) => {
            const category = permission.section.split('_')[0]
            if (!acc[category]) {
                acc[category] = []
            }
            acc[category].push(permission)
            return acc
        },
        {} as Record<string, SectionPermission[]>
    )

    return (
        <div className="">
            <div className="">
                <div className="">
                    <Stats />

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
                                            <TabsList className="">
                                                <TabsTrigger value="existing">Funções Existentes</TabsTrigger>
                                                <TabsTrigger value="create">Criar Nova</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="existing" className="space-y-4">
                                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                                    {roles.map((role) => (
                                                        <div key={role._id} className="flex items-center justify-between p-3 border rounded-lg">
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
                                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role._id)} className="text-red-600">
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
                                                            onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                                                            placeholder="Ex: Supervisor de Turno"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="roleColor">Cor</Label>
                                                        <Select
                                                            value={roleForm.color}
                                                            onValueChange={(value) => setRoleForm({ ...roleForm, color: value })}
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
                                                        onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                                                        placeholder="Descreva as responsabilidades desta função..."
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Permissões</Label>
                                                    <div className="mt-2 space-y-4 max-h-48 overflow-y-auto">
                                                        {Object.entries(groupedPermissions).map(([category, permissions]: [string, SectionPermission[]]) => (
                                                            <div key={category}>
                                                                <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
                                                                <div className="space-y-2 ml-4">
                                                                    {permissions.map((permission) => (
                                                                        <div key={permission.section} className="flex items-start space-x-2">
                                                                            <Checkbox
                                                                                id={`role-${permission.section}`}
                                                                                checked={roleForm.permissions.some((p) => p.section === permission.section)}
                                                                                onCheckedChange={() => handleRolePermissionToggle(permission.section)}
                                                                            />
                                                                            <div className="grid gap-1.5 leading-none">
                                                                                <Label
                                                                                    htmlFor={`role-${permission.section}`}
                                                                                    className="text-sm font-medium leading-none"
                                                                                >
                                                                                    {permission.section.replace(/_/g, ' ')}
                                                                                </Label>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    Permissões: {permission.permissions.join(', ')}
                                                                                </p>
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
                                                <div className="flex flex-col space-y-2">
                                                    <Label htmlFor="name">Nome Completo</Label>
                                                    <Input
                                                        id="name"
                                                        value={inviteForm.name}
                                                        onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                                                        placeholder="Digite o nome completo"
                                                    />
                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={inviteForm.email}
                                                        onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                                        placeholder="email@exemplo.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                <div className="flex flex-col space-y-2">
                                                    <Label htmlFor="role">Função</Label>
                                                    <Select value={inviteForm.role} onValueChange={handleRoleChange}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione uma função" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {roles.map((role) => (
                                                                <SelectItem key={role._id} value={role.name}>
                                                                    {role.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
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

                    <Filters />
                    <BulkActions />

                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg">Lista de Membros</CardTitle>
                                    <CardDescription>{sortedMembers.length} membro(s) encontrado(s)</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block">
                                <MembersTable />
                            </div>

                            {/* Mobile Cards View */}
                            <div className="lg:hidden space-y-4">
                                {paginatedMembers.map((member: User) => (
                                    <MemberCard 
                                        key={member._id} 
                                        member={member}
                                    />
                                ))}
                            </div>

                            <Pagination />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function Staff() {
    return (
        <DashboardStaffProvider>
            <StaffContent />
        </DashboardStaffProvider>
    )
}
