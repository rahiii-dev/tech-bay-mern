import { CategoryResponse } from "../../pages/Admin/Category";
import { Product } from "../product/productTypes";

export interface ShopPageResponse {
    products: Product[];
    categories: CategoryResponse[],
}