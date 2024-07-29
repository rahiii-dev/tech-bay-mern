import { Product } from "./productTypes";

export interface Wishlist {
    user: string;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
  }
  