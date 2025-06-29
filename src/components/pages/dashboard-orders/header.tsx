import {Button} from "@/components/ui/button";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from "@/components/ui/select";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {useState} from "react";
import {SortAscending, SortDescending, ArrowRight} from "@phosphor-icons/react"
import {FILTERS, Tag} from "@/pages/dashboard/order-tracking";
import {useOrdersTrackingContext} from "@/context/orders-tracking-context";


export function Header() {

    const { filterMode, handleFilterModeChange, orders, handleTableFilterChange, sorting, handleSortingChange} = useOrdersTrackingContext()
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)

    function toggleSheet() {
        setIsSheetOpen(!isSheetOpen)
    }

    function toggleSorting(){
        handleSortingChange(sorting == "asc"? "desc" : "asc")
    }

    return (
        <div className="w-full space-y-2">
            <div className={`flex justify-between items-center`}>
                <div className="laptop:hidden my-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} defaultOpen={false}>
                        <SheetTrigger asChild>
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
                                    FILTERS.map((filter) =>
                                        filter.tag === filterMode.tag ?
                                            <Button key={filter.tag} className="text-sm bg-amethyst text-white hover:bg-amethyst-400" variant="secondary">
                                                {filter.name}
                                            </Button>:
                                            <Button onClick={() => {
                                                handleFilterModeChange(filter)
                                                toggleSheet()
                                            }} key={filter.tag} className="text-sm bg-white" variant="secondary">
                                                {filter.name}
                                            </Button>
                                    )
                                }
                            </div>

                        </SheetContent>
                    </Sheet>
                </div>
                <div className="lg:flex items-center gap-2 hidden">

                    {
                        FILTERS.map((filter) =>
                            filter.tag === filterMode.tag ?
                                <Button key={filter.tag} className="text-sm bg-amethyst border-[1.5px] border-zinc-300 bg-zinc-200 text-[#70469f] hover:bg-amethyst-400" variant="secondary">
                                    {filter.name}
                                </Button>:
                                <Button onClick={() => handleFilterModeChange(filter)} key={filter.tag} className="text-sm bg-white" variant="secondary">
                                    {filter.name}
                                </Button>
                        )
                    }
                </div>
            </div>
            <div className="flex sm:flex-col space-y-2 md:items-center md:justify-between md:flex-row md:space-x-4">
                <Select onValueChange={handleTableFilterChange} defaultValue={"All" as Tag}>
                    <SelectTrigger className="w-[180px] focus:ring-0 focus:outline-none ">
                        <SelectValue placeholder={"Selecione uma mesa"}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={"All" as Tag}>Todas</SelectItem>
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
            </div>
        </div>
    );
}

