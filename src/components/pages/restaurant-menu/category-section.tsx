import {Item} from "@/types/item";
import {Category} from "@/types/category";
import {useGetCategoryItems} from "@/api/endpoints/categories/hooks";
import {Product} from "@/components/pages/restaurant-menu/product";
import {ProductCard} from "@/components/pages/restaurant-menu/product-card";


interface props {
    category: Category
    selectItem: (item: Item) => void

}


export function CategorySection({category, selectItem}: props) {
    const { data } = useGetCategoryItems(category._id)

    const items: Item[] = Array.isArray(data) ? data : (Array.isArray(data) ? data : [])

    if (items.length == 0) {
        return <div></div>
    }

    return (
        <div className={`mt-8 px-4`}>
            <h1 className={`text-2xl font-poppins-semibold laptop:px-4`}>
                {category.name}
            </h1>
            <div className={`columns-2 gap-0`}>
                {items.map((item, index) =>
                    item.isAvailable &&
                    <div key={index}
                         className={`break-inside-avoid laptop:p-3 divide-y divide-gray-200`}
                         onClick={() => selectItem(item)}>
                        <Product item={item}>
                            <ProductCard item={item}/>
                        </Product>
                    </div>
                )}
            </div>
        </div>
    );
}