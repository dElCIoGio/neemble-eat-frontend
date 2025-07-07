import {UsePaginatedQueryResult} from "@/hooks/use-paginate";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink
} from "@/components/ui/pagination";
import {Button} from "@/components/ui/button";
import {CaretLeft, CaretRight} from "@phosphor-icons/react";


export default function PaginationManager<T>(query: UsePaginatedQueryResult<T>) {

    const {
        currentPage,
        hasMore,
        isLoading,
        resetPagination,
        goToNextPage,
        goToPreviousPage
    } = query

    return (
        <Pagination>
            <PaginationContent className="flex justify-between w-full">
                <PaginationItem>
                    <Button variant="ghost" className="flex items-center" disabled={isLoading || currentPage == 1} onClick={goToPreviousPage}>
                        <CaretLeft/> <span>
                        Anterior
                    </span>
                    </Button>
                </PaginationItem>
                <div className="flex items-center space-x-0.5">
                    {
                        currentPage > 2 && (
                            <>
                                <PaginationItem onClick={resetPagination}>
                                    <PaginationLink>1</PaginationLink>
                                </PaginationItem>
                                {
                                    currentPage > 3 && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )
                                }
                            </>

                        )
                    }
                    {
                        (currentPage - 1) > 0 && (
                            <PaginationItem onClick={goToPreviousPage}>
                                <PaginationLink>{currentPage - 1}</PaginationLink>
                            </PaginationItem>
                        )
                    }
                    <PaginationItem>
                        <PaginationLink className="bg-zinc-100">{currentPage}</PaginationLink>
                    </PaginationItem>
                    {
                        hasMore && (
                            <PaginationItem>
                                <Button variant="ghost" disabled={isLoading} onClick={goToNextPage}>
                                    {currentPage + 1}
                                </Button>
                            </PaginationItem>
                        )
                    }
                </div>
                <PaginationItem>
                    <Button className="flex items-center" variant="ghost" disabled={isLoading || !hasMore} onClick={goToNextPage}>
                        <span>
                            Próximo
                        </span> <CaretRight/>
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}