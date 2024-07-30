import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import axios from "../../utils/axios";
import { CATEGORY_CREATE_URL, CATEGORY_EDIT_URL } from "../../utils/urls/adminUrls";
import { BACKEND_RESPONSE, isBackendError } from "../../utils/types/backendResponseTypes";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Category } from "../../utils/types/categoryTypes";


const categorySchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Name is required"),
    description: z.string()
        .trim()
})

type CategoryFormProp = {
    succesFormSubmit : () => void;
    category?: Category | null;
}

const CategoryForm = ({succesFormSubmit, category}: CategoryFormProp) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('')

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: ""
        },
    })

    useEffect(() => {
        if(category){
            form.reset({name: category.name, description: category.description})
        }
    }, [category])

    async function onSubmit(dataToSend: z.infer<typeof categorySchema>) {
        setIsSubmitting(true)
        setError('')
        try {
            let response;
            if(category){
                response = await axios.put<BACKEND_RESPONSE<Category>>(CATEGORY_EDIT_URL(category._id), dataToSend);
            }
            else {
                response = await axios.post<BACKEND_RESPONSE<Category>>(CATEGORY_CREATE_URL, dataToSend);
            }
            if(response.data){
                if(!category){
                    form.reset({name: '', description: ''})
                }
                toast({
                    variant: "default",
                    title: `Category ${category ? 'Updated' : 'Added'} succesfully`,
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
                succesFormSubmit();
            }
        } catch (error: any) {
            if(isBackendError(error)){
                const {type, message} = error?.response?.data;
                if(type === 'Error'){
                    setError(message)
                }
            }
        }
        finally{
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
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
                        <Button type="submit" disabled={isSubmitting}>{category ? 'Save Changes' : 'Submit'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Form>
    );
}

export default CategoryForm;
