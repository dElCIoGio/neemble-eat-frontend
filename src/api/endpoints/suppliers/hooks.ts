import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {suppliersApi} from "./requests";
import {Supplier, SupplierCreate} from "@/types/stock";

export function useGetSuppliers(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["suppliers", restaurantId];

    const addSupplier = (supplier: Supplier) => {
        queryClient.setQueryData<Supplier[]>(queryKey, (old = []) => [...old, supplier]);
    };
    const removeSupplier = (id: string) => {
        queryClient.setQueryData<Supplier[]>(queryKey, (old = []) => old.filter(s => s._id !== id));
    };
    const updateSupplierLocal = (supplier: Supplier) => {
        queryClient.setQueryData<Supplier[]>(queryKey, (old = []) => old.map(s => s._id === supplier._id ? supplier : s));
    };

    const query = useQuery({
        queryKey,
        queryFn: () => suppliersApi.listSuppliers(restaurantId),
        enabled: !!restaurantId,
    });

    return { ...query, addSupplier, removeSupplier, updateSupplierLocal };
}

export function useCreateSupplier(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["suppliers", restaurantId];

    return useMutation({
        mutationFn: (data: SupplierCreate) => suppliersApi.createSupplier(data),
        onSuccess: (supplier) => {
            queryClient.setQueryData<Supplier[]>(queryKey, (old = []) => [...old, supplier]);
        },
    });
}

export function useUpdateSupplier(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["suppliers", restaurantId];

    return useMutation({
        mutationFn: ({id, data}: {id: string; data: Partial<Supplier>}) => suppliersApi.updateSupplier(id, data),
        onSuccess: (supplier) => {
            queryClient.setQueryData<Supplier[]>(queryKey, (old = []) => old.map(s => s._id === supplier._id ? supplier : s));
        },
    });
}

export function useDeleteSupplier(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["suppliers", restaurantId];

    return useMutation({
        mutationFn: (id: string) => suppliersApi.deleteSupplier(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<Supplier[]>(queryKey, (old = []) => old.filter(s => s._id !== id));
        },
    });
}
