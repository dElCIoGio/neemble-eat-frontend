import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "@/api/endpoints/sessions/requests";
import { TableSession } from "@/types/table-session";

interface Props {
    restaurantId?: string
    tableNumber: number
}

export function useGetActiveSession(tableId: string) {

    const queryKey = ["active session", tableId]

    return useQuery({
        queryKey,
        queryFn: () => sessionApi.getActiveSession(tableId)
    })

}


export function useListSessions(tableId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["list session", tableId];

    const query = useQuery({
        queryKey,
        queryFn: () => sessionApi.listSessions(tableId),
    });

    // Function to add a session
    const addSession = (newSession: TableSession) => {
        queryClient.setQueryData(queryKey, (oldData: TableSession[] | undefined) => {
            if (!oldData) return [newSession];
            return [...oldData, newSession];
        });
    };

    // Function to remove a session by ID
    const removeSession = (sessionId: string) => {
        queryClient.setQueryData(queryKey, (oldData: TableSession[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((session) => session._id !== sessionId);
        });
    };

    return {
        ...query,
        addSession,
        removeSession,
    };
}


export function useGetActiveSessionByTableNumber({restaurantId, tableNumber}: Props){

    const queryKey = ["active", tableNumber, restaurantId];

    const {
        ...query
    } = useQuery({
        queryKey,
        queryFn: () => restaurantId? sessionApi.getActiveSessionByTableNumber(tableNumber, restaurantId): undefined,
        enabled: typeof restaurantId != "undefined",
    })


    return {
        ...query,
    }


}
