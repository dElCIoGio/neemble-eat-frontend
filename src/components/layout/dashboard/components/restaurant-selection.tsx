import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {useGetUserRestaurants, useSetCurrentRestaurant} from "@/api/endpoints/user/hooks";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react";
import { Link } from "react-router";
import { useDashboardContext } from "@/context/dashboard-context";
import {Loader} from "@/components/ui/loader";
import {useIsMobile} from "@/hooks/use-mobile";

function RestaurantSelection() {
    const { data: restaurants, isLoading } = useGetUserRestaurants();

    const { page, restaurant } = useDashboardContext(); // Make sure your context exposes this!
    const { mutate: setCurrentRestaurant, isPending } = useSetCurrentRestaurant();

    const isMobile = useIsMobile()

    if (restaurants == undefined) {
        return <div></div>;
    }

    if (isPending || isLoading) {
        return <div className="flex justify-center items-center flex-1">
            <Loader/>
        </div>
    }

    if (restaurants.length === 0) {
        return (
            <div className="flex items-center space-x-3">
                <span>Nenhum restaurante encontrado.</span>
                <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard/create-restaurant" className="text-sm flex items-center">
                        <Plus className="h-3 w-3" /> <span className={`${isMobile && "hidden"}`}>
                        Novo Restaurante
                    </span>
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-3">
            <Select
                defaultValue={restaurant?._id}
                onValueChange={id => setCurrentRestaurant(id)}
            >
                <SelectTrigger className="bg-white rounded-full">
                    <SelectValue placeholder="Selecione o restaurante" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                    {restaurants.map(({ name, _id }) => (
                        <SelectItem
                            key={_id}
                            className="rounded-lg"
                            value={_id}
                        >
                            {name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button
                variant="outline"
                className={page === "create-restaurant" ? "hidden" : ""}
                size="sm"
                asChild
            >
                <Link to="/dashboard/create-restaurant" className="text-sm flex items-center">
                    <Plus className="h-3 w-3" /> <span className={`${isMobile && "hidden"}`}>
                        Novo Restaurante
                    </span>
                </Link>
            </Button>
        </div>
    );
}

export default RestaurantSelection;
