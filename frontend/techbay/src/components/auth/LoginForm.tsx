import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { User } from "../../features/auth/authTypes";
import { setCredential } from "../../features/auth/authSlice";
import { LOGIN_URL } from "../../utils/urls/authUrls";
import { useAppDispatch } from "../../hooks/useDispatch";
import GoogleLogin from "./GoogleLogin";
import { BACKEND_RESPONSE } from "../../utils/types/backendResponseTypes";
import { toast } from "../ui/use-toast";
import { useAuthFormContext } from "./AuthFormContext";
import { useEffect } from "react";
import PasswordInput from "../ui/PasswordInput";

const LoginSchema = z.object({
    email: z.string()
        .trim()
        .min(1, "Email is required")
        .email('Invalid Email address'),
    password: z.string()
        .trim()
        .min(1, "Password is required")
})

const LoginForm = () => {
    const { setOtpPageAccessible, setFormData } = useAuthFormContext();
    const { loading, error, fetchData } = useAxios<BACKEND_RESPONSE<User>>({
        url: LOGIN_URL,
        method: 'POST',
        data: {}
    }, false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    useEffect(() => {
        if (error) {
            if (error.type === 'Account') {
                setFormData({ email: form.getValues('email') })
                setOtpPageAccessible(true)
                navigate('/otp-validate')
                toast({
                    variant: "destructive",
                    title: `${error?.extraMessage?.title || 'Authetication failed'}`,
                    description: `${error?.extraMessage?.description || ''}`,
                    className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
                })

            }
        }
    }, [error])


    async function onSubmit(dataToSend: z.infer<typeof LoginSchema>) {
        const resData = await fetchData({
            url: LOGIN_URL,
            method: 'POST',
            data: dataToSend
        })

        if (resData) {
            dispatch(setCredential(resData.data));
            if (resData.data?.isAdmin || resData.data?.isStaff) {
                navigate('/admin/dashboard')
            }
            else {
                navigate('/')
            }
        }

    }

    return (
        <Form {...form}>
            <div className="grid gap-2 text-center mb-12">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <div className="text-right">
                    <Link to="/register" className="text-sm">
                        Forgot Password?
                    </Link>
                </div> */}
                {error && <p className="text-red-500">{error.type === 'Error' ? error.message : ''}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    Login
                </Button>
                <GoogleLogin key={'google-login'}></GoogleLogin>
            </form>
            <div className="mt-4 text-center text-sm pb-10">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="underline">
                    Sign up
                </Link>
            </div>
        </Form>
    );
}

export default LoginForm;
