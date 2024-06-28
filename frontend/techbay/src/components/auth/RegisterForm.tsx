import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxios from "../../hooks/useAxios";
import { REGISTER_URL } from "../../utils/urls/authUrls";
import { useNavigate } from "react-router-dom";
import { setCredential } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks/useDispatch";
import { User } from "../../features/auth/authTypes";

// Create a new schema for the registration form
const RegisterSchema = z.object({
    firstName: z.string()
        .trim()
        .min(1, "First name is required"),
    lastName: z.string()
        .trim()
        .min(1, "Last name is required"),
    email: z.string()
        .trim()
        .min(1, "Email is required")
        .email('Invalid Email address'),
    phone_no: z.string()
        .min(1, "Phone number is required"),
    password: z.string()
        .trim()
        .min(1, "Password is required"),
    confirmPassword: z.string()
        .trim()
        .min(1, "Confirm password is required")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const RegisterForm = () => {
    const { loading, error, fetchData } = useAxios<User>({
        url: REGISTER_URL,
        method: 'POST',
        data: {}
    }, false)

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone_no: "",
            password: "",
            confirmPassword: ""
        },
    });

    async function onSubmit(dataToSend: z.infer<typeof RegisterSchema>) {
        const resData = await fetchData({
            url: REGISTER_URL,
            method: 'POST',
            data: {
                ...dataToSend,
                fullName: `${dataToSend.firstName} ${dataToSend.lastName}`
            }
        })

        if (resData) {
            dispatch(setCredential(resData));
            navigate('/')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
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
                    name="phone_no"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
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
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    Register
                </Button>
            </form>
        </Form>
    );
}

export default RegisterForm;
