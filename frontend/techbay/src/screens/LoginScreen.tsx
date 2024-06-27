import { Link, Navigate, useLocation } from "react-router-dom"
import LoginForm from "../components/auth/LoginForm"
import AuthLayout from "../pages/AuthLayout"
import {LOGIN_PAGE_IMAGE} from '../utils/constants'
import { useAppSelector } from "../hooks/useSelector"

export default function LoginScreen() {
    const user = useAppSelector((state) => state.auth.user);
    const location = useLocation();
    if(user) {
        const redirectTo = location.state?.from || '/'
        return <Navigate to={redirectTo}/>
    }
    
    return (
        <AuthLayout image={LOGIN_PAGE_IMAGE}>
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <LoginForm />
                <div className="mt-4 text-center text-sm pb-10">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}

