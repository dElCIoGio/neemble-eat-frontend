import {DateFilter} from "@/types/dashboard";
import {createContext, useContext} from "react";

type DashboardHomeContextProps = {
    dateFilter: DateFilter
}


export const DashboardHomeContext = createContext<DashboardHomeContextProps | undefined>(undefined)


export function useDashboardHomeContext() {

    const context = useContext(DashboardHomeContext)

    if (!context)
        throw new Error("useDashboardHomeontext must be used within the DashboardContext");

    return context

}