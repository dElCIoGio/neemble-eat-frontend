//
// import { useEffect, useState } from "react"
// import {LoadingScreen} from "@/components/pages/onboarding/loading-screen.tsx";
// import {OnboardingProgress} from "@/components/pages/onboarding/onboarding-progress.tsx";
// import {UserInfoStep} from "@/components/pages/onboarding/user-info-step.tsx";
// import {WelcomeStep} from "@/components/pages/onboarding/welcome-step.tsx";
// import {RestaurantSetupStep} from "@/components/pages/onboarding/restaurant-setup-step.tsx";
// import {DataConfirmationStep} from "@/components/pages/onboarding/data-confirmation-step.tsx";
// import { OnboardingLayout } from "@/components/layout/onboarding/onboarding-layout";
// import {User} from "@/types/user.ts";
//
//
// // Mock function to check if user exists - replace with your actual implementation
//
// export default function OnboardingPage() {
//     const [currentStep, setCurrentStep] = useState(0)
//     const [isLoading, setIsLoading] = useState(true)
//     const [userData, setUserData] = useState<User>({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phoneNumber: "",
//         memberships: [],
//         isAdmin: false,
//         isDeveloper: false,
//         preferences: {
//             language: "pt-PT",
//             notificationsEnabled: true,
//             darkMode: false,
//         },
//         isActive: true,
//         isVerified: false,
//         isOnboardingCompleted: false,
//     })
//
//
//
//     useEffect(() => {
//         const checkUserStatus = async () => {
//             try {
//                 const { exists, userData: existingUserData } = await userExists()
//                 setUserExistsFlag(exists)
//
//                 // If user exists, skip to welcome step and use their data
//                 if (exists && existingUserData) {
//                     setUserData((prevData) => ({
//                         ...prevData,
//                         ...existingUserData,
//                         createRestaurant: false,
//                     }))
//                     setCurrentStep(1) // Skip to welcome step
//                 }
//
//                 setIsLoading(false)
//             } catch (error) {
//                 console.error("Error checking user status:", error)
//                 setIsLoading(false)
//             }
//         }
//
//         checkUserStatus()
//     }, [])
//
//     const nextStep = () => {
//         setCurrentStep((prev) => prev + 1)
//     }
//
//     const prevStep = () => {
//         setCurrentStep((prev) => Math.max(0, prev - 1))
//     }
//
//     const updateUserData = (data: Partial<User>) => {
//         setUserData((prev) => ({ ...prev, ...data }))
//     }
//
//     // Define total steps based on whether user exists
//     const totalSteps = userExistsFlag ? 3 : 4
//
//     // Show loading screen while checking user status
//     if (isLoading) {
//         return <LoadingScreen />
//     }
//
//     return (
//         <OnboardingLayout>
//             <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
//
//             {/* Step 0: User Info (only if user doesn't exist) */}
//             {!userExistsFlag && currentStep === 0 && (
//                 <UserInfoStep userData={userData} updateUserData={updateUserData} onNext={nextStep} />
//             )}
//
//             {/* Step 1: Welcome */}
//             {currentStep === 1 && (
//                 <WelcomeStep
//                     firstName={userData.firstName}
//                     userData={userData}
//                     updateUserData={updateUserData}
//                     onNext={nextStep}
//                 />
//             )}
//
//             {/* Step 2: Restaurant Setup */}
//             {currentStep === 2 && (
//                 <RestaurantSetupStep userData={userData} updateUserData={updateUserData} onNext={nextStep} onBack={prevStep} />
//             )}
//
//             {/* Step 3: Data Confirmation */}
//             {currentStep === 3 && (
//                 <DataConfirmationStep
//                     userData={userData}
//                     updateUserData={updateUserData}
//                     onBack={prevStep}
//                     onComplete={() => {
//                         // Handle completion - e.g., redirect to dashboard
//                         window.location.href = "/dashboard"
//                     }}
//                 />
//             )}
//         </OnboardingLayout>
//     )
// }
