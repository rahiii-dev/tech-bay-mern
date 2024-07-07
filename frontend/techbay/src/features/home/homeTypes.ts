import { Product } from "../product/productTypes";

export interface HOME_PAGE_RESPONSE {
    newest_products: Product[],
    top_products: Product[]
}