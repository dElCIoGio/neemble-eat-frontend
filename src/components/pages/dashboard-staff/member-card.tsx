import { useState } from "react"
import { User } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Eye, MoreHorizontal, Phone, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useDashboardStaff } from "@/context/dashboard-staff-context"
import { useDashboardContext } from "@/context/dashboard-context"
import { useListRestaurantRoles } from "@/hooks/use-list-restaurant-roles"
import { getSectionLabel } from "@/lib/helpers/section-label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface MemberCardProps {
    member: User
}

export function MemberCard({ member }: MemberCardProps) {
    const {
        selectedMembers,
        handleSelectMember,
        handleEditMember,
        handleDeleteMember,
        getRoleName,
        getStatusBadge
    } = useDashboardStaff()
    const { restaurant, user: currentUser } = useDashboardContext()
    const { data: roles } = useListRestaurantRoles(restaurant._id)

    const membership = member.memberships[0]
    const role = roles?.find((r) => r._id === membership?.roleId)
    const roleName = role?.name === "no_role" || !role ? "Sem função" : role.name

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    function handleViewPermissions() {
        setIsMenuOpen(false)
        setIsSheetOpen(true)
    }

    return (
        <>
        <Card className="p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={selectedMembers.includes(member._id)}
                        onCheckedChange={() => handleSelectMember(member._id)}
                    />
                    <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>
                            {`${member.firstName[0]}${member.lastName[0]}`.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="font-medium">
                                        {member._id === currentUser._id ? "Eu" : `${member.firstName} ${member.lastName}`}
                                    </div>
                                </TooltipTrigger>
                                {member._id === currentUser._id && (
                                    <TooltipContent>{`${member.firstName} ${member.lastName}`}</TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                        <div className="text-sm text-gray-500 truncate">{member.email}</div>
                    </div>
                </div>
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
                        <DropdownMenuItem onClick={handleViewPermissions}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Permissões
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteMember(member)}
                            disabled={member._id === currentUser._id}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Função:</span>
                    <Badge>
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
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Permissões de {member.firstName}</SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-3 overflow-y-auto h-full">
                    <div>
                        <p className="font-semibold">Função: {roleName}</p>
                        {role?.description && (
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        {role?.permissions.map((perm) => (
                            <div key={perm.section} className="flex items-start justify-between">
                                <span className="capitalize">{getSectionLabel(perm.section)}</span>
                                <div className="flex gap-1">
                                    {perm.permissions.canView && <Badge variant="secondary">ver</Badge>}
                                    {perm.permissions.canEdit && <Badge variant="secondary">editar</Badge>}
                                    {perm.permissions.canDelete && <Badge variant="secondary">apagar</Badge>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
        </>
    )
}
