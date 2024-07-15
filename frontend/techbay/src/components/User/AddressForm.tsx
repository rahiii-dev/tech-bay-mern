import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import { USER_ADDRESS_ADD_URL } from "../../utils/urls/userUrls";
import axios from "../../utils/axios";
import { Checkbox } from "../ui/checkbox";
// import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../ui/PhoneInput.css';
import { useState } from "react";
import { Addresss } from "../../utils/types/addressTypes";

const AddressSchema = z.object({
    fullName: z.string().trim().min(1, "Full name is required"),
    phone: z.string().trim().min(1, "Phone number is required"),
    addressLine1: z.string().trim().min(1, "Address Line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().trim().min(1, "City is required"),
    state: z.string().trim().min(1, "State is required"),
    zipCode: z.string().trim().min(1, "Zip Code is required"),
    country: z.string().trim().min(1, "Country is required"),
    isDefault: z.boolean().optional(),
});

type AddressFormProp = {
    onSuccess?: (data: Addresss) => void;
}
const AddressForm = ({onSuccess}: AddressFormProp) => {
    const [sumbitting, setSubmitting] = useState(false);

    const form = useForm<z.infer<typeof AddressSchema>>({
        resolver: zodResolver(AddressSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            isDefault: true
        },
    });

    async function onSubmit(data: z.infer<typeof AddressSchema>) {
        setSubmitting(true);
        try {
            const resData = await axios.post<Addresss>(USER_ADDRESS_ADD_URL, data)
            if (resData) {
                toast({
                    variant: "default",
                    title: 'Address added successfully',
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });

                onSuccess?.(resData.data)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid gap-4">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
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
                    name="addressLine1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                        <FormItem className="flex gap-2 items-center">
                            <FormLabel>Set as default address</FormLabel>
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
                <Button disabled={sumbitting} type="submit" className="w-full">
                    Add Address
                </Button>
            </form>
        </Form>
    );
}

export default AddressForm;