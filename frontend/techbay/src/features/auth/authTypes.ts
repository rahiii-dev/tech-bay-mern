
export interface User {
    _id: string;
    email:string;
    fullName: string;
    isAdmin: boolean;
    isStaff: boolean;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
}