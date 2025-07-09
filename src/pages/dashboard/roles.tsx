import {useState} from "react"
import {Sections, RoleCreate, Role, SectionPermission, PartialRole} from "@/types/role"
import {getSectionLabel} from "@/lib/helpers/section-label"
import {useDashboardContext} from "@/context/dashboard-context"
import {useListRestaurantRoles} from "@/hooks/use-list-restaurant-roles"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Label} from "@/components/ui/label"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Checkbox} from "@/components/ui/checkbox"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useMutation} from "@tanstack/react-query"
import {roleApi} from "@/api/endpoints/role/requests"
import {useUpdateRole} from "@/api/endpoints/role/hook"
import {showSuccessToast, showErrorToast} from "@/utils/notifications/toast"
import {PermissionGate} from "@/components/ui/permission-gate"

const defaultSectionPermissions: SectionPermission[] = [
    { section: Sections.MENUS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.CATEGORIES, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.ITEMS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.CUSTOMIZATIONS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.ORDERS, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.CUSTOMER_ORDERS_SUMMARY, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.TABLE_QR_ACCESS_CONTROL, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.KITCHEN_VIEW, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.BAR_VIEW, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.ORDER_QUEUE, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.TABLES, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.RESERVATIONS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.USERS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.ROLES, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.PERMISSIONS, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.SALES_DASHBOARD, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.INVOICES, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.PAYMENTS, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.REPORTS, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.PERFORMANCE_INSIGHTS, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.PRODUCT_POPULARITY, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.REVENUE_TRENDS, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.CUSTOMER_FEEDBACK, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.RESTAURANT_SETTINGS, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.OPENING_HOURS, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.PRINTER_SETUP, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.TABLE_QR_CONFIGURATION, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.PROMOTIONS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.ANNOUNCEMENTS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.CUSTOMER_REVIEWS, permissions: { canView: true, canEdit: true, canDelete: true } },
    { section: Sections.SYSTEM_LOGS, permissions: { canView: true, canEdit: false, canDelete: false } },
    { section: Sections.INTEGRATION_SETTINGS, permissions: { canView: true, canEdit: true, canDelete: false } },
    { section: Sections.HELP_REQUESTS, permissions: { canView: true, canEdit: true, canDelete: true } },
]

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

export default function RolesPage() {
    const { restaurant } = useDashboardContext()
    const { data: roles, addRole, removeRole, updateRole } = useListRestaurantRoles(restaurant._id)

    const [roleForm, setRoleForm] = useState<RoleCreate>({
        name: "",
        description: "",
        permissions: [],
        restaurantId: restaurant._id,
        level: 0,
    })
    const [newPermission, setNewPermission] = useState<SectionPermission>({
        section: "",
        permissions: { canView: false, canEdit: false, canDelete: false },
    })
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)

    const createRole = useCreateRole()
    const updateRoleMutation = useUpdateRole(restaurant._id)

    const handleRolePermissionToggle = (section: string) => {
        const sectionPermission: SectionPermission = {
            section,
            permissions: { canView: true, canEdit: false, canDelete: false }
        }
        setRoleForm({
            ...roleForm,
            permissions: roleForm.permissions.some(p => p.section === sectionPermission.section)
                ? roleForm.permissions.filter(p => p.section !== sectionPermission.section)
                : [...roleForm.permissions, sectionPermission]
        })
    }

    const handleCreateRole = () => {
        createRole.mutate({
            ...roleForm,
            restaurantId: restaurant._id
        }, {
            onSuccess: (newRole) => {
                addRole(newRole)
                setRoleForm({ name: "", description: "", permissions: [], restaurantId: restaurant._id, level: 0 })
            }
        })
    }

    const handleDeleteRole = (roleId: string) => {
        roleApi.deleteRole(roleId).then(() => removeRole(roleId))
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

    const togglePermission = (index: number, perm: keyof SectionPermission["permissions"]) => {
        const permissions = roleForm.permissions.map((p, i) => {
            if (i !== index) return p
            return {
                ...p,
                permissions: { ...p.permissions, [perm]: !p.permissions[perm] }
            }
        })
        setRoleForm({ ...roleForm, permissions })
    }

    const handleRemovePermission = (index: number) => {
        setRoleForm(prev => ({ ...prev, permissions: prev.permissions.filter((_, i) => i !== index) }))
    }

    const handleToggleNewPerm = (perm: keyof SectionPermission["permissions"]) => {
        setNewPermission(prev => ({
            ...prev,
            permissions: { ...prev.permissions, [perm]: !prev.permissions[perm] }
        }))
    }

    const handleAddPermission = () => {
        if (!newPermission.section) return
        setRoleForm({ ...roleForm, permissions: [...roleForm.permissions, newPermission] })
        setNewPermission({ section: "", permissions: { canView: false, canEdit: false, canDelete: false } })
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
                setRoleForm({ name: "", description: "", permissions: [], restaurantId: restaurant._id, level: 0 })
            }
        })
    }

    const groupedPermissions = defaultSectionPermissions.reduce(
        (acc: Record<string, SectionPermission[]>, permission) => {
            const category = permission.section.split('_')[0]
            if (!acc[category]) acc[category] = []
            acc[category].push(permission)
            return acc
        },
        {} as Record<string, SectionPermission[]>
    )

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Funções</h1>
            <Tabs defaultValue="existing" className="w-full">
                <TabsList>
                    <TabsTrigger value="existing">Funções Existentes</TabsTrigger>
                    <TabsTrigger value="create">Criar Nova</TabsTrigger>
                </TabsList>

                <TabsContent value="existing" className="space-y-4">
                    <div className="space-y-3  overflow-y-auto">
                        {roles?.filter(r => r.name !== "no_role").map(role => (
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
                                        Editar
                                    </Button>
                                    <PermissionGate section={Sections.ROLES} operation="update" mode="disable">
                                        <div></div>
                                    </PermissionGate>
                                    <PermissionGate section={Sections.ROLES} operation="delete" mode="disable">
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role._id)} className="text-red-600">
                                            Remover
                                        </Button>
                                    </PermissionGate>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="create" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="roleName">Nome da Função</Label>
                            <Input id="roleName" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} placeholder="Ex: Supervisor de Turno" />
                        </div>
                        <div>
                            <Label htmlFor="roleLevel">Nível</Label>
                            <Input id="roleLevel" type="number" value={roleForm.level} onChange={(e) => setRoleForm({ ...roleForm, level: Number(e.target.value) })} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="roleDescription">Descrição</Label>
                        <Textarea id="roleDescription" value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} placeholder="Descreva as responsabilidades desta função..." />
                    </div>
                    <div>
                        <Label>Permissões</Label>
                        <div className="mt-2 space-y-4 overflow-y-auto">
                            {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                <div key={category}>
                                    <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
                                    <div className="space-y-2 ml-4">
                                        {permissions.map(permission => (
                                            <div key={permission.section} className="flex items-start space-x-2">
                                                <Checkbox
                                                    id={`role-${permission.section}`}
                                                    checked={roleForm.permissions.some(p => p.section === permission.section)}
                                                    onCheckedChange={() => handleRolePermissionToggle(permission.section)}
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <Label htmlFor={`role-${permission.section}`} className="text-sm font-medium leading-none">
                                                        {getSectionLabel(permission.section as Sections)}
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
                        <Button variant="outline" onClick={() => setRoleForm({ name: "", description: "", permissions: [], restaurantId: restaurant._id, level: 0 })}>Cancelar</Button>
                        <Button onClick={handleCreateRole}>Criar Função</Button>
                    </DialogFooter>
                </TabsContent>
            </Tabs>
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
                                            {getSectionLabel(perm.section as Sections)}
                                        </Label>
                                        <Button variant="ghost" size="sm" onClick={() => handleRemovePermission(idx)}>
                                            Remover
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
                            <Select value={newPermission.section} onValueChange={(value) => setNewPermission({ ...newPermission, section: value })}>
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
        </div>
    )
}
