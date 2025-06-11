interface props {
    sessionPrice: number
}

export function OrdersCost({sessionPrice}: props) {
    return (
        <div className='w-full flex justify-between mt-3'>
            <h1 className='font-semibold text-sm'>
                Consumo
            </h1>
            <p className=' text-sm text-zinc-800'>
                {sessionPrice} Kz
            </p>
        </div>
    );
}

