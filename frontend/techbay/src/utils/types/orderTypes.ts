import { User } from "../../features/auth/authTypes";
import { PaginationResponse } from "./backendResponseTypes";

interface OrderProduct {
    productID: string;
    name: string,
    price: number,
    images: string[],
    thumbnail: string,
    category: string,
    brand: string,
    quantity: number,
}

interface OrderedAmount {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
}

interface Address {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Order {
    _id: string;
    user: User;
    orderedItems: OrderProduct[];
    orderedAmount: OrderedAmount;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    address: Address;
    paymentMethod: 'debit card' | 'credit card' | 'wallet' | 'cod';
    orderNumber: string;
    createdAt: string;
    deliveryDate: string;
}

export interface OrderList extends PaginationResponse {
    orders: Order[];
    totalOrders: number;
}