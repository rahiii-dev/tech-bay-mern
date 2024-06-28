import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import GoogleLogin from "../components/auth/GoogleLogin";
import AuthLayout from "../pages/AuthLayout";
import { LOGIN_PAGE_IMAGE, REGISTER_PAGE_IMAGE } from "../utils/constants";
import { useAppSelector } from "../hooks/useSelector";
import { GoogleOAuthProvider } from "@react-oauth/google"

const AuthScreen = () => {
    const user = useAppSelector((state) => state.auth.user);
    const location = useLocation();

    if (user) {
        const redirectTo = location.state?.from || '/'
        return <Navigate to={redirectTo} />
    }

    return (
        <GoogleOAuthProvider clientId={import.meta.env?.VITE_GOOGLE_CLIENT_ID}>
            <AuthLayout image={location.pathname === '/register' ? REGISTER_PAGE_IMAGE : LOGIN_PAGE_IMAGE}>
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">{location.pathname === '/login' ? 'Login' : 'Register'}</h1>
                        <p className="text-balance text-muted-foreground">
                            {location.pathname === '/login' ? 'Enter your email below to login to your account' : 'Enter your details below to register an account'}
                        </p>
                    </div>

                    <Outlet />

                    <GoogleLogin></GoogleLogin>

                    <div className="mt-4 text-center text-sm pb-10">
                        {location.pathname === '/login' && <>Don&apos;t have an account?{" "}
                            <Link to="/register" className="underline">
                                Sign up
                            </Link></>}

                        {location.pathname === '/register' && <>Already have an account?{" "}
                            <Link to="/login" className="underline">
                                Sign In
                            </Link></>}

                    </div>
                </div>
            </AuthLayout>
        </GoogleOAuthProvider>
    );
}

export default AuthScreen;
