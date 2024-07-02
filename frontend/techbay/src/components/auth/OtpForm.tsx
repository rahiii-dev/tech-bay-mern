import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { useAuthFormContext } from "./AuthFormContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { BACKEND_ERROR_RESPONSE, BACKEND_RESPONSE } from "../../utils/types";
import { toast } from "../ui/use-toast";
import { useAppDispatch } from "../../hooks/useDispatch";
import { setCredential } from "../../features/auth/authSlice";
import { AxiosError } from "axios";
import { RESEND_OTP_URL, VALIDATE_OTP_URL } from "../../utils/urls/authUrls";
import formatTime from "../../utils/formatTime";

const OtpFormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
});

const OtpForm = () => {
    const { otpPageAccessible, formData, setOtpPageAccessible } = useAuthFormContext();
    const [loading, setLoading] = useState(false);
    const [canResend, setCanResend] = useState(() => {
        return sessionStorage.getItem('resend-otp-active') === '1' ? true  : false;
    });
    const [timer, setTimer] = useState(0);
    const RESEND_OTP_TIME_LIMIT = (1000 * 60 * 2);

    if (!otpPageAccessible || !formData) {
        return <Navigate to="/register" replace />;
    }

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(!canResend){
            const lastResendTime = sessionStorage.getItem('resend-otp-timer');
            
            if (lastResendTime) {
                const elapsed = Date.now() - parseInt(lastResendTime, 10);
                if (elapsed < RESEND_OTP_TIME_LIMIT) {
                    setTimer(RESEND_OTP_TIME_LIMIT - elapsed);
                    setCanResend(false);
                    sessionStorage.setItem('resend-otp-active', '0');
                } else {
                    sessionStorage.setItem('resend-otp-active', '1');
                    setCanResend(true);
                }
            }
            else {
                setCanResend(false);
                sessionStorage.setItem('resend-otp-active', '0');
                sessionStorage.setItem('resend-otp-timer', Date.now().toString());
                setTimer(RESEND_OTP_TIME_LIMIT);
            }
        }

        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1000) {
                    clearInterval(interval);
                    setCanResend(true);
                    sessionStorage.setItem('resend-otp-active', '1');
                    return 0;
                }
                return prevTimer - 1000;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            sessionStorage.removeItem('resend-otp-timer');
            sessionStorage.removeItem('resend-otp-active');
        };
    }, [canResend]);

    useEffect(() => {
        return () => {
            setOtpPageAccessible(false);
        };
    }, []);

    const form = useForm<z.infer<typeof OtpFormSchema>>({
        resolver: zodResolver(OtpFormSchema),
        defaultValues: {
            pin: "",
        },
    });

    async function handleResendOtp() {
        setLoading(true);
        try {
            const resData = await axiosInstance.post<BACKEND_RESPONSE>(RESEND_OTP_URL, { email: formData.email });
            setCanResend(false);
            sessionStorage.setItem('resend-otp-active', '0');
            sessionStorage.setItem('resend-otp-timer', Date.now().toString());
            setTimer(RESEND_OTP_TIME_LIMIT);
            toast({
                variant: "default",
                title: `${resData.data?.extraMessage?.title || 'OTP sent to your email'}`,
                description: `${resData.data?.extraMessage?.description || ''}`,
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
        } catch (error: unknown) {
            const errorData = error as AxiosError<BACKEND_ERROR_RESPONSE>;
            const data = errorData.response?.data;
            if (data) {
                toast({
                    variant: "destructive",
                    title: `${data?.extraMessage?.title || 'OTP verification failed'}`,
                    description: `${data?.extraMessage?.description || ''}`,
                    className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
                });
            }
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit(data: z.infer<typeof OtpFormSchema>) {
        setLoading(true);
        try {
            const resData = await axiosInstance.post<BACKEND_RESPONSE>(VALIDATE_OTP_URL, { email: formData.email, otp: data.pin });
            toast({
                variant: "default",
                title: `${resData.data?.extraMessage?.title || 'OTP validated successfully'}`,
                description: `${resData.data?.extraMessage?.description || ''}`,
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
            dispatch(setCredential(resData.data.data));
            navigate('/');
        } catch (error: unknown | AxiosError<BACKEND_ERROR_RESPONSE>) {
            const errorData = error as AxiosError<BACKEND_ERROR_RESPONSE>;
            const data = errorData.response?.data;
            if (data) {
                toast({
                    variant: "destructive",
                    title: `${data?.extraMessage?.title || 'OTP verification failed'}`,
                    description: `${data?.extraMessage?.description || ''}`,
                    className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
                });
            }
        } finally {
            setLoading(false);
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
                        <Button type="submit" className="w-max" disabled={loading}>Submit</Button>
                        <Button variant='link' className="w-max" type="button" onClick={handleResendOtp} disabled={loading || !canResend}>
                            {canResend ? 'Resend OTP?' : `Resend OTP in ${formatTime(timer)}`}
                        </Button>
                    </div>
                </form>
            </div>
        </Form>
    );
};

export default OtpForm;
