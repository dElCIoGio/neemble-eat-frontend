
import {QRCodeCanvas} from "qrcode.react";
import {DownloadSimple, Copy} from "@phosphor-icons/react"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Table} from "@/types/table";
import {useDashboardContext} from "@/context/dashboard-context";
import {copyToClipboard} from "@/lib/helpers/copy-to-clipboard";
import {openUrlInNewTab} from "@/lib/helpers/open-in-new-tab";
import {showSuccessToast} from "@/utils/notifications/toast";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";


interface TableQrCodeCardProps {
    table: Table
    index: number
}


function TableQRCodeDisplay({table, index}: TableQrCodeCardProps) {


    const { restaurant } = useDashboardContext()


    function downloadCode(id: string) {
        const element: HTMLCanvasElement = document.querySelector(`#${id}`) as HTMLCanvasElement;
        if (element) {
            const url = element.toDataURL('image/png').replace('image/png', 'image/octet-stream')
            const link = document.createElement('a')
            link.download = `${id}.png`
            link.href = url
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            showSuccessToast(`Imagem da mesa ${table.number} baixada!`)
        }
    }

    //TODO: FIGURE A STRUCTURE FOR THE TABLE URL
    function getQrCodeLink(tableNumber: number): string {
        return `${window.location.origin}/r/${restaurant.slug}/${tableNumber}`
    }

    return (
        <Card key={table._id} className="p-2 bg-zinc-100 items-center justify-between inline-block space-y-4 w-full mx-auto">
            <div>
            <div
                className="border border-zinc-200 rounded-md bg-white "
                style={{height: "auto", margin: "0 auto", maxWidth: 150, width: "100%"}}
                onClick={() => {
                    const num = table.number
                    if (num != undefined)
                        return openUrlInNewTab(getQrCodeLink(num))
                }}>
                {
                    table.number &&
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <QRCodeCanvas
                                    marginSize={3}
                                    style={{height: "auto", maxWidth: "100%", width: "100%"}}
                                    size={256}
                                    bgColor={"#ffffff"}
                                    className="rounded-md opacity-100 hover:opacity-60 transition-all duration-300 cursor-pointer"
                                    value={getQrCodeLink(table.number)}
                                    id={`qrcode-${index + 1}`}/>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Abrir pagina da mesa {table.number}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                }
            </div>
            <div className="w-full my-2.5">
                <h1 className="text-center text-base  text-zinc-700">
                    Mesa {table.number}
                </h1>
            </div>
            <div className="flex flex-col space-y-2">
                <Button
                    size="sm"
                    className="w-full bg-zinc-200 text-dark_purple hover:bg-zinc-300"
                    onClick={() => downloadCode(`qrcode-${index + 1}`)}>
                    <DownloadSimple/> <span className="truncate">Baixar QR Code</span>
                </Button>
                <Button
                    size="sm"
                    className="w-full bg-zinc-200 text-dark_purple hover:bg-zinc-300"
                    onClick={() => {
                        if (table.number) {
                            copyToClipboard(getQrCodeLink(table.number))
                        }
                        showSuccessToast(`Link para a Mesa: ${table.number} copiado!`)
                    }}>
                    <Copy/> <span className="truncate">Copiar link</span>
                </Button>
            </div>
        </div>
        </Card>

    );
}

export default TableQRCodeDisplay;