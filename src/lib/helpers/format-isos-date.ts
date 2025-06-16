import {format} from "date-fns";
import {pt} from "date-fns/locale";

export function formatIsosDate(date: Date){
    return format(new Date(date), "dd/MM/yyyy", { locale: pt })

}