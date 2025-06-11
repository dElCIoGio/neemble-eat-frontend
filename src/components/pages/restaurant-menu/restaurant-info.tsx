import {useMenuContext} from "@/context/menu-context";

export function RestaurantInfo() {

    const {restaurant} = useMenuContext()

    return (
        <div className={"my-2 laptop:my-8 space-y-4"}>
            <div className={`lg:w-[40%]`}>
                <h1 className={`text-4xl font-poppins-semibold`}>
                    {restaurant.name}
                </h1>
            </div>
            <div className={`lg:w-[60%]`}>
                <p className={`hidden lg:block`}>
                    {restaurant.description}
                </p>
            </div>
        </div>
    );
}
