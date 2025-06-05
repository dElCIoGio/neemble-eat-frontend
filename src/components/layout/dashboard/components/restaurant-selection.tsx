import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useGetUserRestaurants} from "@/api/endpoints/user/hooks";
import {Button} from "@/components/ui/button";
import {
    Plus
} from "@phosphor-icons/react"
import {Link} from "react-router";
import {useDashboardContext} from "@/context/dashboard-context";

function RestaurantSelection() {

    const {
        data: restaurants,
    } = useGetUserRestaurants()

    const { page, restaurant } = useDashboardContext()


    if (restaurants == undefined) {
        return <div></div>
    }


    return (
        <div className="flex items-center space-x-3">
            <Select>
                <SelectTrigger className={`${restaurants.length == 0 && "hidden"} bg-white rounded-full`}>
                    <SelectValue placeholder={`${restaurant == null? "Selecione o restaurante": restaurant.name}`} />
                </SelectTrigger>
                <SelectContent className="">
                    {
                        restaurants.map(({name, id}) => (
                            <SelectItem key={id} className="rounded-lg" value={id}>
                                {name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>
            <Button variant="outline" className={`${page == "create-restaurant" && "hidden"}`} size="sm" asChild>
                <Link to="/dashboard/create-restaurant" className="text-sm flex items-center">
                    <Plus className="h-3 w-3"/> Novo Restaurante
                </Link>
            </Button>
        </div>

    );
}

export default RestaurantSelection;