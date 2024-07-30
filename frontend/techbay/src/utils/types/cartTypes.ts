import { User } from "../../features/auth/authTypes";
import { Product } from "./productTypes";

export interface CartItem {
    _id: string;
    product: Product;
    quantity: number;
}

export interface Cart {
    _id: string;
    user: User;
    items: CartItem[];
    cartTotal: { subtotal: number, discount: number, total: number }
    orderTotal: { total: number}
}