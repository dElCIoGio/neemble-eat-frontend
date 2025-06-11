import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {useOrdersContext} from "@/context/order-context";


interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export function BillsAlert({onOpenChange, open}: Props) {
    const {customerName} = useOrdersContext()
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        A sua conta esta à caminho!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        A sua conta chegará à sua mesa em breve{customerName == "" ? `, ${customerName}. ` : `. `}Agrecemos por ter nos escolhido e volte sempre!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={""}>
                        Fechar
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

