import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { User } from "../../features/auth/authTypes";
import { setCredential } from "../../features/auth/authSlice";
import { LOGIN_URL } from "../../utils/urls/authUrls";
import { useAppDispatch } from "../../hooks/useDispatch";

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
    const dispatch = useAppDispatch();
    const { loading, error, fetchData } = useAxios<User>({
        url: LOGIN_URL,
        method: 'POST',
        data: {}
    }, false);

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(dataToSend: z.infer<typeof LoginSchema>) {
        const resData = await fetchData({
            url: LOGIN_URL,
            method: 'POST',
            data: dataToSend
        })

        if (resData) {
            dispatch(setCredential(resData));
            if (resData.isAdmin || resData.isStaff) {
                navigate('/admin/dashboard')
            }
            else {
                navigate('/')
            }
        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    Login
                </Button>

            </form>
        </Form>
    );
}

export default LoginForm;
