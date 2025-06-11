import {useDashboardContext} from "@/context/dashboard-context";
import {useIsMobile} from "@/hooks/use-mobile";
import {Loader} from "@/components/ui/loader";
import {useState} from "react";
import {tableApi} from "@/api/endpoints/tables/requests";
import {Info, Minus, Plus} from "lucide-react";
import TableQRCodeDisplay from "@/components/pages/dashboard-qrcodes/table-qrcode-display";
import {useListRestaurantTables} from "@/api/endpoints/tables/hooks";
import {Button} from "@/components/ui/button";
import {showPromiseToast} from "@/utils/notifications/toast";
import {cn} from "@/lib/utils";
import {Table} from "@/types/table";

const MAXIMUM_TABLES = 20;

export default function QrTables() {
    window.document.title = "Neemble Eat - Mesas";

    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isReducing, setIsReducing] = useState<boolean>(false);

    const isDesktop = !useIsMobile();
    const {restaurant} = useDashboardContext();
    const {data: tables, removeTable, addTable, isLoading} = useListRestaurantTables(restaurant._id);

    function handleRemoveTable(tableID: string) {
        setIsAdding(false);
        setIsReducing(true);
        showPromiseToast(tableApi.deleteTable(tableID)
            .then(() => {
                removeTable(tableID);
                setIsReducing(false);
            }).catch(() => {
                setIsReducing(false);
            }), {
            loading: "Removendo mesa...",
            success: "Mesa removida com sucesso!",
            error: "Erro ao remover mesa. Tente novamente."
        });
    }

    function handleAddTable() {
        setIsAdding(true);
        setIsReducing(false);

        const promise = tableApi.createTable({
            restaurantId: restaurant._id,
            number: tables ? tables.length + 1 : 1,
        });
        showPromiseToast(promise, {
            loading: "Adicionando mesa...",
            success: "Mesa adicionada com sucesso!",
            error: "Erro ao adicionar mesa. Tente novamente."
        });

        promise.then((newTable: Table) => {
            addTable(newTable);
            setIsAdding(false);
        }).catch(() => {
            setIsAdding(false);
        });
    }

    if (tables == undefined || isLoading)
        return <div>
            <Loader />
        </div>;

    return (
        <div>
            <div className="mb-8">
                <h2>
                    Mesas e QR Codes
                </h2>
                <div className="flex gap-2 my-2">
                    <Info className="min-h-4 min-w-4 max-h-4 max-w-4 text-zinc-500 mt-0.5"/>
                    <p className="text-muted-foreground text-sm">
                        Cada mesa tem um QR Code que deve ser usado para entrar no menu do restaurante. Coloque cada
                        QR Code na mesa correspondente e estará tudo pronto para funcionamento. <br/>
                        <span className="italic">Aconselhamos, para uma melhor experiência, que faça alterações no número de mesas, preferencialmente, fora do horário de serviço.</span>
                    </p>
                </div>
            </div>
            <div className="flex items-center laptop:flex-row gap-2 mb-4">
                <Button 
                    disabled={isReducing || tables.length == 0 || isAdding || isLoading}
                    variant="secondary" 
                    className="hover:bg-zinc-200 w-fit border border-zinc-200"
                    onClick={() => {
                        const last = tables.at(-1);
                        if (last != undefined)
                            handleRemoveTable(last._id);
                    }}
                >
                    {isReducing ? (
                        <div className="bg-zinc-600 dark:bg-white">
                            <Loader />
                        </div>
                    ) : (
                        <Minus className="w-4 h-4" />
                    )}
                    Remover uma mesa
                </Button>
                <Button 
                    disabled={isAdding || isReducing || tables.length == MAXIMUM_TABLES || isLoading}
                    variant="secondary" 
                    className="hover:bg-zinc-200 w-fit border border-zinc-200"
                    onClick={handleAddTable}
                >
                    {isAdding ? (
                        <Loader />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                    Adicionar uma mesa
                </Button>
                <div className="border-l-2 h-6 border-zinc-200 pl-4 ml-4 flex items-center">
                    <p className="font-poppins-semibold text-sm text-zinc-600">
                        <span>
                            {(MAXIMUM_TABLES - tables.length) == 0 
                                ? "Número máximo de mesas alcançado" 
                                : `Mesas: ${tables.length}/${MAXIMUM_TABLES}`}
                        </span>
                    </p>
                </div>
            </div>
            <div className={cn("grid gap-4", isDesktop ? 'grid-cols-4' : 'grid-cols-1')}>
                {tables && tables.map((table, index) => (
                    <TableQRCodeDisplay table={table} index={index} key={index}/>
                ))}
            </div>
        </div>
    );
}