import {Icon} from "@phosphor-icons/react";
import {ReactNode} from "react";
import {Card} from "@/components/ui/card";

interface OrderBadgeProps {
    icon: Icon
    children: ReactNode
}

export function OrderBadge({children, icon}: OrderBadgeProps) {

    const Icon = icon

    return (
        <Card className={`flex flex-row w-fit text-zinc-600 text-sm shadow-none bg-zinc-100 justify-start items-center rounded-md px-2 py-0`}>
            <Icon fill={"#70469f"} className="mx-0"/> <p className="-ml-4 font-poppins-regular">{children}</p>
        </Card>
    );
}

