import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Trash2} from "lucide-react";
import {StockItem} from "@/types/stock";
import {formatIsosDate} from "@/lib/helpers/format-isos-date";

interface StockCardProps {
    item: StockItem;
    onView: (item: StockItem) => void;
    onEdit: (item: StockItem) => void;
    onAdd: (item: StockItem) => void;
    onDelete: (item: StockItem) => void;
}

export function StockCard({item, onView, onEdit, onAdd, onDelete}: StockCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span>Quantidade:</span>
                    <span>{item.currentQuantity} {item.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Estado:</span>
                    <Badge
                        className={`${item.status === "Baixo" && "bg-yellow-600"}`}
                        variant={
                            item.status === "OK" ? "default" : item.status === "Baixo" ? "secondary" : "destructive"
                        }
                    >
                        {item.status}
                    </Badge>
                </div>
                <div className="flex justify-between">
                    <span>Última Entrada:</span>
                    <span>{formatIsosDate(new Date(item.lastEntry))}</span>
                </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onView(item)}>
                    Detalhes
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                    Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onAdd(item)}>
                    Adicionar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </CardFooter>
        </Card>
    );
}

