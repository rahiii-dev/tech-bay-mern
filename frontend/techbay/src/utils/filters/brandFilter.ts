
export const filterBrand = (brands: Brand[], filter: string): Brand[] => {
    switch (filter) {
        case 'inactive':
            return brands.filter((brand) => brand.isDeleted);
        default:
            return brands;
    }
};