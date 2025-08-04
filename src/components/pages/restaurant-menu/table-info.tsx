import { useMenuContext } from "@/context/menu-context";
import { useRestaurantMenuContext } from "@/context/restaurant-menu-context";
import { Bell } from "lucide-react";
import { ClosedRestaurant, OpenRestaurant } from "@/components/pages/restaurant-menu/availability";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "@/api/endpoints/sessions/requests";
import { TableSession } from "@/types/table-session";

export function TableInfo() {

    const { tableNumber, open, restaurant } = useMenuContext();
    const { session } = useRestaurantMenuContext();

    const queryClient = useQueryClient();
    const queryKey = ["active", tableNumber, restaurant._id];

    const needsAssistance = session.needsAssistance ?? false;

    const { mutate: toggleAssistance, isPending } = useMutation({
        mutationFn: () =>
            needsAssistance
                ? sessionApi.cancelAssistanceRequest(session._id)
                : sessionApi.requestAssistance(session._id),
        onSuccess: (updatedSession) => {
            queryClient.setQueryData<TableSession>(queryKey, updatedSession);
        },
    });

    return (
        <div className={"my-4 flex space-x-4 items-center"}>
            {
                open ? <OpenRestaurant/> : <ClosedRestaurant/>
            }
            <Badge className="font-jost text-zinc-500 rounded-full bg-gray-100 px-2" variant="secondary">
                Mesa {tableNumber}
            </Badge>

            <Button
                variant={needsAssistance ? "destructive" : "secondary"}
                size="sm"
                className={`px-3 text-xs rounded-lg ${needsAssistance? "": "text-zinc-600"}`}
                disabled={isPending}
                onClick={() => toggleAssistance()}
            >
                <Bell/>
                <p>
                    {needsAssistance ? "Cancelar chamado" : "Chamar Garçon"}
                </p>

            </Button>
        </div>
    );
}
