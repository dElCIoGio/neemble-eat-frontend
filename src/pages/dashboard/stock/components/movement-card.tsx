import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import {Movement} from "@/types/stock";
import {formatIsosDate} from "@/lib/helpers/format-isos-date";

interface MovementCardProps {
    movement: Movement;
}

export function MovementCard({movement}: MovementCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{movement.productName}</CardTitle>
                <CardDescription>{formatIsosDate(new Date(movement.date))}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="capitalize">{movement.type}</span>
                </div>
                <div className="flex justify-between">
                    <span>Quantidade:</span>
                    <span>{movement.quantity} {movement.unit}</span>
                </div>
                <div className="flex justify-between">
                    <span>Utilizador:</span>
                    <span>{movement.user}</span>
                </div>
                <div>
                    <span className="font-medium">Razão:</span> {movement.reason}
                </div>
            </CardContent>
        </Card>
    );
}

