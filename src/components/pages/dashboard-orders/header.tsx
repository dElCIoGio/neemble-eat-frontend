import {Button} from "@/components/ui/button";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from "@/components/ui/select";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {useState} from "react";
import {SortAscending, SortDescending, ArrowRight, SquaresFour, List as ListIcon} from "@phosphor-icons/react"
import {FILTERS, Tag} from "@/pages/dashboard/order-tracking";
import type {OrderPrepStatus} from "@/types/order";
import {useOrdersTrackingContext} from "@/context/orders-tracking-context";
import {useIsMobile} from "@/hooks/use-mobile";


interface HeaderProps {
    customOrderUrl: string;
}

export function Header({ customOrderUrl }: HeaderProps) {

    const isMobile = useIsMobile()

    const { activeFilters, toggleFilter, clearFilters, orders, handleTableFilterChange, sorting, handleSortingChange, viewMode, setViewMode} = useOrdersTrackingContext()
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)


    function toggleSorting(){
        handleSortingChange(sorting == "asc"? "desc" : "asc")
    }

    return (
        <div className="w-full space-y-2">
            <div className={`flex justify-between items-center`}>
                <div className="laptop:hidden my-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} defaultOpen={false}>
                        <SheetTrigger className={`${isMobile? "":"hidden"}`} asChild>
                            <Button variant={"default"}>
                                Selecionar estado
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={"left"}>
                            <SheetHeader>
                                <SheetTitle>{undefined}</SheetTitle>
                                <SheetDescription>
                                    {undefined}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col gap-2">
                                {
                                    FILTERS.map((filter) => {
                                        if (filter.tag === 'all') {
                                            const active = activeFilters.length === 0
                                            return (
                                                <Button key={filter.tag} onClick={clearFilters} className={active ? "text-sm bg-amethyst text-purple-600 hover:bg-amethyst-400" : "text-sm bg-white"} variant="secondary">
                                                    {filter.name}
                                                </Button>
                                            )
                                        }
                                        const active = activeFilters.includes(filter.tag as OrderPrepStatus)
                                        return (
                                            <Button onClick={() => toggleFilter(filter.tag as OrderPrepStatus)} key={filter.tag} className={active ? "text-sm bg-amethyst text-purple-600 hover:bg-amethyst-400" : "text-sm bg-white"} variant="secondary">
                                                {filter.name}
                                            </Button>
                                        )
                                    })
                                }
                            </div>

                        </SheetContent>
                    </Sheet>
                </div>
                <div className="lg:flex items-center gap-2 hidden">

                    {
                        FILTERS.map((filter) => {
                            if (filter.tag === 'all') {
                                const active = activeFilters.length === 0
                                return (
                                    <Button key={filter.tag} onClick={clearFilters} className={active ? "text-sm bg-amethyst border-[1.5px] border-zinc-300 bg-zinc-200 text-[#70469f] hover:bg-amethyst-400" : "text-sm bg-white"} variant="secondary">
                                        {filter.name}
                                    </Button>
                                )
                            }
                            const active = activeFilters.includes(filter.tag as OrderPrepStatus)
                            return (
                                <Button onClick={() => toggleFilter(filter.tag as OrderPrepStatus)} key={filter.tag} className={active ? "text-sm bg-amethyst border-[1.5px] border-zinc-300 bg-zinc-200 text-[#70469f] hover:bg-amethyst-400" : "text-sm bg-white"} variant="secondary">
                                    {filter.name}
                                </Button>
                            )
                        })
                    }
                </div>
            </div>
            <div className="space-y-2">
                <div className=" space-y-2">
                    <Select onValueChange={handleTableFilterChange} defaultValue={"All" as Tag}>
                        <SelectTrigger className="w-[180px] focus:ring-0 focus:outline-none ">
                            <SelectValue placeholder={"Selecione uma mesa"}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={"All" as Tag}>Todas as mesas</SelectItem>
                                {
                                    [...new Set(orders.map(order => order.tableNumber))].map((tableNumber, index) => (
                                        <SelectItem key={tableNumber} value={index.toString()}>
                                            {`Mesa ${tableNumber}`}
                                        </SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className="flex justify-between">
                        <div>
                            <Button variant="secondary" className="hover:bg-zinc-200" onClick={toggleSorting}>
                                {sorting == "asc" ?
                                    <>
                                        <SortDescending/>
                                        <span className="flex items-center">
                                    Antigo <ArrowRight className="mx-1.5"/> Recente
                                </span>
                                    </> :
                                    <>
                                        <SortAscending/>
                                        <span className="flex items-center">
                                    Recente <ArrowRight className="mx-1.5"/> Antigo
                                </span>
                                    </>

                                }
                            </Button>
                        </div>
                        <div>
                            <Button variant="secondary" className="hidden lg:block hover:bg-zinc-200"
                                    onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
                                {viewMode === 'list' ? <SquaresFour/> : <ListIcon/>}
                            </Button>
                        </div>
                    </div>

                </div>
                <Button variant="outline" asChild>
                    <a href={customOrderUrl} target="_blank" rel="noopener noreferrer">
                        Registar Pedido
                    </a>
                </Button>
            </div>

        </div>
    );
}

