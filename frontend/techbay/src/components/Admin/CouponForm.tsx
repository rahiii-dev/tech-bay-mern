import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import axios from "../../utils/axios";
import { COUPON_CREATE_URL, COUPON_EDIT_URL } from "../../utils/urls/adminUrls";
import { isBackendError } from "../../utils/types/backendResponseTypes";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Coupon } from "../../utils/types/couponTypes";

const couponSchema = z.object({
    code: z.string()
        .trim()
        .min(1, "Code is required"),
    discount: z.preprocess(
        value => value === "" ? -1 : parseFloat(value as string),
        z.number().min(1, "Discount must be at least 1%").max(100, "Discount maximum is 100%")
    ),
    expiryDate: z.string()
        .refine((val) => !isNaN(Date.parse(val)) && new Date(val) >= new Date(), "Expiry date must be today or in the future"),
    isActive: z.boolean().optional(),
    minAmount: z.preprocess(
        value => value === "" ? -1 : parseFloat(value as string),
        z.number().min(0, "Minimum Amount must be a positive number")
    ),
    maxAmount: z.preprocess(
        value => value === "" ? -1 : parseFloat(value as string),
        z.number().min(0, "Maximum Amount must be a positive number")
    ),
}).refine(data => data.minAmount < data.maxAmount, {
    message: "Maxim amount should be gretaer than Min amount",
    path: ["maxAmount"],
});

type CouponFormProp = {
    successFormSubmit: () => void;
    coupon?: Coupon | null;
}

const CouponForm = ({ successFormSubmit, coupon }: CouponFormProp) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('')

    const form = useForm<z.infer<typeof couponSchema>>({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            code: "",
            discount: 1,
            expiryDate: "",
            isActive: true,
            minAmount: 0,
            maxAmount: 0
        },
    });

    useEffect(() => {
        if (coupon) {
            form.reset({
                code: coupon.code,
                discount: coupon.discount,
                expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
                isActive: coupon.isActive,
                minAmount: coupon.minAmount,
                maxAmount: coupon.maxAmount
            });
        }
    }, [coupon]);

    async function onSubmit(dataToSend: z.infer<typeof couponSchema>) {
        setIsSubmitting(true);
        setError('');
        try {
            let response;
            if (coupon) {
                response = await axios.put<Coupon>(COUPON_EDIT_URL(coupon._id), dataToSend);
            } else {
                response = await axios.post<Coupon>(COUPON_CREATE_URL, dataToSend);
            }
            if (response.data) {
                if (!coupon) {
                    form.reset({
                        code: '',
                        discount: 0,
                        expiryDate: '',
                        isActive: true,
                        minAmount: 0,
                        maxAmount: 0
                    });
                }
                toast({
                    variant: "default",
                    title: `Coupon ${coupon ? 'Updated' : 'Added'} successfully`,
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
                successFormSubmit();
            }
        } catch (error: any) {
            if (isBackendError(error)) {
                const { type, message } = error?.response?.data;
                if (type === 'Error') {
                    setError(message);
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <Form {...form}>
            <DialogContent className="sm:max-w-[500px] h-[80vh] overflow-y-scroll custom-scrollbar">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{coupon ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} min={1} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" min={today} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="minAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Minimum Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} min={0} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Maximum Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} min={0} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>{coupon ? 'Save Changes' : 'Submit'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Form>
    );
}

export default CouponForm;
