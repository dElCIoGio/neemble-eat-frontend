import useCategoriesAutoScroll from "@/hooks/use-categories-auto-scroll";
import {useMenuContext} from "@/context/menu-context";
import {CategorySection} from "@/components/pages/restaurant-menu/category-section";
import {CategoriesBar} from "@/components/pages/restaurant-menu/categories-bar";

export function Categories() {

    const {setSelectedItem, categories} = useMenuContext()




    const {
        refs,
        selectedCategory,
        handleSelectCategory,
        handleMouseLeaveOrUp,
        handleMouseMove,
        handleMouseDown,
        isDragging,
        scrollContainerRef,
    } = useCategoriesAutoScroll(categories)


    return (
        <div className={"laptop:bg-zinc-50 laptop:pb-8"}>
            <div className={`sticky top-0 z-50 shadow-md`}>
                <CategoriesBar selectedCategory={selectedCategory}
                               scrollContainerRef={scrollContainerRef}
                               handleSelectCategory={handleSelectCategory}
                               handleMouseMove={handleMouseMove}
                               handleMouseDown={handleMouseDown}
                               handleMouseLeaveOrUp={handleMouseLeaveOrUp}
                               isDragging={isDragging}
                />
            </div>
            <div>
                {
                    categories &&
                    categories.map((category, index) =>
                        category.isActive &&
                        <div key={index}
                             className={""}
                             ref={refs[index]}>
                            <CategorySection category={category} selectItem={(item) => setSelectedItem(item)}/>
                        </div>
                    )
                }
            </div>
        </div>

    )
}