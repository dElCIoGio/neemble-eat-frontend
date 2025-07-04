import { useState } from "react"
import { User } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TableRow, TableCell } from "@/components/ui/table"
import { useDashboardStaff } from "@/context/dashboard-staff-context"
import { useDashboardContext } from "@/context/dashboard-context"
import { useListRestaurantRoles } from "@/hooks/use-list-restaurant-roles"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, Eye, Mail, MoreHorizontal, Phone, Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { getSectionLabel } from "@/lib/helpers/section-label"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface MemberRowProps {
    user: User
}

export default function MemberRow({ user }: MemberRowProps) {
    const {
        selectedMembers,
        handleSelectMember,
        handleDeleteMember,
        getStatusBadge,
        updateMemberRole,
    } = useDashboardStaff()

    const { restaurant, user: currentUser } = useDashboardContext()
    const { data: roles } = useListRestaurantRoles(restaurant._id)
    const filteredRoles = (roles ?? []).filter(r => r.name !== "no_role")

    const membership = user.memberships[0]
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const role = roles.find((r) => r._id === membership?.roleId)
    const roleName = role?.name === "no_role" || !role ? "Sem função" : role.name

    function handleViewPermissions() {
        setIsMenuOpen(false)
        setIsSheetOpen(true)
    }

    return (
        <>
            <TableRow key={user._id}>
                <TableCell>
                    <Checkbox
                        checked={selectedMembers.includes(user._id)}
                        onCheckedChange={() => handleSelectMember(user._id)}
                    />
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                                {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="font-medium">
                                            {user._id === currentUser._id ? "Eu" : `${user.firstName} ${user.lastName}`}
                                        </div>
                                    </TooltipTrigger>
                                    {user._id === currentUser._id && (
                                        <TooltipContent>{`${user.firstName} ${user.lastName}`}</TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Select
                        defaultValue={role?.name === "no_role" ? "" : membership?.roleId}
                        value={role?.name === "no_role" ? "" : (membership?.roleId ?? "")}
                        onValueChange={(value) => updateMemberRole(user._id, value)}
                        disabled={user._id === currentUser._id}
                    >
                        <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="Sem função" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredRoles.map((role) => (
                                <SelectItem key={role._id} value={role._id}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </TableCell>
                <TableCell>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3" />
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3" />
                            <a href={`tel:${user.phoneNumber}`}>{user.phoneNumber}</a>
                        </div>
                    </div>
                </TableCell>
                <TableCell>{getStatusBadge(membership ? (membership.isActive ? "ativo" : "desativado") : "ativo")}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-3 h-3" />
                        {format(user.lastLogged ? user.lastLogged : user.updatedAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </div>
                </TableCell>
                <TableCell>
                    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={handleViewPermissions}>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Permissões
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteMember(user)}
                                disabled={user._id === currentUser._id}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remover
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Permissões de {user.firstName}</SheetTitle>
                    </SheetHeader>
                    <div className="p-4 space-y-3 overflow-y-auto h-full">
                        <div>
                            <p className="font-semibold">Função: {roleName}</p>
                            {role?.description && <p className="text-sm text-muted-foreground">{role.description}</p>}
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

