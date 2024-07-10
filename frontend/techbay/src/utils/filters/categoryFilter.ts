import { Category } from "../types/categoryTypes";

export const filterCategory = (categories: Category[], filter: string): Category[] => {
    switch (filter) {
        case 'inactive':
            return categories.filter((category) => category.isDeleted);
        default:
            return categories;
    }
};
