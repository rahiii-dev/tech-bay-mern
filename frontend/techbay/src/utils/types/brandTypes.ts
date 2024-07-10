export interface Brand {
    _id: string;
    name: string;
    description: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BrandList {
    brandCount: number;
    brands: Brand[];
}
