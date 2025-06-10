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

export function MembersTable() {
    const {
        paginatedMembers,
        selectedMembers,
        handleSelectAll,
        handleSelectMember,
        handleSort,
        handleEditMember,
        handleDeleteMember,
        getRoleColor,
        getRoleName,
        getStatusBadge
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
                    <TableRow key={member._id}>
                        <TableCell>
                            <Checkbox
                                checked={selectedMembers.includes(member._id)}
                                onCheckedChange={() => handleSelectMember(member._id)}
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
                                <Badge className={getRoleColor(member.memberships[0]?.roleId)}>
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
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMember(member)}>
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
    )
} 