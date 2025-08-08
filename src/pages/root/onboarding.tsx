import { useEffect, useState } from "react"
import {LoadingScreen} from "@/components/pages/onboarding/loading-screen";
import {OnboardingProgress} from "@/components/pages/onboarding/onboarding-progress";
import {UserInfoStep} from "@/components/pages/onboarding/user-info-step";
import {WelcomeStep} from "@/components/pages/onboarding/welcome-step";
import {DataConfirmationStep} from "@/components/pages/onboarding/data-confirmation-step";
import { OnboardingLayout } from "@/components/layout/onboarding/onboarding-layout";
import {User} from "@/types/user";
import {Navigate, useNavigate} from "react-router";
import {toast} from "sonner";
import {OnboardingContext} from "@/context/onboarding-context";
import {useAuth} from "@/context/auth-context";
import {userApi} from "@/api/endpoints/user/endpoints";
import {authApi} from "@/api/endpoints/auth/endpoints";

// Check if the authenticated user already has a profile in the backend
async function userExists(): Promise<{ exists: boolean; userData?: User }> {
    const exists = await userApi.userExists()
    if (exists) {
        const userData = await authApi.me()
        return { exists: true, userData }
    }
    return { exists: false }
}

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [userExistsFlag, setUserExistsFlag] = useState(false)

    const navigate = useNavigate();

    const {user} = useAuth()
    
    const [userData, setUserData] = useState<Partial<User>>({
        firstName: "",
        lastName: "",
        email: user?.email? user.email: "",
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
    
    const handleSubmit = () => {
        if (!user) navigate("/auth/login");
        
        const {
            firstName,
            lastName,
            phoneNumber,
            email
        } = userData;

        if (user && firstName && lastName && phoneNumber && email) {
            user.getIdToken()
                .then((token) => {
                    authApi.register({
                        idToken: token,
                        userData: {
                            firstName,
                            lastName,
                            email,
                            phoneNumber,
                        }
                    })
                }).then(() => {
                    navigate("/dashboard")
                })
        } else {
            toast.error("Preencha todos os campos para poder avançar.")
        }
    }

    // Define total steps based on whether user exists
    const totalSteps = 3

    // Show loading screen while checking user status
    if (isLoading) {
        return <LoadingScreen />
    }

    if (!user) {
        return <Navigate to="/auth/login"/>
    }

    return (
        <OnboardingContext.Provider value={{
            handleSubmit
        }}>
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


                {/* Step 3: Data Confirmation */}
                {currentStep === 2 && (
                    <DataConfirmationStep
                        userData={userData as User}
                        onBack={prevStep}

                    />
                )}
            </OnboardingLayout>
        </OnboardingContext.Provider>
    )
}
