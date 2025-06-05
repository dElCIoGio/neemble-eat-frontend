import {createContext, useContext} from "react";

interface OnboardContextProps {
    handleSubmit: () => void;
}


export const OnboardingContext =  createContext<OnboardContextProps | undefined>(undefined);

export function useOnboardingContext() {

    const context = useContext(OnboardingContext);

    if (!context) {
        throw new Error("useOnboardingContext must be used within a OnboardingProvider");
    }

    return context;

}