import {useDashboardContext} from "@/context/dashboard-context.ts";

function Header() {

    const { page } = useDashboardContext();

    console.log(page);

    const getPageTitle = () => {
        switch (page) {
            case '':
                return 'Geral';
            case 'menu':
                return 'Menu';
            case 'qrcode':
                return 'QR Codes';
            case 'bookings':
                return 'Reservas';
            case 'staff':
                return 'Equipe';
            case 'settings':
                return 'Definição';
            case 'subscription':
                return 'Subscrição';
            case 'support':
                return 'Suporte';
        }
    }

    const getPageSubtitle = () => {
        switch (page) {
            case '':
                return 'Seja bem vindo ao seu painel de controle';
            case 'menu':
                return 'Menu';
            case 'qrcode':
                return 'QR Codes';
            case 'bookings':
                return 'Reservas';
            case 'staff':
                return 'Equipe';
            case 'settings':
                return 'Definição';
            case 'subscription':
                return 'Subscrição';
            case 'support':
                return 'Suporte';
        }
    }

    return (
        <div className="w-full p-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold">
                    {getPageTitle()}
                </h1>
                <p className="text-gray-500 text-sm font-semibold">
                    {getPageSubtitle()}
                </p>

            </div>
        </div>
    );
}

export default Header;