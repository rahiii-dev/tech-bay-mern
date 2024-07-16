import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import PasswordInput from '../ui/PasswordInput';
import { USER_CHANGE_PASS_URL } from '../../utils/urls/userUrls';
import { toast } from '../ui/use-toast';
import axios from '../../utils/axios';
import { useState } from 'react';

const ChangePasswordFormSchema = z.object({
    oldPassword: z.string()
        .trim()
        .min(1, "Old password is required"),
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

const ChangePasswordForm = () => {
    const [sumbitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof ChangePasswordFormSchema>>({
        resolver: zodResolver(ChangePasswordFormSchema),
        defaultValues: {
            oldPassword: "",
            password: "",
            confirmPassword: ""
        },
    });

    const onSubmit = async (data: z.infer<typeof ChangePasswordFormSchema>) => {
        setSubmitting(true);
        setError("")
        try {
            await axios.put(USER_CHANGE_PASS_URL, data)

            form.reset({
                oldPassword: "",
                password: "",
                confirmPassword: ""
            });

            toast({
                variant: "default",
                title: `Password changed successfully`,
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
        
        } catch (error: any) {
            if(error.response?.data){
                setError(error.response.data.message)
            }
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-4">
                <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Old Password</FormLabel>
                            <FormControl>
                                <PasswordInput className='text-black'  {...field} />
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
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <PasswordInput className='text-black'  {...field} />
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
                                <PasswordInput className='text-black'  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" variant={"secondary"} className="w-full" disabled={sumbitting}>
                    Update
                </Button>
            </form>
        </Form>
    );
}

export default ChangePasswordForm;
