import {useMenuContext} from "@/context/menu-context";
import {Bell} from "lucide-react";
import {ClosedRestaurant, OpenRestaurant} from "@/components/pages/restaurant-menu/availability";
import {Badge} from "@/components/ui/badge";

export function TableInfo() {

    const {tableNumber, open} = useMenuContext()

    return (
        <div className={`my-4 flex space-x-4`}>
            {
                open ? <OpenRestaurant/> : <ClosedRestaurant/>
            }
            <Badge className="font-jost text-zinc-500 rounded-full bg-gray-100 px-2" variant="secondary">
                Mesa {tableNumber}
            </Badge>
            <div
                className='hidden ml-5 items-center rounded-xl px-3 bg-gray-100 hover:bg-gray-200 cursor-pointer py-0.5 prevent-select'>
                <Bell className='m-1 laptop:mr-1 laptop:my-0 laptop:ml-0'/>
                <p className='text-gray-600 font-poppins-semibold hidden laptop:block'>Chamar Garçon</p>
            </div>
        </div>
    );
}
