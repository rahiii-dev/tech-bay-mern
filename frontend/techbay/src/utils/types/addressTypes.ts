export interface Addresss {
    _id: string;
    fullName: string,
    phone: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    addressType: "home" | "work",
    isDefault: boolean
}

export interface AddressList {
    addresses: Addresss[];
}