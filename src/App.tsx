import {Route, Routes} from "react-router";
import HomeLayout from "@/components/layout/root/root-layout";
import {HomePage} from "@/pages/root/home";
import DashboardLayout from "@/components/layout/dashboard/dashboard-layout";
import DashboardHome from "@/pages/dashboard/dashboard-home";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import ResetPasswordPage from "@/pages/auth/reset-password";
import Menu from "@/pages/dashboard/menu";
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

                <Route path="onboarding" element={<OnboardingPage/>}/>
            </Route>

            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardLayout/>}>
                <Route index element={<DashboardHome/>}/>
                <Route path="menu" element={<Menu/>}/>
                <Route path="qrcode" element={<QrCodes/>}/>
                <Route path="staff" element={<Staff/>}/>
                <Route path="subscription" element={<Subscription/>}/>
                <Route path="settings" element={<Settings/>}/>
                <Route path="support" element={<Support/>}/>
                <Route path="bookings" element={<Bookings/>}/>
                <Route path="stock" element={<StockManagement/>}/>
                <Route path="notifications" element={<NotificationsPage/>}/>
            </Route>

            {/* Auth */}
            <Route path="auth">
                <Route path="forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
                <Route path="reset-password" element={<ResetPasswordPage/>}/>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;