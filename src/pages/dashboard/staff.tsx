import { useState } from "react"
import { User } from "@/types/user"
import { Sections} from "@/types/role"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Invitation, InvitationCreate } from "@/types/invitation"

import {
    Plus,
    Copy,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { showSuccessToast, showPromiseToast } from "@/utils/notifications/toast"
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
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {PermissionGate} from "@/components/ui/permission-gate";





function StaffContent() {
    const {
        searchTerm,
        statusFilter,
        sortField,
        sortDirection,
        currentPage,
        itemsPerPage,
        viewMode,
        inviteForm,
        setInviteForm,
        isInviteDialogOpen,
        setIsInviteDialogOpen,

    } = useDashboardStaff()

    const isMobile = useIsMobile()


    const { restaurant, user } = useDashboardContext()

    const {
        data: roles,
    } = useListRestaurantRoles(restaurant._id)

    const filteredRoles = (roles ?? []).filter(r => r.name !== "no_role")

    const { data: users = [] } = useGetAllMembers({
        restaurantId: restaurant._id
    })

    const { data: invitations = [] } = useGetRestaurantInvitations(restaurant._id)

    const queryClient = useQueryClient()
    const [newInvitation, setNewInvitation] = useState<Invitation | null>(null)


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


    return (
        <div className="">
            <div className="">
                <div className="">
                    <Stats />

                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">Equipa do Restaurante</h1>
                            <div className="flex flex-col sm:flex-row gap-2">
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


                    <PermissionGate section={Sections.USERS} operation={"view"} mode={"hide"}>
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
                    </PermissionGate>
                    <PermissionGate section={Sections.USERS} operation={"view"} mode={"hide"}>
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
                    </PermissionGate>


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
