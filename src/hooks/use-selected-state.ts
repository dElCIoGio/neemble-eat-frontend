import {useCallback, useState} from "react";


export function useSelectedState<T>(initialState: T) {
    const [state, setState] = useState<T>(initialState);
    const handleState = useCallback((value: T) => {
        setState(value);
    }, []);
    return { state, handleState };


}