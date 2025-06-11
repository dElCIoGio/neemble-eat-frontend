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
            className='text-start flex cursor-pointer bg-white border-b laptop:border laptop:rounded-2xl laptop:overflow-hidden laptop:shadow-sm laptop:hover:shadow-md transition-shadow duration-150'>
            <div className='product-info laptop:ml-5 my-3 laptop:w-3/4 tablet:w-3/4 w-3/5 mr-3'>
                <h1 className='font-poppins-semibold'>{item.name}</h1>
                <p className='line-clamp-2 mt-0.5 text-sm text-zinc-500'>
                    {item.description}
                </p>
                <p className='text-sm font-poppins-medium text-gray-600 pb-5'>{item.price} Kz</p>
            </div>
            <div
                className='product-image justify-center max-h-40 items-center px-2 py-5 tablet:px-1 tablet:py-3 tablet:mr-2 laptop:mr-0 laptop:py-0 laptop:px-0 grow laptop:grow-0 flex w-2/5 tablet:w-1/4 laptop:w-1/4 '>
                <img src={item.imageUrl ? item.imageUrl : ""} alt={item.name}
                     className='object-cover w-full h-full'/>
            </div>
        </div>
    );
};
