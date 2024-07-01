import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { useAuthFormContext } from "./AuthFormContext"
import { Navigate, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axiosInstance from "../../utils/axios"
import { BACKEND_ERROR_RESPONSE, BACKEND_RESPONSE } from "../../utils/types"
import { toast } from "../ui/use-toast"
import { useAppDispatch } from "../../hooks/useDispatch"
import { setCredential } from "../../features/auth/authSlice"
import { AxiosError } from "axios"

const OtpFormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})


const OtpForm = () => {
    const { otpPageAccessible, formData, setOtpPageAccessible } = useAuthFormContext();

    if (!otpPageAccessible || !formData) {
        return <Navigate to="/register" replace />;
    }

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {

        return () => {
            setOtpPageAccessible(false)
        };
    }, []);

    const form = useForm<z.infer<typeof OtpFormSchema>>({
        resolver: zodResolver(OtpFormSchema),
        defaultValues: {
            pin: "",
        },
    })

    async function handleResendOtp() {
        try {
            const resData = await axiosInstance.post<BACKEND_RESPONSE>('/auth/otp-resend', { email: formData.email})
            toast({
                variant: "default",
                title: `${resData.data?.extraMessage?.title || 'OTP sended to your email'}`,
                description: `${resData.data?.extraMessage?.description || ''}`,
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
            
        } catch (error : unknown) {
            const errorData = error as AxiosError<BACKEND_ERROR_RESPONSE>
            const data = errorData.response?.data
            if (data) {
                toast({
                    variant: "destructive",
                    title: `${data?.extraMessage?.title || 'OTP verification failed'}`,
                    description: `${data?.extraMessage?.description || ''}`,
                    className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
                })

            }
        }
    }

    async function onSubmit(data: z.infer<typeof OtpFormSchema>) {
        try {
            const resData = await axiosInstance.post<BACKEND_RESPONSE>('/auth/otp-validate', { email: formData.email, otp: data.pin })
            toast({
                variant: "default",
                title: `${resData.data?.extraMessage?.title || 'OTP sended to your email'}`,
                description: `${resData.data?.extraMessage?.description || ''}`,
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
            console.log(resData.data);
            dispatch(setCredential(resData.data.data));
            navigate('/')
        } catch (error : unknown |AxiosError<BACKEND_ERROR_RESPONSE>) {
            const errorData = error as AxiosError<BACKEND_ERROR_RESPONSE>;
            const data = errorData.response?.data
            if (data) {
                toast({
                    variant: "destructive",
                    title: `${data?.extraMessage?.title || 'OTP verification failed'}`,
                    description: `${data?.extraMessage?.description || ''}`,
                    className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
                })

            }
        }
    }

    return (
        <Form {...form}>
            <div className="w-full h-full flex flex-col justify-center items-start">
                <div className="grid gap-2 text-center mb-3">
                    <h1 className="text-3xl font-bold">OTP Validation</h1>
                    <p className="text-balance text-muted-foreground">Please enter the one-time password sent to your email.</p>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-4">
                    <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>One-Time Password</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator></InputOTPSeparator>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between items-center">
                        <Button type="submit" className="w-max">Submit</Button>
                        <Button variant='link' className="w-max" type="button" onClick={handleResendOtp}>Resend Otp?</Button>
                    </div>
                </form>
            </div>
        </Form>
    )
}

export default OtpForm;
