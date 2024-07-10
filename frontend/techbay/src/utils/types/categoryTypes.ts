export interface Category {
    _id: string;
    name: string;
    description: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryList {
    categoryCount: number;
    categories: Category[]
}