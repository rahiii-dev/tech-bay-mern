import { User } from "../../features/auth/authTypes";
import { PaginationResponse } from "./backendResponseTypes";
import { Transaction } from "./transactionTypes";

export interface OrderProduct {
    productID: string;
    name: string;
    price: number;
    images: string[];
    thumbnail?: string;
    category?: string;
    brand?: string;
    quantity: number;
    canCancel: boolean;
    canReturn: boolean;
    cancelled: boolean;
    cancelReason?: string;
    returned: boolean;
    returnReason?: string;
    returnConfirmed: boolean;
    returnConfirmationDate?: string;
}

interface OrderedAmount {
    subtotal: number;
    discount?: number;
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

export const OrderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned']

export interface Order {
    _id: string;
    user: User;
    orderedItems: OrderProduct[];
    orderedAmount: OrderedAmount;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
    address: Address;
    paymentMethod: 'debit card' | 'credit card' | 'wallet' | 'cod';
    orderNumber: string;
    createdAt: string;
    transaction: Transaction;
    deliveryDate?: string;
    cart: string
}

export interface OrderList extends PaginationResponse {
    orders: Order[];
    totalOrders: number;
}
