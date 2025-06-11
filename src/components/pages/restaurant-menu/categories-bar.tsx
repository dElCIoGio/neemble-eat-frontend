import {MouseEvent, RefObject} from "react";
import {PopoverContent, PopoverTrigger, Popover} from "@/components/ui/popover";
import {AlignJustify} from "lucide-react"
import {Category} from "@/types/category";
import {useMenuContext} from "@/context/menu-context";

interface props {
    handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void,
    handleMouseMove: (e: MouseEvent<HTMLDivElement>) => void,
    handleMouseLeaveOrUp: () => void,
    handleSelectCategory: (category: Category, index: number) => void,
    selectedCategory: Category | undefined,
    isDragging: boolean,
    scrollContainerRef: RefObject<HTMLDivElement>
}

export function CategoriesBar({
                                  selectedCategory,
                                  isDragging,
                                  scrollContainerRef,
                                  handleSelectCategory,
                                  handleMouseLeaveOrUp,
                                  handleMouseMove,
                                  handleMouseDown
                              }: props) {

    const {categories} = useMenuContext()

    return (
        <div className={`bg-white backdrop-filter backdrop-blur-lg bg-opacity-80 firefox:bg-opacity-90`}>
            <div className='z-10 px-4'>
                <div className='flex items-center'>
                    <div>
                        <Popover>
                            <PopoverTrigger className={"flex "}>
                                <AlignJustify className="mr-4" size={"18px"}/>
                            </PopoverTrigger>
                            <PopoverContent className={`m-2 divide-y p-2 w-fit`}>
                                {
                                    categories &&
                                    categories.map((category, index) =>
                                        category.isActive &&
                                        <div key={index}
                                             className={`prevent-select text-sm pr-8 py-2 font-semibold transition-all ease-out duration-150 ${category ? selectedCategory?.name === category.name ? 'text-black pl-6' : 'text-zinc-400 pl-2' : ''} cursor-pointer `}
                                             onClick={() => handleSelectCategory(category, index)}>
                                            {category.name}
                                        </div>
                                    )
                                }
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div
                        className='overflow-x-auto styled-scrollbar mt-4 flex-1 cursor-default'
                        ref={scrollContainerRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeaveOrUp}
                        onMouseUp={handleMouseLeaveOrUp}
                        onMouseMove={handleMouseMove}
                        style={{cursor: isDragging ? 'grabbing' : 'grab'}}
                    >
                        <div
                            className='categories flex space-x-8 items-center text-gray-600 font-semibold cursor-pointer prevent-select whitespace-nowrap w-fit mx-4'>
                            {
                                categories &&
                                categories.map((category, index) =>
                                    category.isActive &&
                                    <div key={index}
                                         className={`mb-0 pb-4 text-sm hover:text-blue-500 border-b-2 ${category ? selectedCategory?.name === category.name ? 'text-blue-500 border-blue-500' : 'border-white border-opacity-0' : 'border-white border-opacity-0'}`}
                                         onClick={() => handleSelectCategory(category, index)}>
                                        {category.name}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}