import { PaginationResponse } from "./backendResponseTypes";
import { Brand } from "./brandTypes";
import { Category } from "./categoryTypes";

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: Category | string;
    brand: Brand | string;
    thumbnail: string;
    thumbnailUrl: string;
    imageUrls: string[];
    stock: number;
    price: number;
    rating: number;
    isActive: boolean;
    isFeatured: boolean;
    offerDiscount: number | null;
    finalPrice: number;
};

export interface ProductListResponse extends PaginationResponse {
    products: Product[];
    totalProducts: number;
}

export interface ProductDetail {
    product: Product,
    related_products: Product[]
}