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

interface MemberCardProps {
    member: User
}

export function MemberCard({ member }: MemberCardProps) {
    const {
        selectedMembers,
        handleSelectMember,
        handleEditMember,
        handleDeleteMember,
        getRoleColor,
        getRoleName,
        getStatusBadge
    } = useDashboardStaff()

    return (
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Função:</span>
                    <Badge className={getRoleColor(member.memberships[0]?.roleId)}>
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
} 