import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxios from "../../hooks/useAxios";
import { REGISTER_URL } from "../../utils/urls/authUrls";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './PhoneInput.css';
import GoogleLogin from "./GoogleLogin";
import { toast } from "../ui/use-toast";
import { useAuthFormContext } from "./AuthFormContext";
import { useEffect } from "react";
import { BACKEND_RESPONSE } from "../../utils/types";
import PasswordInput from "../ui/PasswordInput";

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
    phone_no: z.string(),
    password: z.string()
        .trim()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string()
        .trim()
        .min(1, "Confirm password is required")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const RegisterForm = () => {
    const {formData, setFormData, setOtpPageAccessible} = useAuthFormContext();

    const { loading, error, fetchData } = useAxios<BACKEND_RESPONSE>({
        url: REGISTER_URL,
        method: 'POST',
        data: {}
    }, false)

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

    useEffect(() => {
        if(formData){
            form.reset(formData)
        }
        
    }, [formData]);


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
            const { password, confirmPassword, ...formData } = dataToSend
            setFormData(formData);
            setOtpPageAccessible(true);
            toast({
                variant: "default",
                title: `${resData?.extraMessage?.title || 'OTP sended to your email'}`,
                description: `${resData?.extraMessage?.description || ''}`,
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
            navigate('/otp-validate');
        }
    }

    return (
        <Form {...form}>
            <div className="grid gap-2 text-center mb-12">
                <h1 className="text-3xl font-bold">Register</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your details below to register an account
                </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-4">
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
                                <PhoneInput
                                    {...field}
                                    country={'in'}
                                    inputProps={{
                                        name: 'phone_no',
                                        required: true,
                                    }}
                                    containerClass="phone-input-container"
                                    inputClass="phone-input"
                                />
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
                                <PasswordInput {...field}/>
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
                                <PasswordInput {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <p className="text-red-500">{error?.message}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    Register
                </Button>
                <GoogleLogin key={'google-login'}></GoogleLogin>
            </form>
            <div className="mt-4 text-center text-sm pb-10">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                    Sign In
                </Link>
            </div>
        </Form>
    );
}

export default RegisterForm;
