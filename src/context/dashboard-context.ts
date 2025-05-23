import {createContext, useContext} from "react";

type DashboardContextProps = {
    page: string
}


export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined)


export function useDashboardContext() {

    const context = useContext(DashboardContext)

    if (!context) {
        throw new Error('useDashboardContext must be used within a DashboardProvider')
    }

    return context
}