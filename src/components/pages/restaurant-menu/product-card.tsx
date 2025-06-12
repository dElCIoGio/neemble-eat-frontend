import {FC} from "react";
import {Item} from "@/types/item";

interface props {
    item: Item;
}

export const ProductCard: FC<props> = ({item}) => {

    if (!item.imageUrl) {
        window.location.reload()
        sessionStorage.clear()
        localStorage.clear()
    }

    return (

        <div
            className='text-start flex cursor-pointer bg-white lg:border-b lg:border rounded-2xl lg:overflow-hidden lg:shadow-sm lg:hover:shadow-md transition-shadow duration-150'>
            <div className='product-info lg:ml-5 my-3 lg:w-3/4 md:w-3/4 w-3/5 mr-3'>
                <h1 className='font-poppins-semibold'>{item.name}</h1>
                <p className='line-clamp-2 mt-0.5 text-sm text-zinc-500'>
                    {item.description}
                </p>
                <p className='text-sm font-poppins-medium text-gray-600 pb-5'>Kz {item.price}</p>
            </div>
            <div
                className='product-image justify-center max-h-40 items-center px-2 py-5 md:px-1 md:py-3 md:mr-2 lg:mr-0 lg:py-0 lg:px-0 grow lg:grow-0 flex w-2/5 md:w-1/4 lg:w-1/4 '>
                <img src={item.imageUrl ? item.imageUrl : ""} alt={item.name}
                     className='object-cover w-full h-full'/>
            </div>
        </div>
    );
};
