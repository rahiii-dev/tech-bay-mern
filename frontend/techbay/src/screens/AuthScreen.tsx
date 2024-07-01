import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthLayout from "../pages/AuthLayout";
import { LOGIN_PAGE_IMAGE, REGISTER_PAGE_IMAGE } from "../utils/constants";
import { useAppSelector } from "../hooks/useSelector";
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthFormContextProvider } from "../components/auth/AuthFormContext";

const AuthScreen = () => {
    const user = useAppSelector((state) => state.auth.user);
    const location = useLocation();

    if (user) {
        const redirectTo = location.state?.from || '/'
        return <Navigate to={redirectTo} />
    }

    return (
        <GoogleOAuthProvider clientId={import.meta.env?.VITE_GOOGLE_CLIENT_ID}>
            <AuthFormContextProvider>
                <AuthLayout image={location.pathname === '/register' ? REGISTER_PAGE_IMAGE : LOGIN_PAGE_IMAGE}>
                    <div className="w-full max-w-[350px] flex flex-col gap-4">
                        <Outlet />
                    </div>
                </AuthLayout>
            </AuthFormContextProvider>
        </GoogleOAuthProvider>
    );
}

export default AuthScreen;
