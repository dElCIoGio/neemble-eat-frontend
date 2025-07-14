import {Check, OctagonX} from "lucide-react"
import {Badge} from "@/components/ui/badge";

export function ClosedRestaurant() {
    return (
        <Badge variant="destructive" className='font-jost rounded-full'>
            <OctagonX />
            Fechado
        </Badge>
    )
}

export function OpenRestaurant() {
    return <Badge variant="default" className='font-jost bg-green-700 rounded-full'>
        <Check/>
        <p >Aberto</p>
    </Badge>
}