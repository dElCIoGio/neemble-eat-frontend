import {cn} from "@/lib/utils"
import React from "react";

type props = React.HTMLAttributes<HTMLDivElement>

function Background({className, ...attrs}: props) {
    return (
        <div className={cn(`fixed w-full h-dvh top-0 left-0 -z-50`, className)} {...attrs}/>
    );
}

export default Background;