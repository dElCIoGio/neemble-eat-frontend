import { Check } from "lucide-react"
import {ProhibitIcon} from "@phosphor-icons/react";

export function ClosedRestaurant() {
    return <div
        className='font-medium px-2 py-0.5 rounded-xl flex justify-center items-center bg-gray-100 w-fit'>
        <ProhibitIcon className='mr-1 mt-0.5 text-zinc-700'/>
        <p className='prevent-select cursor-default text-zinc-700'>Fechado</p>
    </div>
}

export function OpenRestaurant() {
    return <div className='font-medium px-2 py-0.5 rounded-xl flex justify-center items-center bg-green-100 w-fit'>
        <Check className='mr-1 mt-0.5' size={"15px"} color={"rgb(6, 95, 70)"}></Check>
        <p className='prevent-select text-emerald-800 cursor-default '>Aberto</p>
    </div>
}