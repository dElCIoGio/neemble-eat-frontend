import {createContext, useContext} from "react";
import {User} from "@/types/user";
import {Restaurant} from "@/types/restaurant";

type DashboardContextProps = {
    page: string,
    user: User
    restaurant: Restaurant
}


export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined)


export function useDashboardContext() {

    const context = useContext(DashboardContext)

    if (!context) {
        throw new Error('useDashboardContext must be used within a DashboardProvider')
    }

    return context
}