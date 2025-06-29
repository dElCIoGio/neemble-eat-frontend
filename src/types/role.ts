export type Permissions = "view" | "create" | "update" | "delete";

export enum Sections {
    // 🍽️ RestaurantMenu & Ordering
    MENUS = "menus",
    CATEGORIES = "categories",
    ITEMS = "items",
    CUSTOMIZATIONS = "customizations",
    ORDERS = "orders",

    // 🛒 Customer Experience
    CUSTOMER_ORDERS_SUMMARY = "customer_orders_summary",
    TABLE_QR_ACCESS_CONTROL = "table_qr_access_control",

    // 👨‍🍳 Restaurant Operations
    KITCHEN_VIEW = "kitchen_view",
    BAR_VIEW = "bar_view",
    ORDER_QUEUE = "order_queue",
    TABLES = "tables",
    RESERVATIONS = "reservations",

    // 👥 Team & Roles
    USERS = "users",
    ROLES = "roles",
    PERMISSIONS = "permissions",

    // 💳 Sales & Billing
    SALES_DASHBOARD = "sales_dashboard",
    INVOICES = "invoices",
    PAYMENTS = "payments",
    REPORTS = "reports",

    // 📊 Analytics & Insights
    PERFORMANCE_INSIGHTS = "performance_insights",
    PRODUCT_POPULARITY = "product_popularity",
    REVENUE_TRENDS = "revenue_trends",
    CUSTOMER_FEEDBACK = "customer_feedback",

    // ⚙️ Settings & Config
    RESTAURANT_SETTINGS = "restaurant_settings",
    OPENING_HOURS = "opening_hours",
    PRINTER_SETUP = "printer_setup",
    TABLE_QR_CONFIGURATION = "table_qr_configuration",

    // 📢 Marketing & Communication
    PROMOTIONS = "promotions",
    ANNOUNCEMENTS = "announcements",
    CUSTOMER_REVIEWS = "customer_reviews",

    // 🛠️ Support & Maintenance
    SYSTEM_LOGS = "system_logs",
    INTEGRATION_SETTINGS = "integration_settings",
    HELP_REQUESTS = "help_requests"
}

export type SectionPermission = {
    description?: string
    section: string;
    permissions: {
        canEdit: boolean;
        canDelete: boolean;
        canView: boolean;
    };
};

export type RoleCreate = {
    name: string;
    description: string;
    permissions: SectionPermission[];
    restaurantId: string;
    level: number
}

export type Role = {
    _id: string;
    createdAt: string;
    updatedAt: string;
} & RoleCreate;

type OptionalRoleFields = Partial<Omit<Role, '_id' | 'createdAt' | 'updatedAt'>>;

export type PartialRole = OptionalRoleFields