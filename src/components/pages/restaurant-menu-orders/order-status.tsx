export function Ready() {
    return <p
        className='bg-green-100 border border-green-600 font-semibold text-green-600 w-fit text-sm px-2 py-0.5 rounded-lg flex justify-center items-center'>
        Pronto
    </p>
}


export function Cancelled() {
    return <p
        className='bg-red-100 border border-red-600 font-semibold text-red-600 w-fit text-sm px-2 py-0.5 rounded-lg flex justify-center items-center'>
        Cancelado
    </p>
}

export function InProgress() {
    return <p
        className='bg-purple-100 border border-purple-600 font-semibold text-purple-600 w-fit text-sm px-2 py-0.5 rounded-lg flex justify-center items-center'>
        A ser preparado
    </p>
}

export function Queued() {
    return <p
        className='bg-amber-100 border border-amber-600 font-semibold text-amber-600 w-fit text-sm px-2 py-0.5 rounded-lg flex justify-center items-center'>
        Na fila
    </p>
}