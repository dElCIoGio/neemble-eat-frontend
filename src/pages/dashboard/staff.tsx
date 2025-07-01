import { useState } from "react"
import { User } from "@/types/user"
import {RoleCreate, SectionPermission, Role, PartialRole, Sections} from "@/types/role"
import { getSectionLabel } from "@/lib/helpers/section-label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Invitation, InvitationCreate } from "@/types/invitation"

import {
    Edit,
    Plus,
    Settings,
    Trash2,
    Copy,
} from "lucide-react"
import { roleApi } from "@/api/endpoints/role/requests"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useUpdateRole } from "@/api/endpoints/role/hook"
import { showSuccessToast, showErrorToast, showPromiseToast } from "@/utils/notifications/toast"
import { invitationApi } from "@/api/endpoints/invitation/requests"
import { useGetRestaurantInvitations } from "@/hooks/use-get-restaurant-invitations"
import { InvitationsTable } from "@/components/pages/dashboard-staff/invitations-table"
import { InvitationCard } from "@/components/pages/dashboard-staff/invitation-card"
import { DashboardStaffProvider, useDashboardStaff } from "@/context/dashboard-staff-context"
import { Stats } from "@/components/pages/dashboard-staff/stats"
import { Filters } from "@/components/pages/dashboard-staff/filters"
import { MembersTable } from "@/components/pages/dashboard-staff/members-table"
import { MemberCard } from "@/components/pages/dashboard-staff/member-card"
import { Pagination } from "@/components/pages/dashboard-staff/pagination"
import { useGetAllMembers } from "@/hooks/use-get-all-members"
import { useListRestaurantRoles } from "@/hooks/use-list-restaurant-roles"
import { useDashboardContext } from "@/context/dashboard-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { copyToClipboard } from "@/lib/helpers/copy-to-clipboard"
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
    // 🍽️ RestaurantMenu & Ordering
    { section: Sections.MENUS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.CATEGORIES, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.ITEMS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.CUSTOMIZATIONS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.ORDERS, permissions: { canView: true, canEdit: true, canDelete: false } },

    // 🛒 Customer Experience
    { section: Sections.CUSTOMER_ORDERS_SUMMARY, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.TABLE_QR_ACCESS_CONTROL, permissions: { canView: true, canEdit: true, canDelete: false } },

    // 👨‍🍳 Restaurant Operations
    { section: Sections.KITCHEN_VIEW, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.BAR_VIEW, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.ORDER_QUEUE, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.TABLES, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.RESERVATIONS, permissions: { canView: true, canEdit: true, canDelete: true } },

    // 👥 Team & Roles
    { section: Sections.USERS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.ROLES, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.PERMISSIONS, permissions: { canView: true, canEdit: true, canDelete: false } },

    // 💳 Sales & Billing
    { section: Sections.SALES_DASHBOARD, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.INVOICES, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.PAYMENTS, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.REPORTS, permissions: { canView: true, canEdit: true, canDelete: false } },

    // 📊 Analytics & Insights
    { section: Sections.PERFORMANCE_INSIGHTS, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.PRODUCT_POPULARITY, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.REVENUE_TRENDS, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.CUSTOMER_FEEDBACK, permissions: { canView: true, canEdit: false, canDelete: false } },

    // ⚙️ Settings & Config
    { section: Sections.RESTAURANT_SETTINGS, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.OPENING_HOURS, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.PRINTER_SETUP, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.TABLE_QR_CONFIGURATION, permissions: { canView: true, canEdit: true, canDelete: false } },

    // 📢 Marketing & Communication
    { section: Sections.PROMOTIONS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.ANNOUNCEMENTS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.CUSTOMER_REVIEWS, permissions: { canView: true, canEdit: true, canDelete: true } },

    // 🛠️ Support & Maintenance
    { section: Sections.SYSTEM_LOGS, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.INTEGRATION_SETTINGS, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.HELP_REQUESTS, permissions: { canView: true, canEdit: true, canDelete: true } },
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
        viewMode,
        setViewMode,
        inviteForm,
        setInviteForm,
        roleForm,
        setRoleForm,
        setIsRoleDialogOpen,
        isRoleDialogOpen,
        isInviteDialogOpen,
        setIsInviteDialogOpen,
        editingRole,
        setEditingRole,
        isEditRoleDialogOpen,
        setIsEditRoleDialogOpen,

    } = useDashboardStaff()

    const isMobile = useIsMobile()


    const { restaurant, user } = useDashboardContext()

    const {
        data: roles,
        addRole,
        removeRole,
        updateRole
    } = useListRestaurantRoles(restaurant._id)

    const filteredRoles = (roles ?? []).filter(r => r.name !== "no_role")

    const { data: users = [] } = useGetAllMembers({
        restaurantId: restaurant._id
    })

    const { data: invitations = [] } = useGetRestaurantInvitations(restaurant._id)

    const queryClient = useQueryClient()
    const [newInvitation, setNewInvitation] = useState<Invitation | null>(null)

    const createRoleMutation = useCreateRole()
    const updateRoleMutation = useUpdateRole(restaurant._id)
    const [newPermission, setNewPermission] = useState<SectionPermission>({
        section: "",
        permissions: {
            canView: false,
            canEdit: false,
            canDelete: false,
        }
    })

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

    const handleRoleChange = (roleId: string) => {
        const role = roles?.find((r) => r._id === roleId)
        if (role) {
            setInviteForm({
                ...inviteForm,
                roleId: roleId
            })
        }
    }

    const convertToSectionPermission = (section: string): SectionPermission => ({
        section,
        permissions: {
            canView: true,
            canEdit: false,
            canDelete: false,
        }
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
            name: inviteForm.name,
            roleId: inviteForm.roleId,
            managerId: user._id,
            restaurantId: restaurant._id
        }

        showPromiseToast(
            invitationApi.createInvitation(invitationData).then((invitation) => {
                setNewInvitation(invitation)
                queryClient.invalidateQueries({ queryKey: ["invitations", restaurant._id] })
                return invitation
            }),
            {
                loading: `Criando convite...`,
                success: `Convite enviado com sucesso!`,
                error: "Falha ao criar o convite. Tente novamente."
            }
        )
    }


    const handleCreateRole = () => {
        const roleData: RoleCreate = {
            level: roleForm.level,
            name: roleForm.name,
            description: roleForm.description,
            permissions: roleForm.permissions,
            restaurantId: restaurant._id
        }
        
        createRoleMutation.mutate(roleData, {
            onSuccess: (newRole) => {
                addRole(newRole)
                setIsRoleDialogOpen(false)
                setRoleForm({
                    name: "",
                    description: "",
                    permissions: [],
                    restaurantId: restaurant._id,
                    level: 0
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

    const handleEditRole = (role: Role) => {
        setEditingRole(role)
        setRoleForm({
            name: role.name,
            description: role.description,
            permissions: role.permissions,
            restaurantId: role.restaurantId,
            level: role.level
        })
        setIsEditRoleDialogOpen(true)
    }

    const togglePermission = (
        index: number,
        perm: keyof SectionPermission["permissions"]
    ) => {
        const permissions = roleForm.permissions.map((p, i) => {
            if (i !== index) return p
            return {
                ...p,
                permissions: {
                    ...p.permissions,
                    [perm]: !p.permissions[perm],
                },
            }
        })
        setRoleForm({ ...roleForm, permissions })
    }

    const handleRemovePermission = (index: number) => {
        setRoleForm(prev => ({
            ...prev,
            permissions: prev.permissions.filter((_, i) => i !== index)
        }))
    }

    const handleToggleNewPerm = (
        perm: keyof SectionPermission["permissions"]
    ) => {
        setNewPermission(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [perm]: !prev.permissions[perm],
            },
        }))
    }

    const handleAddPermission = () => {
        if (!newPermission.section) return
        setRoleForm({
            ...roleForm,
            permissions: [...roleForm.permissions, newPermission]
        })
        setNewPermission({
            section: "",
            permissions: { canView: false, canEdit: false, canDelete: false },
        })
    }

    const handleSaveRole = () => {
        if (!editingRole) return
        const data: PartialRole = {
            name: roleForm.name,
            description: roleForm.description,
            permissions: roleForm.permissions,
            restaurantId: restaurant._id,
            level: roleForm.level,
        }
        updateRoleMutation.mutate({ roleId: editingRole._id, data }, {
            onSuccess: (updated) => {
                updateRole(updated)
                setIsEditRoleDialogOpen(false)
                setEditingRole(null)
                setRoleForm({
                    name: "",
                    description: "",
                    permissions: [],
                    restaurantId: restaurant._id,
                    level: 0
                })
            }
        })
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
                                                    {filteredRoles.map((role) => (
                                                        <div key={role._id} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge>{role.name}</Badge>
                                                                    <Badge variant="outline">Personalizada</Badge>
                                                                </div>
                                                                <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                                                <p className="text-xs text-gray-500 mt-1">{role.permissions.length} permissões</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
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
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                                        <Label htmlFor="roleLevel">Nível</Label>
                                                        <Input
                                                            id="roleLevel"
                                                            type="number"
                                                            value={roleForm.level}
                                                            onChange={(e) => setRoleForm({ ...roleForm, level: Number(e.target.value) })}
                                                        />
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
    {getSectionLabel(permission.section)}
                                                                                </Label>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    Permissões:
                                                                                    {permission.permissions.canView && ' ver'}
                                                                                    {permission.permissions.canEdit && ', editar'}
                                                                                    {permission.permissions.canDelete && ', eliminar'}
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
                                <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Editar Função</DialogTitle>
                                            <DialogDescription>Atualize nível e permissões desta função.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="edit-role-name">Nome</Label>
                                                    <Input id="edit-role-name" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} />
                                                </div>
                                                <div>
                                                    <Label htmlFor="edit-role-level">Nível</Label>
                                                    <Input id="edit-role-level" type="number" value={roleForm.level} onChange={(e) => setRoleForm({ ...roleForm, level: Number(e.target.value) })} />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="edit-role-description">Descrição</Label>
                                                <Textarea id="edit-role-description" value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} />
                                            </div>

                                            <div className="space-y-4">
                                                {roleForm.permissions.map((perm, idx) => (
                                                    <div key={perm.section} className="border p-3 rounded-lg space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="capitalize">
                                                                {getSectionLabel(perm.section)}
                                                            </Label>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemovePermission(idx)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-3 mt-2">
                                                            {(['canView','canEdit','canDelete'] as (keyof SectionPermission['permissions'])[]).map(p => (
                                                                <label key={p} className="flex items-center gap-2 text-sm">
                                                                    <Checkbox
                                                                        checked={perm.permissions[p]}
                                                                        onCheckedChange={() => togglePermission(idx, p)}
                                                                        id={`${perm.section}-${p}`}
                                                                    />
                                                                    {p.replace('can', '').toLowerCase()}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Novo Módulo</Label>
                                                <Select value={newPermission.section} onValueChange={(value) => setNewPermission({
                                                    ...newPermission,
                                                    section: value
                                                })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(Sections).map(sec => (
                                                            <SelectItem key={sec} value={sec}>{getSectionLabel(sec)}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    {(['canView','canEdit','canDelete'] as (keyof SectionPermission['permissions'])[]).map(p => (
                                                        <label key={p} className="flex items-center gap-2 text-sm">
                                                            <Checkbox
                                                                checked={newPermission.permissions[p]}
                                                                onCheckedChange={() => handleToggleNewPerm(p)}
                                                                id={`new-${p}`}/>
                                                            {p.replace('can', '').toLowerCase()}
                                                        </label>
                                                    ))}
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={handleAddPermission}>Adicionar Permissão</Button>
                                            </div>
                                        </div>
                                        <DialogFooter className="mt-4">
                                            <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>Cancelar</Button>
                                            <Button onClick={handleSaveRole}>Salvar</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Dialog
                                    open={isInviteDialogOpen}
                                    onOpenChange={(open) => {
                                        setIsInviteDialogOpen(open)
                                        if (!open) setNewInvitation(null)
                                    }}
                                >
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
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="flex flex-col space-y-2">
                                                    <Label htmlFor="name">Nome Completo</Label>
                                                    <Input
                                                        id="name"
                                                        value={inviteForm.name}
                                                        onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                                                        placeholder="Digite o nome completo"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                <div className="flex flex-col space-y-2">
                                                    <Label htmlFor="role">Função</Label>
                                                    <Select value={inviteForm.roleId} onValueChange={handleRoleChange}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione uma função" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {filteredRoles.map((role) => (
                                                                <SelectItem key={role._id} value={role._id}>
                                                                    {role.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                   </Select>
                                                </div>
                                            </div>

                                            {newInvitation && (
                                                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-md">
                                                    <Input
                                                        readOnly
                                                        value={`www.neemble-eat.com/invitation/${newInvitation._id}`}
                                                        className="cursor-text"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            copyToClipboard(`www.neemble-eat.com/invitation/${newInvitation._id}`)
                                                            showSuccessToast('Link copiado!')
                                                        }}
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
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
                            {viewMode === "table" && !isMobile ? (
                                <MembersTable />
                            ) : (
                                <div className="space-y-4">
                                    {paginatedMembers.map((member: User) => (
                                        <MemberCard key={member._id} member={member} />
                                    ))}
                                </div>
                            )}

                            <Pagination />
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg">Convites Pendentes</CardTitle>
                                    <CardDescription>{invitations.length} convite(s) pendente(s)</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {viewMode === "table" && !isMobile ? (
                                <InvitationsTable invitations={invitations} />
                            ) : (
                                <div className="space-y-4">
                                    {invitations.map((inv) => (
                                        <InvitationCard key={inv._id} invitation={inv} />
                                    ))}
                                </div>
                            )}
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
