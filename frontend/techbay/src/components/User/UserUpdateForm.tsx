import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import PhoneInput from 'react-phone-input-2';
import '../ui/PhoneInput.css';
import { User } from '../../features/auth/authTypes';
import { useEffect, useState } from 'react';
import { USER_PROFILE_UPDATE_URL } from '../../utils/urls/userUrls';
import { toast } from '../ui/use-toast';
import axios from '../../utils/axios';

const ProfileUpdateSchema = z.object({
    firstName: z.string()
        .trim()
        .min(1, "First name is required"),
    lastName: z.string()
        .trim()
        .min(1, "Last name is required"),
    phone_no: z.string(),
})

type UserUpdateFormProp = {
    profileDetails: User,
    onSuccess?: () => void,
}
const UserUpdateForm = ({ profileDetails, onSuccess }: UserUpdateFormProp) => {
    const [sumbitting, setSubmitting] = useState(false);

    const form = useForm<z.infer<typeof ProfileUpdateSchema>>({
        resolver: zodResolver(ProfileUpdateSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone_no: "",
        },
    });

    useEffect(() => {
        const { fullName, phone_no } = profileDetails;
        const firstname = fullName.split(" ")[0];
        const lastname = fullName.split(" ")[1];
        form.reset({
            firstName: firstname,
            lastName: lastname,
            phone_no: phone_no || "",
        })
    }, [])

    const onSubmit = async (data: z.infer<typeof ProfileUpdateSchema>) => {
        
        setSubmitting(true);
        try {
            const resData = await axios.post<User>(USER_PROFILE_UPDATE_URL, {
                fullName: `${data.firstName} ${data.lastName}`,
                phone_no: data.phone_no,
            })
            if (resData) {
                toast({
                    variant: "default",
                    title: `Profile updated successfully`,
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });

                onSuccess?.()
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <Form {...form}>
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
                <Button type="submit" className="w-full" disabled={sumbitting}>
                    Save Changes
                </Button>
            </form>

        </Form>
    );
}

export default UserUpdateForm;
