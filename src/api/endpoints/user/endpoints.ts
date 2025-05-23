import {api} from "@/api";


const baseRoute = "/user"


export const userApi = {

    userExists: async () => {
        const result = await api.get<boolean>(`${baseRoute}/exists`)
        return result.data
    }
}
