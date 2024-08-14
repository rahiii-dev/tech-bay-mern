import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import axios from "../../utils/axios";
import { PRODUCT_OFFER_CREATE_URL, PRODUCT_OFFER_UPDATE_URL, GET_PRODUCT_OFFER_URL } from "../../utils/urls/adminUrls";
import { useEffect, useState } from "react";
import { getBackendError, isBackendError } from "../../utils/types/backendResponseTypes";
import { toast } from "../ui/use-toast";

const ProductOfferSchema = z.object({
    discount: z.preprocess(
        value => value === "" ? -1 : parseFloat(value as string),
        z.number().min(1, "Discount must be at least 1%").max(100, "Discount maximum is 100%")
    ),
    startDate: z.string().refine(
        (date) => !isNaN(Date.parse(date)),
        "Start Date must be a valid date"
    ),
    endDate: z.string().refine(
        (date) => !isNaN(Date.parse(date)),
        "End Date must be a valid date"
    ),
    isActive: z.boolean().default(true),
}).superRefine(({ startDate, endDate }, ctx) => {
    if (new Date(endDate) <= new Date(startDate)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End Date must be after the Start Date",
            path: ["endDate"],
        });
    }
});


type ProductOfferFormType = {
    productId: string;
}

const ProductOfferForm = ({ productId }: ProductOfferFormType) => {
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<z.infer<typeof ProductOfferSchema>>({
        resolver: zodResolver(ProductOfferSchema),
        defaultValues: {
            discount: 0,
            startDate: "",
            endDate: "",
            isActive: true,
        },
    });

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const response = await axios.get(GET_PRODUCT_OFFER_URL(productId));
                if (response.data) {
                    form.reset({
                        discount: response.data.discount,
                        startDate: new Date(response.data.startDate).toISOString().split("T")[0],
                        endDate: new Date(response.data.endDate).toISOString().split("T")[0],
                        isActive: response.data.isActive,
                    });
                    setIsEditing(true);
                }
            } catch (error) {
                console.error("Failed to fetch product offer:", error);
            }
        };

        fetchOffer();
    }, [productId]);

    const onSubmit = async (data: z.infer<typeof ProductOfferSchema>) => {
        try {
            if (isEditing) {
                await axios.put(PRODUCT_OFFER_UPDATE_URL(productId), data);
            } else {
                await axios.post(PRODUCT_OFFER_CREATE_URL, { ...data, productId });
            }
            toast({
                variant: "default",
                title: `Offer ${isEditing ? "Updated" : "Saved"} successfully.`,
                description: "",
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
        } catch (error: any) {
            console.error("Failed to save product offer:", error);
            if (isBackendError(error)) {
                const { type, message } = getBackendError(error);
                if (type === "Error") {
                    toast({
                        variant: "destructive",
                        title: message || "Failed to save offer",
                        className: "w-auto py-6 px-12 fixed bottom-2 right-2",
                    });
                }
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} min={0} max={100} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" min={!isEditing ? today : undefined} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" min={!isEditing ? today : undefined} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="my-2">
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex gap-2 items-center">
                                <FormLabel className="text-gray-400">Mark offer as active</FormLabel>
                                <FormControl>
                                    <Checkbox
                                        checked={!!field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="my-2">
                    <Button type="submit">{isEditing ? "Update Offer" : "Add Offer"}</Button>
                </div>
            </form>
        </Form>
    );
};

export default ProductOfferForm;
