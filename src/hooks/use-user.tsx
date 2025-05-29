import {useQuery} from "@tanstack/react-query";
import {userApi} from "@/api/endpoints/user/endpoints";


export function useUserExists() {
    const queryKey = ["useUserExists"]
    return useQuery({
        queryKey,
        queryFn: userApi.userExists
    })
}