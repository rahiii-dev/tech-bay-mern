import { PaginationResponse } from "./backendResponseTypes";

export interface Brand {
    _id: string;
    name: string;
    description: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BrandList extends PaginationResponse{
    totalBrands: number;
    brands: Brand[];
}
