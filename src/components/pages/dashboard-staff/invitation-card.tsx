import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useQueryClient } from "@tanstack/react-query"
import { Copy, Trash2 } from "lucide-react"

import { Invitation } from "@/types/invitation"
import { useGetRole } from "@/api/endpoints/role/hook"
import { invitationApi } from "@/api/endpoints/invitation/requests"
import { copyToClipboard } from "@/lib/helpers/copy-to-clipboard"
import { showPromiseToast, showSuccessToast } from "@/utils/notifications/toast"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/alert-dialog"

export function InvitationCard({ invitation }: { invitation: Invitation }) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const link = `www.neemble-eat.com/invitation/${invitation._id}`

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

    const { data: role } = useGetRole(invitation.roleId)
    const roleName = role?.name === "no_role" ? "Sem função" : role?.name ?? "Carregando..."

    return (
        <Card className="p-4 space-y-1">
            <div className="flex items-start justify-between">
                <div className="font-medium">{invitation.name}</div>
                <div className="flex gap-2">
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
                </div>
            </div>
            <div className="text-sm text-gray-500">{roleName}</div>
            <div className="text-sm">
                {format(new Date(invitation.createdAt), "dd/MM/yyyy", { locale: ptBR })}
            </div>
        </Card>
    )
}
