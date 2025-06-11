import React, {useState, useRef, ReactElement} from 'react';

interface SwipeToConfirmButtonProps {
    label: string;
    onConfirm: () => void;
    color: string
    icon?: ReactElement
}


export function SwipeToConfirmButton({label, onConfirm, color, icon}: SwipeToConfirmButtonProps) {

    const [dragging, setDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState(0);
    const [confirmed, setConfirmed] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleStart = () => {
        if (!confirmed) {
            setDragging(true);
        }
    };

    const handleEnd = () => {
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const buttonWidth = buttonRef.current?.offsetWidth || 0;

        if (dragPosition > containerWidth * 0.6 && !confirmed) {  // Adjust this value as needed
            // If dragged beyond the threshold, confirm and keep the button on the right
            setConfirmed(true);
            setDragPosition(containerWidth - buttonWidth);
            onConfirm();
        } else {
            // If not dragged beyond the threshold, return the button to the starting position
            if (!confirmed) {
                setDragPosition(0);
            }

        }
        setDragging(false);
    };

    const handleMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault()
        if (dragging && !confirmed) {
            const clientX = (event as React.MouseEvent).clientX || (event as React.TouchEvent).touches[0].clientX;
            const containerLeft = containerRef.current?.getBoundingClientRect().left || 0;
            const containerWidth = containerRef.current?.offsetWidth || 0;
            const newDragPosition = Math.min(Math.max(0, clientX - containerLeft), containerWidth - (buttonRef.current?.offsetWidth || 0));
            setDragPosition(newDragPosition - 10 <= 0 ? 0 : newDragPosition - 10);
        }
    };

    return (
        <div
            className='flex bg-gray-100 rounded-3xl h-12 w-full relative mb-4 '
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            ref={containerRef}
        >

            <div
                className={!confirmed ? `${color} font-poppins-medium cursor-pointer text-sm text-white rounded-3xl h-full flex items-center justify-center absolute px-5 py-4 prevent-select` :
                    'bg-gray-500 cursor-not-allowed text-sm text-white rounded-3xl h-full flex items-center justify-center absolute px-5 py-4 prevent-select'}
                style={{left: `${dragPosition}px`, transition: dragging ? 'none' : 'left 0.2s'}}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                ref={buttonRef}
            >
                {icon != undefined && icon}
                {label}
            </div>
            {!confirmed && (
                <div
                    className='absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 text-sm'
                    style={{opacity: 1 - dragPosition * 2 / (containerRef.current?.offsetWidth || 1)}}
                >
                    Arraste para confirmar
                </div>
            )}
        </div>
    );
}

