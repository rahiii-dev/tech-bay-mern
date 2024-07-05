import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import ImageInput from "../ui/ImageInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const MAX_IMAGE = 6;


const ProductForm = () => {
    const [images, setImages] = useState<File[]>([]);
    const [imagesError, setImagesError] = useState('');

    const [thumbNail, setThumbNail] = useState<File | null>(null);
    const [thumbNailError, setThumbNailError] = useState('');

    const handleImageChange = (index: number, file: File) => {
        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const handleThumbnailInput = (file: File) => {
        setThumbNail(file);
    };

    const handleImagesError = (error: string) => {
        setImagesError(error);
    };

    const handleThumbnailError = (error: string) => {
        setThumbNailError(error);
    };

    return (
        <div className="pt-2 pb-10">
            <form className="flex flex-col-reverse md:flex-row justify-between gap-3">
                <div className="w-full md:w-max flex md:flex-col gap-3">
                    <div className="w-full bg-primary-foreground rounded-md shadow-lg px-4 py-6">
                        <h1 className="text-lg font-bold mb-2">Thumbnail</h1>
                        <p className="mb-2 text-sm text-gray-400">Add thumbnail for your product</p>
                        {thumbNailError && <p className="mb-2 text-sm text-red-500">{thumbNailError}</p>}
                        <ImageInput key={'thumbnail-input'} index={-1} onImageChange={(_, file) => handleThumbnailInput(file)} onImageError={handleThumbnailError} />
                    </div>
                    <div className="w-full bg-primary-foreground rounded-md shadow-lg px-4 py-6">
                        <h1 className="text-lg font-bold mb-2">Details</h1>
                        <div className="mb-2">
                            <h4 className="font-semibold mb-1">Categories</h4>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="laptop">Laptop</SelectItem>
                                    <SelectItem value="headphone">Headphone</SelectItem>
                                    <SelectItem value="smartphone">SmartPhone</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-2">
                            <h4 className="font-semibold mb-1">Brand</h4>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="samsung">Samsung</SelectItem>
                                    <SelectItem value="sony">Sony</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="flex-grow flex flex-col gap-3">
                    <div className="bg-primary-foreground rounded-md shadow-lg px-4 py-6">
                        <h1 className="text-lg font-bold mb-2">General</h1>
                        <Label className="mb-4">Product Name: </Label>
                        <Input />
                        <Label className="mb-4">Product Details: </Label>
                        <Textarea />
                        <Label className="mb-4">Product Price: </Label>
                        <Input />
                    </div>
                    <div className="bg-primary-foreground rounded-md shadow-lg px-4 py-6">
                        <h1 className="text-lg font-bold mb-2">Media</h1>
                        <p className="mb-2 text-sm text-gray-400">Add up to {MAX_IMAGE} images</p>
                        {imagesError && <p className="mb-2 text-sm text-red-500">{imagesError}</p>}
                        <div className="flex flex-wrap gap-3">
                            {images.map((img, index) => (
                                <ImageInput
                                    key={index}
                                    index={index}
                                    defaultImage={URL.createObjectURL(img)}
                                    onImageChange={handleImageChange}
                                    onRemoveImage={handleRemoveImage}
                                    onImageError={handleImagesError}
                                />
                            ))}
                            {images.length < MAX_IMAGE && (
                                <ImageInput
                                    key={images.length}
                                    index={images.length}
                                    onImageChange={handleImageChange}
                                    onImageError={handleImagesError}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
