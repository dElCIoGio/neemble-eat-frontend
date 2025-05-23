import {Route, Routes} from "react-router";
import HomeLayout from "@/components/layout/root/root-layout.tsx";
import {HomePage} from "@/pages/root/home.tsx";
import DashboardLayout from "@/components/layout/dashboard/dashboard-layout.tsx";
import DashboardHome from "@/pages/dashboard/dashboard-home.tsx";
import ForgotPasswordPage from "@/pages/auth/forgot-password.tsx";
import LoginPage from "@/pages/auth/login.tsx";
import RegisterPage from "@/pages/auth/register.tsx";
import ResetPasswordPage from "@/pages/auth/reset-password.tsx";
import Menu from "@/pages/dashboard/menu.tsx";
import QrCodes from "@/pages/dashboard/qr-codes.tsx";
import Staff from "@/pages/dashboard/staff.tsx";
import Subscription from "@/pages/dashboard/subscription.tsx";
import Settings from "@/pages/dashboard/settings.tsx";
import Support from "@/pages/dashboard/support.tsx";
import Bookings from "@/pages/dashboard/bookings.tsx";
import NotFound from "@/pages/root/not-found.tsx";
import BlogPage from "@/pages/root/blog";
import ArticlePage from "@/pages/root/blog/article.tsx";

function App() {
    return (
        <Routes>
            {/* Root */}
            <Route path="/" element={<HomeLayout/>}>
                <Route index element={<HomePage/>}/>

                <Route path="blog">
                    <Route index element={<BlogPage/>}/>
                    <Route path=":articleId" element={<ArticlePage/>}/>
                </Route>
            </Route>

            {/* Blog */}


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