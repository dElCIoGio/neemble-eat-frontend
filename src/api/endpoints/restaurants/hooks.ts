import {GetRestaurantMembersProps} from "@/api/endpoints/restaurants/types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {restaurantApi} from "@/api/endpoints/restaurants/requests";
import {User} from "@/types/user";

export function useGetAllMembers(props: GetRestaurantMembersProps) {

    const queryClient = useQueryClient();
    const queryKey = ["restaurant members", props.restaurantId]

    // Function to add a member
    const addMember = (newMember: User) => {
        queryClient.setQueryData(queryKey, (oldData: User[] | undefined) => {
            if (!oldData) return [newMember];
            return [...oldData, newMember];
        });
    };

    // Function to remove a member by ID
    const removeMember = (sessionId: string) => {
        queryClient.setQueryData(queryKey, (oldData: User[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((member) => member._id !== sessionId);
        });
    };

    const query = useQuery({
        queryKey,
        queryFn: () => restaurantApi.getAllMembers(props),
        enabled: !!props.restaurantId,
    })

    return {
        ...query,
        addMember,
        removeMember,
    }

}
