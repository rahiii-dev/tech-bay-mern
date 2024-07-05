import React, { useState, useEffect, useRef } from "react";
import { FileUp, X, Crop } from "lucide-react";
import { Input } from "../ui/input";
import ImageCropper from "./ImageCropper";

interface ImageInputProps {
    index: number;
    onImageChange?: (index: number, file: File) => void;
    onRemoveImage?: (index: number) => void;
    onImageError?: (message: string) => void;
    defaultImage?: string;
}

const ImageInput = ({ index, onImageChange, onRemoveImage, onImageError, defaultImage }: ImageInputProps) => {
    const [image, setImage] = useState<string | null>(defaultImage || null);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (defaultImage) {
            setImage(defaultImage);
        }
    }, [defaultImage]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageError?.('');
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result as string);
                    onImageChange?.(index, file);
                };
                reader.readAsDataURL(file);
            } else {
                onImageError?.("Only images are allowed");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        onRemoveImage?.(index);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCropComplete = async (croppedImage: string) => {
        const blob = await fetch(croppedImage).then(r => r.blob());
        const originalFileName = croppedImage.substring(croppedImage.lastIndexOf('/') + 1);
        const file = new File([blob], originalFileName, { type: blob.type });
        setImage(croppedImage);
        setCropImageSrc(null);
        onImageChange?.(index, file);
    };

    const handleCloseCropper = () => {
        setCropImageSrc(null);
    };

    return (
        <div className={`h-[200px] w-[200px] flex justify-center items-center ${!image && 'border-2 border-dotted border-gray-400'} rounded-md bg-secondary relative`}>
            {image ? (
                <div className="relative h-full w-full group">
                    <img src={image} alt="Preview" className="object-cover h-full w-full rounded-md group-hover:blur-[1px]" />
                    <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={handleRemoveImage}
                    >
                        <X size={20} />
                    </button>
                    <button
                        type="button"
                        className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => setCropImageSrc(image)}
                    >
                        <Crop size={20} />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                    <FileUp />
                    <span>Drop file here or Click</span>
                    <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="opacity-0 absolute inset-0 h-full cursor-pointer"
                    />
                </div>
            )}
            {cropImageSrc && (
                <ImageCropper imageSrc={cropImageSrc} onCropComplete={handleCropComplete} onClose={handleCloseCropper} />
            )}
        </div>
    );
};

export default ImageInput;
