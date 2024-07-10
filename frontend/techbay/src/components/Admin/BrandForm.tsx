import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import axios from "../../utils/axios";
import { BRAND_CREATE_URL, BRAND_EDIT_URL } from "../../utils/urls/adminUrls";
import { toast } from "../ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { isBackendError } from "../../utils/types/backendResponseTypes";
import { Brand } from "../../utils/types/brandTypes";

const brandSchema = z.object({
    name: z.string().min(1, { message: "Brand name is required" }),
    description: z.string().trim()
});

type BrandFormProps = {
    brand?: Brand;
    succesFormSubmit: () => void;
}

const BrandForm = ({ brand, succesFormSubmit }: BrandFormProps) => {
    const [error, setError] = useState('')

    const form = useForm<z.infer<typeof brandSchema>>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: "",
            description: ""
        },
    })

    useEffect(() => {
        if (brand) {
            form.reset({ name: brand.name, description: brand.description })
        }
    }, [brand]);

    const onSubmit = async (values: z.infer<typeof brandSchema>) => {
        try {
            if (brand) {
                await axios.put(BRAND_EDIT_URL(brand._id), values);
                toast({
                    variant: "default",
                    title: "Brand updated successfully.",
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
            } else {
                await axios.post(BRAND_CREATE_URL, values);
                toast({
                    variant: "default",
                    title: "Brand created successfully.",
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
            }
            succesFormSubmit();
        } catch (error: any) {
            if (isBackendError(error.response?.data)) {
                const { type, message } = error?.response?.data;
                if (type === 'Error') {
                    setError(message)
                }
            }
        }
    };

    return (
        <Form {...form}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{brand ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>{brand ? 'Save Changes' : 'Submit'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Form>
    );
};

export default BrandForm;
