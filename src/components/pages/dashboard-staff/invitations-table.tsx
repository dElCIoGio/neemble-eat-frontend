import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Invitation } from "@/types/invitation";

export function InvitationsTable({ invitations }: { invitations: Invitation[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Enviado em</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invitations.map((invitation) => (
                    <TableRow key={invitation._id}>
                        <TableCell>{invitation.email}</TableCell>
                        <TableCell>{invitation.role}</TableCell>
                        <TableCell>{format(new Date(invitation.createdAt), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
