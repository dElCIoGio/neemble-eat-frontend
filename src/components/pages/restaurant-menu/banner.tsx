import {useMenuContext} from "@/context/menu-context";

export function Banner() {

    const {restaurant} = useMenuContext()

    return (
        <div
            className='justify-center flex items-center overflow-hidden'>
            <img
                src={restaurant.bannerUrl}
                alt="description of image"
                className='object-cover w-full max-h-40 laptop:max-h-60'
            />
        </div>
    );
}