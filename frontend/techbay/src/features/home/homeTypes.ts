import { Product } from "../../utils/types/productTypes";

export interface HOME_PAGE_RESPONSE {
    newest_products: Product[],
    top_products: Product[]
}