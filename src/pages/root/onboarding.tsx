import { useEffect, useState } from "react"
import {LoadingScreen} from "@/components/pages/onboarding/loading-screen";
import {OnboardingProgress} from "@/components/pages/onboarding/onboarding-progress";
import {UserInfoStep} from "@/components/pages/onboarding/user-info-step";
import {WelcomeStep} from "@/components/pages/onboarding/welcome-step";
import {RestaurantSetupStep} from "@/components/pages/onboarding/restaurant-setup-step";
import {DataConfirmationStep} from "@/components/pages/onboarding/data-confirmation-step";
import { OnboardingLayout } from "@/components/layout/onboarding/onboarding-layout";
import {User} from "@/types/user";

// Mock function to check if user exists - replace with your actual implementation
async function userExists(): Promise<{ exists: boolean; userData?: User }> {
    // This is a mock implementation - replace with your actual API call
    return { exists: false };
}

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [userExistsFlag, setUserExistsFlag] = useState(false)
    const [userData, setUserData] = useState<Partial<User>>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        memberships: [],
        isAdmin: false,
        isDeveloper: false,
        preferences: {
            language: "pt-PT",
            notificationsEnabled: true,
            darkMode: false,
        },
        isActive: true,
        isVerified: false,
        isOnboardingCompleted: false,
    })

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const { exists, userData: existingUserData } = await userExists()
                setUserExistsFlag(exists)

                // If user exists, skip to welcome step and use their data
                if (exists && existingUserData) {
                    setUserData((prevData) => ({
                        ...prevData,
                        ...existingUserData,
                    }))
                    setCurrentStep(1) // Skip to welcome step
                }

                setIsLoading(false)
            } catch (error) {
                console.error("Error checking user status:", error)
                setIsLoading(false)
            }
        }

        checkUserStatus()
    }, [])

    const nextStep = () => {
        setCurrentStep((prev) => prev + 1)
    }

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(0, prev - 1))
    }

    const updateUserData = (data: Partial<User>) => {
        setUserData((prev) => ({ ...prev, ...data }))
    }

    // Define total steps based on whether user exists
    const totalSteps = userExistsFlag ? 3 : 4

    // Show loading screen while checking user status
    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <OnboardingLayout>
            <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />

            {/* Step 0: User Info (only if user doesn't exist) */}
            {!userExistsFlag && currentStep === 0 && (
                <UserInfoStep userData={userData as User} updateUserData={updateUserData} onNext={nextStep} />
            )}

            {/* Step 1: Welcome */}
            {currentStep === 1 && (
                <WelcomeStep
                    firstName={userData.firstName || ""}
                    onNext={nextStep}
                />
            )}

            {/* Step 2: Restaurant Setup */}
            {currentStep === 2 && (
                <RestaurantSetupStep 
                    userData={userData as User} 
                    updateUserData={updateUserData} 
                    onNext={nextStep} 
                    onBack={prevStep} 
                />
            )}

            {/* Step 3: Data Confirmation */}
            {currentStep === 3 && (
                <DataConfirmationStep
                    userData={userData as User}
                    onBack={prevStep}
                    onComplete={() => {
                        // Handle completion - e.g., redirect to dashboard
                        window.location.href = "/dashboard"
                    }}
                />
            )}
        </OnboardingLayout>
    )
}
