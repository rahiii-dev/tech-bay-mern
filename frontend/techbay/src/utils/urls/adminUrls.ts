const BASE_URL: string = '/admin';

const generateUrl = (path: string) => `${BASE_URL}${path}`;

export const CUSTOMER_LIST_URL = generateUrl('/customer/list');

export const CATEGORY_LIST_URL = generateUrl('/categories');
export const CATEGORY_CREATE_URL = generateUrl('/categories');
export const CATEGORY_EDIT_URL = (id: string) => generateUrl(`/categories/${id}`);
export const CATEGORY_DELETE_URL = (id: string) => generateUrl(`/categories/${id}`);
export const CATEGORY_RESTORE_URL = (id: string) => generateUrl(`/categories/restore/${id}`);

export const BRAND_LIST_URL = generateUrl('/brands');
export const BRAND_CREATE_URL = generateUrl('/brands');
export const BRAND_EDIT_URL = (id: string) => generateUrl(`/brands/${id}`);
export const BRAND_DELETE_URL = (id: string) => generateUrl(`/brands/${id}`);
export const BRAND_RESTORE_URL = (id: string) => generateUrl(`/brands/restore/${id}`);

export const PRODUCT_LIST_URL = generateUrl('/products');
export const PRODUCT_CREATE_URL = generateUrl('/products');
export const SINGLE_PRODUCT_URL = (id: string) => generateUrl(`/product/${id}`);
export const PRODUCT_EDIT_URL = (id: string) => generateUrl(`/products/${id}`);
export const PRODUCT_DELETE_URL = (id: string) => generateUrl(`/products/${id}`);
export const PRODUCT_RESTORE_URL = (id: string) => generateUrl(`/products/restore/${id}`);