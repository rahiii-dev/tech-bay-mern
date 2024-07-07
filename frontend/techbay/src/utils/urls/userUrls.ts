const BASE_URL: string = '/user';

const generateUrl = (path: string) => `${BASE_URL}${path}`;

export const HOME_PAGE_URL = generateUrl('/home');
export const PRODUCT_LIST_URL = generateUrl('/products');
export const CATEGORY_LIST_URL = generateUrl('/categories');