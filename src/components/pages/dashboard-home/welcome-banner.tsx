import { useDashboardContext } from "@/context/dashboard-context"

export default function WelcomeBanner() {
    const { user, restaurant } = useDashboardContext()

    return (
        <div className="relative overflow-hidden rounded-lg h-40 md:h-48">
            {restaurant.bannerUrl && (
                <img src={restaurant.bannerUrl} alt={restaurant.name} className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="relative h-full bg-black/40 flex flex-col justify-center px-4 sm:px-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-white">Bem-vindo de volta, {user.firstName}!</h2>
                <p className="text-white text-sm md:text-base mt-1">Esperamos que tenha um excelente dia gerindo o {restaurant.name}.</p>
            </div>
        </div>
    )
}
