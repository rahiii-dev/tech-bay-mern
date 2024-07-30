import { PaginationResponse } from "./backendResponseTypes";

export interface Coupon {
    _id: string;
    code: string;
    discount: number;
    expiryDate: Date;
    isActive: boolean;
    minAmount: number;
    maxAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CouponList extends PaginationResponse {
    totalCoupons: number;
    coupons: Coupon[]
}