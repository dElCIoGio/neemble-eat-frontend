import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {useCartContext} from "@/context/cart-context";


interface Props {
    disabled?: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function OrderAlert({disabled = false, open, onOpenChange, onConfirm}: Props) {

    const {alertMessage, orderStatus, customerName, totalValue, iSFetchingSession} = useCartContext()

    const isDisabled = iSFetchingSession || disabled || totalValue === 0

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <Button
                disabled={isDisabled}
                onClick={onConfirm}
                className="w-full pt-2"
            >
                Confirmar
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {orderStatus == "Success" ? `Pedido confirmado${customerName ? `, ${customerName}` : ""}!` : "Aguarde"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {orderStatus == "Success" ? alertMessage : "Confirmando o seu pedido"}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className={"px-10 py-2 rounded-lg bg-black text-white hover:text-white hover:bg-zinc-800 transition-all duration-150"}>
                        Fechar
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

