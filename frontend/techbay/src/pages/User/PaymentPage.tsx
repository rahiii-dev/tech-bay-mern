import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";
import { formatPrice } from "../../utils/appHelpers";
import { useAppSelector } from "../../hooks/useSelector";
import { ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { useCart } from "../../components/User/CartProvider";
import { useAppDispatch } from "../../hooks/useDispatch";
import { loadCart } from "../../features/cart/cartThunk";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { toast } from "../../components/ui/use-toast";
import { USER_CREATE_ORDER_URL, USER_WALLET_URL } from "../../utils/urls/userUrls";
import axios from "../../utils/axios";
import useAxios from "../../hooks/useAxios";
import { Wallet } from "../../utils/types/walletTypes";
import PayPalPayment from "../../components/User/PayPalPayment";
import { getBackendError, isBackendError } from "../../utils/types/backendResponseTypes";
import { Order } from "../../utils/types/orderTypes";


const PaymentPage = () => {
    const cart = useAppSelector((state) => state.cart.cart)
    const { paymentPageAccessible, setOrderConfirmPageAccessible, checkoutAddress, coupon, setCoupon } = useCart();
    const [confirmButtonActive, setConfirmButtonActive] = useState(false);
    const [paymentOption, setPaymentOption] = useState<string | null>(null);
    const [order, setOrder] = useState<Order | null>(null);

    const { data: walletData, loading: walletDataLoading } = useAxios<Wallet>({
        url: USER_WALLET_URL,
        method: 'GET'
    });

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.order) {
            setOrder(location.state.order);
        }
    }, [location.state]);

    if ((!cart || !paymentPageAccessible) && !order) {
        return <Navigate to={'/cart'} />
    }

    const subTotal = order
        ? order.orderedAmount.subtotal
        : cart ? cart.cartTotal.subtotal : 0;

    const discount = order
        ? order.orderedAmount.discount
        : (cart && coupon) ? coupon.discount : 0;

    const total = (coupon && cart)
        ? cart.cartTotal.subtotal - (cart.cartTotal.subtotal * coupon.discount) / 100
        : order ? order.orderedAmount.total : 0;

    const handleOrderConfirm = () => {
        if (!paymentOption) {
            toast({
                variant: "destructive",
                title: "Please select a payment option",
                className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
            })

            return;
        }

        setConfirmButtonActive(true);

        axios.post(USER_CREATE_ORDER_URL, {
            cartId: order ? order.cart : cart?._id,
            addressId: checkoutAddress?._id,
            paymentMethod: paymentOption,
            couponId: coupon?._id
        }).then(_ => {
            dispatch(loadCart())
            setOrderConfirmPageAccessible(true)
            setCoupon(null)
            navigate('/order-confirm', { replace: true })
        }).catch((error) => {
            if (isBackendError(error)) {
                const { extraMessage } = getBackendError(error)
                toast({
                    variant: "destructive",
                    title: extraMessage?.title || "Order Confirmation failed",
                    description: extraMessage?.description || '',
                    className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
                })
            }
            dispatch(loadCart())
            navigate('/cart')
        }).finally(() => {
            setConfirmButtonActive(false)
        })
    }

    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                {(cart && cart.items.length > 0 || order) && (
                    <>
                        <SubHeading className="text-left mb-10">Payment</SubHeading>
                        <div className="flex gap-6">
                            <div className="flex-grow">
                                <div className="mb-4 max-w-[400px]">
                                    <div className="border rounded-xl overflow-hidden px-3 mb-4">
                                        <RadioGroup defaultValue={`${paymentOption && paymentOption}`} className="flex flex-col gap-3" onValueChange={setPaymentOption}>
                                            <div className={`py-4 flex items-center justify-between border-b ${total > 1000 ? 'text-gray-400' : ''}`}>
                                                <Label className="text-lg cursor-pointer" htmlFor="r1">
                                                    <div>Cash On Delivery</div>
                                                    {total > 1000 && <div className="text-sm text-gray-400">Only available for order below {formatPrice(1000)}</div>}
                                                </Label>
                                                <RadioGroupItem disabled={total > 1000} value="cod" id="r1" />
                                            </div>
                                            <div className={`py-4 flex items-center justify-between border-b ${(walletDataLoading || !walletData || walletData.balance < total) && 'text-gray-400'}`}>
                                                <Label className="text-lg cursor-pointer" htmlFor="r2">
                                                    <div>Wallet</div>
                                                    {!walletDataLoading && walletData && <div className="text-sm text-gray-400">Balance: {formatPrice(walletData.balance)}</div>}
                                                    {!walletDataLoading && !walletData && <div className="text-sm text-gray-400">No wallet</div>}
                                                </Label>
                                                <RadioGroupItem disabled={(walletDataLoading || !walletData || walletData.balance < total)} value="wallet" id="r2" />
                                            </div>
                                        </RadioGroup>
                                        <Button onClick={handleOrderConfirm} disabled={confirmButtonActive} className="rounded-full w-full mt-3">
                                            {confirmButtonActive ? <CircularProgress color="inherit" size={20} /> : 'Confirm Order'}
                                        </Button>
                                    </div>
                                    <div>
                                        <div className="relative h-[2px] rounded-full bg-gray-200">
                                            <span className="absolute -top-[14px] left-[50%] translate-x-[-50%] text-gray-400 font-medium bg-primary-foreground px-3">or</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <PayPalPayment couponId={coupon && coupon?._id} cartID={order ? order.cart : cart ? cart?._id : null} addressID={checkoutAddress ? checkoutAddress?._id : null} />
                                    </div>
                                </div>
                                <div>
                                    <Button onClick={() => navigate('/checkout')} variant={"secondary"} className="rounded-full"><ArrowLeft className="me-2" size={20} /> Back to Checkout</Button>
                                </div>
                            </div>
                            <div className="w-full max-w-[400px] h-max flex flex-col gap-4">
                                <div className="border px-3 py-2 rounded-xl">
                                    <h1 className="text-xl font-medium mb-2">Delivery Address</h1>
                                        <div className="mb-5">
                                            <div className="text-gray-400">
                                                {order ? (
                                                    <>
                                                        <div className="font-medium">{order.address.fullName}</div>
                                                        <div>{order.address.addressLine1}</div>
                                                        <div>{order.address.phone}</div>
                                                        <div>
                                                            {order.address.city + ', ' + order.address.state + ", " + order.address.country}
                                                        </div>
                                                    </>
                                                ) : checkoutAddress && (
                                                    <>
                                                        <div className="font-medium">{checkoutAddress.fullName}</div>
                                                        <div>{checkoutAddress.addressLine1}</div>
                                                        <div>{checkoutAddress.phone}</div>
                                                        <div>
                                                            {checkoutAddress.city + ', ' + checkoutAddress.state + ", " + checkoutAddress.country}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                </div>

                                <div className="border px-3 py-2 rounded-xl">
                                    <h1 className="text-xl font-medium mb-2">Order Summary</h1>

                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Subtotal</p>
                                        <p>{formatPrice(subTotal)}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Discount</p>
                                        <p className="text-red-500">{coupon ? `${discount}%` : discount ? formatPrice(discount) : '-'}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-center border-t py-3">
                                        <p>Total</p>
                                        <p className="font-semibold text-xl">
                                            {formatPrice(total)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default PaymentPage;
