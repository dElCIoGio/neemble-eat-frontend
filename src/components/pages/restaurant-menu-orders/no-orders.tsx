export function NoOrders() {
    return (
        <div className='w-full h-fit fixed top-1/2 left-0 flex items-center'>
            <div className={`w-1/3 h-1 `}></div>
            <p className='text-gray-500 text-center w-1/3'>
                Nenhum pedido
            </p>
            <div className={`w-1/3 h-1`}></div>
        </div>
    );
}

