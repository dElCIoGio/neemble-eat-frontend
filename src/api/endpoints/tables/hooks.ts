import {useQuery, useQueryClient} from "@tanstack/react-query";
import {tableApi} from "@/api/endpoints/tables/requests";
import {Table} from "@/types/table";


export function useGetTable(tableId: string) {

    const queryKey = ["get table", tableId]

    return useQuery({
        queryKey,
        queryFn: () => tableApi.getTable(tableId)
    })

}

export function useListRestaurantTables(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["list tables", restaurantId];

    const query = useQuery({
        queryKey,
        queryFn: () => tableApi.listRestaurantTables(restaurantId),
    });

    // Function to add a table
    const addTable = (newTable: Table) => {
        queryClient.setQueryData(queryKey, (oldData: Table[] | undefined) => {
            if (!oldData) return [newTable];
            return [...oldData, newTable];
        });
    };

    // Function to remove a table by its ID
    const removeTable = (tableId: string) => {
        queryClient.setQueryData(queryKey, (oldData: Table[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((table) => table._id !== tableId);
        });
    };

    return {
        ...query,
        addTable,
        removeTable,
    };
}