import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from 'zod';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import { USER_ADDRESS_ADD_URL, USER_ADDRESS_SINGLE_URL, USER_ADDRESS_UPDATE_URL } from "../../utils/urls/userUrls";
import axios from "../../utils/axios";
import { Checkbox } from "../ui/checkbox";
// import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../ui/PhoneInput.css';
import { useEffect, useState } from "react";
import { Addresss } from "../../utils/types/addressTypes";
import useAxios from "../../hooks/useAxios";

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
    addressId?: string | null;
}
const AddressForm = ({ onSuccess, addressId }: AddressFormProp) => {
    const [sumbitting, setSubmitting] = useState(false);
    const { data: addressData, loading: addresDataLoading, fetchData: fetchAddress } = useAxios<Addresss>({}, false)

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

    useEffect(() => {
        if (addressId) {
            fetchAddress({
                url: USER_ADDRESS_SINGLE_URL(addressId),
                method: 'GET'
            })
        }
        else {
            form.reset({
                fullName: "",
                phone: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
                isDefault: true
            })
        }

        return () => {
            form.reset({
                fullName: "",
                phone: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
                isDefault: true
            })
        }
    }, [addressId])

    useEffect(() => {
        if (addressData) {
            form.reset({
                fullName: addressData.fullName,
                phone: addressData.phone,
                addressLine1: addressData.addressLine1,
                addressLine2: addressData.addressLine2,
                city: addressData.city,
                state: addressData.state,
                zipCode: addressData.zipCode,
                country: addressData.country,
                isDefault: addressData.isDefault
            })
        }
    }, [addressData])

    async function onSubmit(data: z.infer<typeof AddressSchema>) {
        setSubmitting(true);
        try {
            const url = addressId ? USER_ADDRESS_UPDATE_URL(addressId) : USER_ADDRESS_ADD_URL;
            const resData = await axios.post<Addresss>(url, data)
            if (resData) {
                toast({
                    variant: "default",
                    title: `Address ${addressId ? 'updated' : 'added'} successfully`,
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
                <Button disabled={(sumbitting || addresDataLoading)} type="submit" className="w-full">
                    {addressId ? "Edit Address" : "Add Address"}
                </Button>
            </form>
        </Form>
    );
}

export default AddressForm;