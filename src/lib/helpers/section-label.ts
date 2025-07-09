import {Sections} from "@/types/role";

export const sectionLabels: Record<Sections, string> = {
    menus: 'Cardápios',
    categories: 'Categorias',
    items: 'Itens',
    customizations: 'Customizações',
    orders: 'Pedidos',

    customer_orders_summary: 'Resumo de Pedidos',
    table_qr_access_control: 'Controle de Acesso QR da Mesa',

    kitchen_view: 'Visão da Cozinha',
    bar_view: 'Visão do Bar',
    order_queue: 'Fila de Pedidos',
    tables: 'Mesas',
    reservations: 'Reservas',

    users: 'Usuários',
    roles: 'Funções',
    permissions: 'Permissões',

    sales_dashboard: 'Painel de Vendas',
    invoices: 'Faturas',
    payments: 'Pagamentos',
    reports: 'Relatórios',

    performance_insights: 'Visão de Desempenho',
    product_popularity: 'Popularidade dos Produtos',
    revenue_trends: 'Tendências de Receita',
    customer_feedback: 'Feedback dos Clientes',

    stock_items: "Itens no stock",
    stock_movements: "Movimentos no stock",
    stock_recipes: "Receitas",

    restaurant_settings: 'Configurações do Restaurante',
    opening_hours: 'Horário de Funcionamento',
    printer_setup: 'Configuração da Impressora',
    table_qr_configuration: 'Configuração QR da Mesa',

    promotions: 'Promoções',
    announcements: 'Anúncios',
    customer_reviews: 'Avaliações de Clientes',

    system_logs: 'Logs do Sistema',
    integration_settings: 'Configurações de Integração',
    help_requests: 'Pedidos de Ajuda',
};

export function getSectionLabel(section: Sections): string {
    return sectionLabels[section] ?? section.replace(/_/g, ' ');
}
