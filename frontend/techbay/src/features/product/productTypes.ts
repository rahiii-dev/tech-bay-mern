export interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    thumbnail: string;
    images: string[];
    stock: number;
    price: number;
    rating: number;
    isActive: boolean;
};

export interface ProductList {
    productCount: number;
    products: Product[];
}