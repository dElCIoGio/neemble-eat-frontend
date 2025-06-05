import {useAuth} from "@/context/auth-context";
import {useQuery} from "@tanstack/react-query";
import {authApi} from "@/api/endpoints/auth/endpoints";


export function useMe() {

    const {user} = useAuth()

    const queryKey = ["me", user? user.uid : ""]

    return useQuery({
        queryKey,
        queryFn: authApi.me
    })
}