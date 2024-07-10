import { PaginationResponse } from "./backendResponseTypes";

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    thumbnailUrl: string;
    imageUrls: string[];
    stock: number;
    price: number;
    rating: number;
    isActive: boolean;
};

export interface ProductListResponse extends PaginationResponse {
    products: Product[];
    totalProducts: number;
  }