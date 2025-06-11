import {Navigate, Route, Routes} from "react-router";
import HomeLayout from "@/components/layout/root/root-layout";
import {HomePage} from "@/pages/root/home";
import DashboardLayout from "@/components/layout/dashboard/dashboard-layout";
import DashboardHome from "@/pages/dashboard/dashboard-home";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ResetPasswordPage from "@/pages/auth/reset-password";
import MenuList from "@/pages/dashboard/menu/menus-list";
import QrCodes from "@/pages/dashboard/qr-codes";
import Staff from "@/pages/dashboard/staff";
import Subscription from "@/pages/dashboard/subscription";
import Settings from "@/pages/dashboard/settings";
import Support from "@/pages/dashboard/support";
import Bookings from "@/pages/dashboard/bookings";
import NotFound from "@/pages/root/not-found";
import BlogPage from "@/pages/root/blog";
import ArticlePage from "@/pages/root/blog/article";
import OnboardingPage from "@/pages/root/onboarding";
import StockManagement from "@/pages/dashboard/stock";
import NotificationsPage from "@/pages/dashboard/notifications";
import ProtectedRoute from "@/components/ui/protected-route";
import CreateRestaurantPage from "@/pages/dashboard/create-restaurant";
import AddMenuPage from "@/pages/dashboard/menu/create-menu/create-menu-options";
import ImportMenuPage from "@/pages/dashboard/menu/create-menu/import-menu";
import CategoryDetailsPage from "@/pages/dashboard/menu/categories/category";
import CreateCategoryPage from "@/pages/dashboard/menu/categories/create-category";
import ItemDetailsPage from "@/pages/dashboard/menu/items/item";
import CreateItemPage from "@/pages/dashboard/menu/items/create-item";
import MenuManagementPage from "@/pages/dashboard/menu/menu";
import CreateMenuPage from "@/pages/dashboard/menu/create-menu/create-menu";
import RestaurantMenu from "@/pages/restaurant/restaurant-menu";
import {RestaurantMenuProvider} from "@/context/restaurant-menu-context";
import Cart from "@/pages/restaurant/cart";



function App() {


    return (
        <Routes>
            {/* Root */}
            <Route path="/" element={<HomeLayout/>}>
                <Route index element={<HomePage/>}/>

                {/* Blog */}
                <Route path="blog">
                    <Route index element={<BlogPage/>}/>
                    <Route path=":articleId" element={<ArticlePage/>}/>
                </Route>

                <Route element={<ProtectedRoute/>}>
                    <Route path="onboarding" element={<OnboardingPage/>}/>
                </Route>


            </Route>

            {/* Dashboard */}
            <Route element={<ProtectedRoute/>}>
                <Route path="dashboard" element={<DashboardLayout/>}>
                    <Route index element={<DashboardHome/>}/>
                    <Route path="create-restaurant" element={<CreateRestaurantPage/>}/>
                    <Route path="menu">
                        <Route index element={<MenuList/>}/>
                        <Route path="create">
                            <Route index element={<AddMenuPage/>}/>
                            <Route path="import" element={<ImportMenuPage/>}/>
                            <Route path="manual" element={<CreateMenuPage/>}/>
                        </Route>
                        <Route path=":menuId">
                            <Route index element={<MenuManagementPage/>}/>
                            <Route path="categories">
                                <Route index element={<Navigate to=".."/>}/>
                                <Route path=":categoryId" element={<CategoryDetailsPage/>}/>
                                <Route path="create" element={<CreateCategoryPage/>}/>
                            </Route>

                            <Route path="items">
                                <Route index element={<Navigate to=".."/>}/>
                                <Route path=":itemSlug" element={<ItemDetailsPage/>}/>
                                <Route path="create" element={<CreateItemPage/>}/>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="qrcode" element={<QrCodes/>}/>
                    <Route path="staff" element={<Staff/>}/>
                    <Route path="subscription" element={<Subscription/>}/>
                    <Route path="settings" element={<Settings/>}/>
                    <Route path="support" element={<Support/>}/>
                    <Route path="bookings" element={<Bookings/>}/>
                    <Route path="stock" element={<StockManagement/>}/>
                    <Route path="notifications" element={<NotificationsPage/>}/>
                </Route>
            </Route>

            {/* Auth */}
            <Route path="auth">
                <Route path="forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
                <Route path="reset-password" element={<ResetPasswordPage/>}/>
            </Route>

            <Route path="r/:restaurantSlug/:tableNumber/">
                <Route element={<RestaurantMenuProvider/>}>
                    <Route index element={<RestaurantMenu/>}/>
                    <Route path="cart" element={<Cart/>}/>
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;