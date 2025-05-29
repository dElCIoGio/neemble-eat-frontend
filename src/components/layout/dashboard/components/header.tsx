import {useDashboardContext} from "@/context/dashboard-context";
import {Card} from "@/components/ui/card";

function Header() {

    const { page } = useDashboardContext();

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
            case "stock":
                return "Stock"
        }
    }

    const getPageSubtitle = () => {
        switch (page) {
            case '':
                return 'Seja bem vindo ao seu painel de controle';
            case 'menu':
                return 'Manage your restaurant menus, categories, and items';
            case 'qrcode':
                return 'QR Codes';
            case 'bookings':
                return 'Acompanhe e gere as reservas do restaurante.';
            case 'staff':
                return 'Equipe';
            case 'settings':
                return 'Definição';
            case 'subscription':
                return 'Gerencie sua subscrição e histórico de pagamentos.';
            case 'support':
                return 'Encontre ajuda e recursos para a sua experiência com o Neemble Eat';
            case "stock":
                return "Gerencie o stock do restaurante"
        }
    }

    return (
        <Card className="w-full p-6">
            <div className="space-y-2">
                <h1 className="text-3xl text-jost font-bold">
                    {getPageTitle()}
                </h1>
                <p className="text-gray-500 text-sm font-semibold">
                    {getPageSubtitle()}
                </p>

            </div>
        </Card>
    );
}

export default Header;