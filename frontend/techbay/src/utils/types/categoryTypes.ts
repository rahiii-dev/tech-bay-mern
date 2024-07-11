import { PaginationResponse } from "./backendResponseTypes";

export interface Category {
    _id: string;
    name: string;
    description: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryList extends PaginationResponse {
    totalCategories: number;
    categories: Category[]
}