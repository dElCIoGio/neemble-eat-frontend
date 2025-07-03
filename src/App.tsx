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
import {Orders} from "@/pages/restaurant/orders";
import {OrdersTracking} from "@/pages/dashboard/order-tracking";
import PrivacyPolicy from "@/pages/outframe/privacy-policy";
import ContactPage from "@/pages/root/Contact";
import AboutUs from "@/pages/root/AboutUs";
import Demo from "@/pages/root/Demo";
import Pricing from "@/pages/root/Pricing";
import CookiesPolicy from "@/pages/root/CookiesPolicy";
import DigitalMenu from "@/pages/root/DigitalMenu";
import OrderManagement from "@/pages/root/OrdersManagement";
import DataAnalysis from "@/pages/root/DataAnalysis";
import RestaurantInvitation from "@/pages/dashboard/invitation";
import OrderCustomizationPage from "@/pages/dashboard/custom-order";
import TableMonitor from "@/pages/dashboard/table-monitor";
import UserProfile from "@/pages/dashboard/profile";
import TermsOfUse from "@/pages/outframe/terms-of-use";



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


                <Route path="privacy-policy" element={<PrivacyPolicy/>}/>
                <Route path="cookie-policy" element={<CookiesPolicy/>}/>
                <Route path="solutions">
                    <Route path="digital-menu" element={<DigitalMenu/>}/>
                    <Route path="orders-management" element={<OrderManagement/>}/>
                    <Route path="analytics" element={<DataAnalysis/>}/>
                </Route>
                <Route path="demo" element={<Demo/>}/>
                <Route path="contact" element={<ContactPage/>}/>
                <Route path="about-us" element={<AboutUs/>}/>
                <Route path="price" element={<Pricing/>}/>AboutUs.tsx


            </Route>

            {/* Dashboard (Protected) */}
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
                    <Route path="orders-tracking" element={<OrdersTracking/>}/>
                    <Route path="table-monitor" element={<TableMonitor/>}/>
                    <Route path="profile" element={<UserProfile/>}/>
                </Route>
            </Route>

            {/* Auth */}
            <Route path="auth">
                <Route path="forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
                <Route path="reset-password" element={<ResetPasswordPage/>}/>
            </Route>

            {/* Restaurant Menu */}
            <Route path="r/:restaurantSlug/:tableNumber/">
                <Route element={<RestaurantMenuProvider/>}>
                    <Route index element={<RestaurantMenu/>}/>
                    <Route path="cart" element={<Cart/>}/>
                    <Route path="orders" element={<Orders/>} />
                </Route>
            </Route>

            {/* Invitation */}
            <Route path="invitation">
                <Route path=":invitationId" element={<RestaurantInvitation/>}/>
            </Route>

            <Route path="custom-order/:restaurantSlug" element={<OrderCustomizationPage/>}/>

            <Route path="*" element={<NotFound/>}/>

            <Route path="outframe">
                <Route path="privacy-policy" element={<PrivacyPolicy/>}/>
                <Route path="terms-of-use" element={<TermsOfUse/>}/>
            </Route>
        </Routes>
    );
}

export default App;