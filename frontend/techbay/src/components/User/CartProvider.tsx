import { createContext, useContext, useState, ReactNode } from 'react';
import { Addresss } from "../../utils/types/addressTypes";
import { Coupon } from '../../utils/types/couponTypes';

type CartProviderState = {
    paymentPageAccessible: boolean;
    orderConfirmPageAccessible: boolean;
    checkoutAddress: Addresss | null;
    coupon: Coupon | null;
    setPaymentPageAccessible: (accessible: boolean) => void;
    setOrderConfirmPageAccessible: (accessible: boolean) => void;
    setCheckoutAddress: (address: Addresss | null) => void;
    setCoupon: (coupon: Coupon | null) => void;
}


const initialState: CartProviderState = {
    paymentPageAccessible: false,
    orderConfirmPageAccessible: false,
    checkoutAddress: null,
    coupon: null,
    setPaymentPageAccessible: () => {},
    setOrderConfirmPageAccessible: () => {},
    setCheckoutAddress: () => {},
    setCoupon: () => {},
};

const CartContext = createContext<CartProviderState>(initialState);

type CartProviderProps = {
    children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [paymentPageAccessible, setPaymentPageAccessible] = useState<boolean>(initialState.paymentPageAccessible);
    const [orderConfirmPageAccessible, setOrderConfirmPageAccessible] = useState<boolean>(initialState.orderConfirmPageAccessible);
    const [checkoutAddress, setCheckoutAddress] = useState<Addresss | null>(initialState.checkoutAddress);
    const [coupon, setCoupon] = useState<Coupon | null>(initialState.coupon);

    const value = {
        paymentPageAccessible,
        orderConfirmPageAccessible,
        checkoutAddress,
        coupon,
        setPaymentPageAccessible,
        setOrderConfirmPageAccessible,
        setCheckoutAddress,
        setCoupon
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export default CartProvider;
