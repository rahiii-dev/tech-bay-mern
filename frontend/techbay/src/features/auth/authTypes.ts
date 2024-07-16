
export interface User {
    _id: string;
    email:string;
    fullName: string;
    phone_no: string;
    isAdmin: boolean;
    isStaff: boolean;
    isBlocked: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}