import { Link, Navigate, useLocation } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import AuthLayout from "../pages/AuthLayout";
import { REGISTER_PAGE_IMAGE } from "../utils/constants";
import { useAppSelector } from "../hooks/useSelector";

const RegisterScreen = () => {
    const user = useAppSelector((state) => state.auth.user);
    const location = useLocation();
    if(user) {
        const redirectTo = location.state?.from || '/'
        return <Navigate to={redirectTo}/>
    }

    return (
        <AuthLayout image={REGISTER_PAGE_IMAGE}>
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Register</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your details below to register an account
                    </p>
                </div>
                <RegisterForm />
                <div className="mt-4 text-center text-sm pb-10">
                    Already have an account?{" "}
                    <Link to="/login" className="underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}

export default RegisterScreen;
