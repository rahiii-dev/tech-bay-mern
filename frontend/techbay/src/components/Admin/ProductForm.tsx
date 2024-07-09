import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ImageInput from "../ui/ImageInput";
import { CategoryListResponse, CategoryResponse } from "../../pages/Admin/Category";
import { BrandListResponse, BrandResponse } from "../../pages/Admin/Brands";
import { BRAND_LIST_URL, CATEGORY_LIST_URL, PRODUCT_CREATE_URL, PRODUCT_EDIT_URL, SINGLE_PRODUCT_URL } from "../../utils/urls/adminUrls";
import { BACKEND_RESPONSE } from "../../utils/types";
import axios from "../../utils/axios";
import { toast } from "../ui/use-toast";
import useAxios from "../../hooks/useAxios";
import { SERVER_URL } from "../../utils/constants";
import { Product } from "../../features/product/productTypes";
import { useAppDispatch } from "../../hooks/useDispatch";
import { getProductsList } from "../../features/product/productThunk";
import { urlToFile } from "../../utils/appHelpers";

const MIN_IMAGE = 3;
const MAX_IMAGE = 6;

const ProductFormSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Product name is required"),
    description: z.string()
        .trim()
        .min(1, "Product details are required"),
    price: z.preprocess(
        value => value === "" ? -1 : parseFloat(value as string),
        z.number().min(0, "Price must be a positive number")
    ),
    stock: z.preprocess(
        value => value === "" ? -1 : parseInt(value as string),
        z.number().min(0, "Quantity must be a positive number")
    ),
    isActive: z.preprocess(
        value => value === "true",
        z.boolean()
    ).refine(val => typeof val === "boolean", { message: "Status is required" }),
    category: z.string().min(1, "Category is required"),
    brand: z.string().min(1, "Brand is required"),
    thumbnail: z.instanceof(File, { message: "Thumbnail is required" }).nullable(),
    images: z.array(z.instanceof(File))
        .min(MIN_IMAGE, `At least ${MIN_IMAGE} images are required`)
        .max(MAX_IMAGE, `No more than ${MAX_IMAGE} images are allowed`)
});


type ProductFormProps = {
    prdID?: string;
}

const ProductForm = forwardRef(({ prdID }: ProductFormProps, ref) => {
    const { data: productRes, error, fetchData } = useAxios<BACKEND_RESPONSE<Product>>({}, false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (prdID) {
            fetchData({
                url: SINGLE_PRODUCT_URL(prdID),
                method: 'GET'
            })
        }
    }, [prdID])

    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [brands, setBrands] = useState<BrandResponse[]>([]);

    const form = useForm<z.infer<typeof ProductFormSchema>>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            isActive: true,
            category: "",
            brand: "",
            thumbnail: null,
            images: [],
        },
    });

    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            const categoriesResponse = await axios.get<BACKEND_RESPONSE<CategoryListResponse>>(`${CATEGORY_LIST_URL}?filter=active`);
            const brandsResponse = await axios.get<BACKEND_RESPONSE<BrandListResponse>>(`${BRAND_LIST_URL}?filter=active`);

            if (categoriesResponse.data.data) {
                setCategories(categoriesResponse.data.data?.categories);
            }

            if (brandsResponse.data.data) {
                setBrands(brandsResponse.data.data?.brands);
            }
        };

        fetchCategoriesAndBrands();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (productRes) {
                const product = productRes.data;

                let thumbnailFile: File | undefined;
                if (product?.thumbnail) {
                    thumbnailFile = await urlToFile(`${SERVER_URL}${product.thumbnail}`);
                }

                let imageFiles: File[] = [];
                if (product?.images) {
                    imageFiles = await Promise.all(product.images.map(imageUrl => urlToFile(`${SERVER_URL}${imageUrl}`)));
                }


                form.reset({
                    name: product?.name,
                    description: product?.description,
                    price: product?.price,
                    stock: product?.stock,
                    isActive: product?.isActive,
                    category: product?.category,
                    brand: product?.brand,
                    thumbnail: thumbnailFile,
                    images: imageFiles
                });
            }
        };

        fetchProductDetails();
    }, [productRes]);

    useEffect(() => {
        if(error){
            toast({
                variant: "destructive",
                title: `Failed to fetch product`,
                className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
            })
        }
    }, [error])



    const handleImageChange = (index: number, file: File) => {
        const newImages = [...form.getValues('images')];
        newImages[index] = file;
        form.setValue("images", newImages);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = form.getValues('images').filter((_, i) => i !== index);
        form.setValue("images", newImages);
    };

    const handleThumbnailInput = (file: File) => {
        form.setValue("thumbnail", file);
    };

    const handleRemoveThumbnail = () => {
        form.setValue("thumbnail", null);
    };

    const handleImagesError = (error: string) => {
        form.setError('images', { message: error });
    };

    const handleThumbnailError = (error: string) => {
        form.setError("thumbnail", { message: error });
    };

    useImperativeHandle(ref, () => ({
        submitForm: form.handleSubmit(onSubmit)
    }));

    const onSubmit = async (data: z.infer<typeof ProductFormSchema>) => {
        if (data.thumbnail === null) {
            form.setError("thumbnail", { message: "Thumbnail is required" });
            return;
        }


        try {
            const formData = new FormData();

            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price.toString());
            formData.append('stock', data.stock.toString());
            formData.append('isActive', data.isActive.toString());
            formData.append('category', data.category);
            formData.append('brand', data.brand);
            formData.append('thumbnail', data.thumbnail);

            data.images.forEach((image, _) => {
                formData.append(`images`, image);
            });


            if (prdID) {
                await axios.put<BACKEND_RESPONSE>(PRODUCT_EDIT_URL(prdID), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast({
                    variant: "default",
                    title: `Product Updated successfully`,
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
            } else {
                await axios.post<BACKEND_RESPONSE>(PRODUCT_CREATE_URL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                form.reset({
                    name: "",
                    description: "",
                    price: 0,
                    stock: 0,
                    isActive: true,
                    category: "",
                    brand: "",
                    thumbnail: null,
                    images: [],
                })
            }

            dispatch(getProductsList());
            toast({
                variant: "default",
                title: `Product ${prdID ? 'Updated' : 'Added'} successfully`,
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });

        } catch (error) {
            toast({
                variant: "destructive",
                title: `Failed to ${prdID ? 'Update' : 'Add'} product`,
                className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
            })
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col-reverse md:flex-row justify-between gap-3 pb-8">
                <div className="w-full md:w-max flex md:flex-col gap-3">
                    <div className="w-full bg-primary-foreground rounded-md shadow-lg px-4 py-6">
                        <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-bold mb-2">Thumbnail</FormLabel>
                                    <p className="mb-2 text-sm text-gray-400">Add thumbnail for your product</p>
                                    <FormControl>
                                        <ImageInput
                                            index={-1}
                                            defaultImage={field.value ? URL.createObjectURL(field.value) : undefined}
                                            onImageChange={(_, file) => handleThumbnailInput(file)}
                                            onRemoveImage={(_) => handleRemoveThumbnail()}
                                            onImageError={handleThumbnailError}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full bg-primary-foreground rounded-md shadow-lg px-4 py-6">
                        <div className="mb-2">
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-bold mb-2">Status</FormLabel>
                                        <FormControl>
                                            <Select  value={field.value.toString()} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a product status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Active</SelectItem>
                                                    <SelectItem value="false">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="w-full bg-primary-foreground rounded-md shadow-lg px-4 py-6">
                        <h1 className="text-lg font-bold mb-2">Details</h1>
                        <div className="mb-2">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold mb-1">Category</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(category => (
                                                        <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mb-2">
                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold mb-1">Brand</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a brand" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {brands.map(brand => (
                                                        <SelectItem key={brand._id} value={brand._id}>{brand.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-grow flex flex-col gap-3">
                    <div className="bg-primary-foreground rounded-md shadow-lg px-4 py-6">
                        <h1 className="text-lg font-bold mb-2">General</h1>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
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
                                    <FormLabel>Product Details</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input min={0} type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input min={0} type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary-foreground rounded-md shadow-lg px-4 py-6">
                        <FormField
                            control={form.control}
                            name="images"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-lg font-bold mb-2">Media</FormLabel>
                                    <p className="mb-2 text-sm text-gray-400">Minimum {MIN_IMAGE} and maximum {MAX_IMAGE} images</p>

                                    <div className="flex flex-wrap gap-3">
                                        {form.getValues('images').map((img, index) => (
                                            <ImageInput
                                                key={index}
                                                index={index}
                                                defaultImage={URL.createObjectURL(img)}
                                                onImageChange={handleImageChange}
                                                onRemoveImage={handleRemoveImage}
                                                onImageError={handleImagesError}
                                            />
                                        ))}
                                        {form.getValues('images').length < MAX_IMAGE && (
                                            <ImageInput
                                                key={form.getValues('images').length}
                                                index={form.getValues('images').length}
                                                onImageChange={handleImageChange}
                                                onImageError={handleImagesError}
                                            />
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </form>
        </Form >
    );
});

export default ProductForm;
