import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Invitation } from "@/types/invitation";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/helpers/copy-to-clipboard";
import { showPromiseToast, showSuccessToast } from "@/utils/notifications/toast";
import { invitationApi } from "@/api/endpoints/invitation/requests";
import { useQueryClient } from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function InvitationsTable({ invitations }: { invitations: Invitation[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Enviado em</TableHead>
                    <TableHead className="w-20 text-right">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invitations.map((invitation) => (
                    <InvitationRow key={invitation._id} invitation={invitation} />
                ))}
            </TableBody>
        </Table>
    );
}

function InvitationRow({ invitation }: { invitation: Invitation }) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const link = `www.neemble-eat.com/invite/${invitation._id}`

    const handleDelete = () => {
        showPromiseToast(
            invitationApi.deleteInvitation(invitation._id).then(() => {
                queryClient.invalidateQueries({ queryKey: ["invitations", invitation.restaurantId] })
            }),
            {
                loading: "Cancelando convite...",
                success: "Convite cancelado!",
                error: "Erro ao cancelar convite."
            }
        )
    }

    const handleCopy = () => {
        copyToClipboard(link)
        showSuccessToast("Link copiado!")
    }

    return (
        <TableRow>
            <TableCell>{invitation.name}</TableCell>
            <TableCell>{invitation.role}</TableCell>
            <TableCell>{format(new Date(invitation.createdAt), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
            <TableCell className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4" />
                </Button>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar convite</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem a certeza que deseja cancelar este convite?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Não</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Sim
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TableCell>
        </TableRow>
    )
}
