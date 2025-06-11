
export function New() {
    return <div className="flex space-x-2 items-center w-fit">
        <div className="max-h-1.5 max-w-1.5 min-h-1.5 min-w-1.5 rounded-full bg-blue-500 mt-0.5"/>
        <span className="text-sm font-poppins-medium text-blue-900">
            Novo
        </span>
    </div>
}


export function InProgress() {
    return <div className="flex space-x-2 items-center text-nowrap">
        <div className="max-h-1.5 max-w-1.5 min-h-1.5 min-w-1.5 rounded-full bg-yellow-500 mt-0.5"/>
        <span className="text-sm font-poppins-medium text-yellow-900">
            Em Preparo
        </span>
    </div>
}

export function Cancelled() {
    return <div className="flex space-x-2 items-center w-fit">
        <div className="max-h-1.5 max-w-1.5 min-h-1.5 min-w-1.5 rounded-full bg-red-500 mt-0.5"/>
        <span className="text-sm font-poppins-medium text-red-900">
            Cancelado
        </span>
    </div>
}

export function Ready() {
    return <div className="flex space-x-2 items-center w-fit">
        <div className="max-h-1.5 max-w-1.5 min-h-1.5 min-w-1.5 rounded-full bg-green-500 mt-0.5"/>
        <span className="text-sm font-poppins-medium text-green-900">
            Pronto
        </span>
    </div>
}