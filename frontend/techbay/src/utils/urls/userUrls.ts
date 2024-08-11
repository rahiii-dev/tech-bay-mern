const BASE_URL: string = '/user';

const generateUrl = (path: string) => `${BASE_URL}${path}`;

export const HOME_PAGE_URL = generateUrl('/home');
export const USER_PRODUCT_LIST_URL = generateUrl('/products');
export const USER_GET_SINGLE_PRODUCT = (id:string) => generateUrl(`/product/${id}`);
export const USER_CATEGORY_LIST_URL = generateUrl('/categories');
export const USER_BRAND_LIST_URL = generateUrl('/brands');

export const USER_CART_URL = generateUrl('/cart');
export const USER_ADD_TO_CART_URL = generateUrl('/cart')
export const USER_UPDATE_CART_ITEM_QUANTITY_URL = (id:string) => generateUrl(`/cart/${id}`)
export const USER_DELETE_CART_ITEM_URL = (id:string) => generateUrl(`/cart/${id}`)
export const USER_CART_VERIFY = generateUrl(`/cart/verify`)

export const USER_WISH_TO_CART_URL = generateUrl(`/wish-to-cart`)

export const USER_WISHLIST_URL = generateUrl('/wishlist');
export const USER_ADD_TO_WISHLIST_URL = generateUrl('/wishlist');
export const USER_REMOVE_FROM_WISHLIST_URL = (productId: string) => generateUrl(`/wishlist/remove?productId=${productId}`);

export const USER_PROFILE_URL = generateUrl('/profile');
export const USER_PROFILE_UPDATE_URL = generateUrl('/profile');
export const USER_CHANGE_PASS_URL = generateUrl('/profile/change-password');

export const USER_WALLET_URL = generateUrl('/wallet');
export const USER_WALLET_HISTORY_URL = generateUrl('/wallet/history');

export const USER_ADDRESS_LIST_URL = generateUrl('/profile/addresses');
export const USER_ADDRESS_ADD_URL = generateUrl('/profile/addresses');
export const USER_ADDRESS_SINGLE_URL = (id:string) => generateUrl(`/profile/address/${id}`);
export const USER_ADDRESS_UPDATE_URL = (id:string) => generateUrl(`/profile/address/${id}`);
export const USER_ADDRESS_DELETE_URL = (id:string) => generateUrl(`/profile/address/${id}`);

export const USER_CREATE_ORDER_URL = generateUrl('/order');
export const USER_ORDER_CAPTURE_URL = generateUrl('/order/capture');
export const USER_ORDER_LIST_URL = generateUrl('/order/list');
export const USER_CANCEL_ORDER_URL = (id:string) => generateUrl(`/order/${id}/cancel`);
export const USER_RETURN_ORDER_URL = (id:string) => generateUrl(`/order/${id}/return`);
export const USER_ORDER_INVOICE_DOWNLOAD_URL = (id:string) => generateUrl(`/order/invoice-download/?orderId=${id}`);

export const USER_COUPON_LIST_URL = generateUrl('/coupon/list');
export const USER_COUPON_VERIFY_URL = generateUrl('/coupon/verify');
