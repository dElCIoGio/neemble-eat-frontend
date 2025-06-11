import React, {useCallback, useMemo, useRef, useState} from "react";
import {Category} from "@/types/category";


export function useCategoriesAutoScroll(categories: Category[] | undefined) {
    const refs = useMemo<React.RefObject<HTMLDivElement>[]>(
        () => categories
            ? categories.map(() => React.createRef<HTMLDivElement>()) as React.RefObject<HTMLDivElement>[]
            : [],
        [categories?.length]
    );

    const [selectedCategory, setSelectedCategory] = useState<Category>();
    const scrollContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (scrollContainerRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
            setScrollLeft(scrollContainerRef.current.scrollLeft);
        }
    }, []);

    const handleMouseLeaveOrUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!isDragging || !scrollContainerRef.current) return;
            e.preventDefault();
            const x = e.pageX - scrollContainerRef.current.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        },
        [isDragging, startX, scrollLeft]
    );

    const scrollToCategory = useCallback(
        (index: number) => {
            const element = refs[index]?.current;
            if (element) {
                const yOffset = -55;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
            }
        },
        [refs]
    );

    const handleSelectCategory = useCallback(
        (category: Category, index: number) => {
            setSelectedCategory(category);
            scrollToCategory(index);
        },
        [scrollToCategory]
    );

    return {
        refs,
        selectedCategory,
        handleSelectCategory,
        handleMouseDown,
        handleMouseLeaveOrUp,
        handleMouseMove,
        isDragging,
        scrollContainerRef,
    };
}

export default useCategoriesAutoScroll;