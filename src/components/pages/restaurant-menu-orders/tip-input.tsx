import React from "react";


interface props {
    tip: number,
    setTip: React.Dispatch<React.SetStateAction<number>>,
}

export function TipInput({setTip, tip}: props) {

    function handleTipChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const val = event.target.value
        setTip(Number(val))
    }

    return (
        <div className='flex items-center justify-between border-b border-gray-100 pb-3'>
            <label htmlFor="tipInput"
                   className='text-sm font-poppins-semibold'>Gorjeta</label>
            <div className='flex items-center space-x-1'>
                <input type="number"
                       id="tipInput"
                       value={tip.toFixed()}
                       onChange={handleTipChange}
                       className='border-b rounded-b-none text-base hover:bordert-none border-gray-500 w-20'
                       placeholder='0.00'
                       style={{
                           // Hide the spinner controls
                           WebkitAppearance: 'none',
                           MozAppearance: 'textfield',
                       }}/>
                <p className='text-gray-600 italic text-sm'>
                    Kz
                </p>
            </div>
        </div>

    );
}

