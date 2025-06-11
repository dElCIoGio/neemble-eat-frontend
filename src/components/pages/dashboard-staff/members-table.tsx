import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Clock, Edit, Eye, Mail, MoreHorizontal, Phone, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useDashboardStaff } from "@/context/dashboard-staff-context"
import {User} from "@/types/user";
import {useGetUserMemberships} from "@/api/endpoints/memberships/hooks";
import {useDashboardContext} from "@/context/dashboard-context";

export function MembersTable() {

    const {
        paginatedMembers,
        selectedMembers,
        handleSelectAll,
        handleSort
    } = useDashboardStaff()

    return (
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
                    <MemberRow user={member}/>
                ))}
            </TableBody>
        </Table>
    )
}

function MemberRow({user}: {user: User}) {

    const {
        selectedMembers,
        handleSelectMember,
        handleEditMember,
        handleDeleteMember,
        getRoleColor,
        getRoleName,
        getStatusBadge
    } = useDashboardStaff()

    const {
        restaurant
    } = useDashboardContext()

    const {
        data: membership
    } = useGetUserMemberships(user._id, restaurant._id)

    return (
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
                        <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div>
                    <Badge className={getRoleColor(user.memberships[0]?.roleId)}>
                        {getRoleName(user.memberships[0]?.roleId)}
                    </Badge>
                </div>
            </TableCell>
            <TableCell>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${user.email}`}>
                            {user.email}
                        </a>

                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3" />
                        <a href={`tel:${user.phoneNumber}`}>
                            {user.phoneNumber}
                        </a>

                    </div>
                </div>
            </TableCell>
            <TableCell>{getStatusBadge(membership? membership.isActive ? "ativo" : "desativado": "ativo")}</TableCell>
            <TableCell>
                <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3" />
                    {format(user.lastLogged? user.lastLogged : user.updatedAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
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
                        <DropdownMenuItem onClick={() => handleEditMember(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Permissões
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(user)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )

}