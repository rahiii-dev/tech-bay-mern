import { Product } from "./productTypes";

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    _id: string;
    items: CartItem[]
}