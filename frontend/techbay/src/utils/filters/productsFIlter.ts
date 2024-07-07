import { Product } from "../../features/product/productTypes";


export const filterProducts = (products: Product[], filter: string): Product[] => {
    switch (filter) {
        case 'active':
            return products.filter((product) => product.isActive);
        case 'inactive':
            return products.filter((product) => !product.isActive);
        default:
            return products;
    }
};

