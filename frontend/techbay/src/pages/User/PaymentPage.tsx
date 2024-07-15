import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";
import { formatPrice } from "../../utils/appHelpers";
import { useAppSelector } from "../../hooks/useSelector";
import { ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { useCart } from "../../components/User/CartProvider";
import { useAppDispatch } from "../../hooks/useDispatch";
import { loadCart, verifyCartItems } from "../../features/cart/cartThunk";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { toast } from "../../components/ui/use-toast";
import { USER_CREATE_ORDER_URL } from "../../utils/urls/userUrls";
import axios from "../../utils/axios";


const PaymentPage = () => {
    const cart = useAppSelector((state) => state.cart.cart)
    const { paymentPageAccessible, setOrderConfirmPageAccessible, checkoutAddress } = useCart();
    const [confirmButtonActive, setConfirmButtonActive] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    if ((!cart || cart.items.length === 0 || !paymentPageAccessible)) {
        return <Navigate to={'/cart'} />
    }

    const handleOrderConfirm = () => {
        setConfirmButtonActive(true);
        dispatch(verifyCartItems())
            .then((resultAction) => {
                if (verifyCartItems.fulfilled.match(resultAction)) {

                    axios.post(USER_CREATE_ORDER_URL, { 
                        cartId : cart._id,
                        addressId: checkoutAddress?._id, 
                        paymentMethod : 'cod'
                    }).then( _ => {
                        dispatch(loadCart())
                        setOrderConfirmPageAccessible(true)
                        navigate('/order-confirm', {replace: true})
                    })
                    .catch((_) => {
                        toast({
                            variant: "destructive",
                            title: "Order COnfirmation failed",
                            description: 'Please try again',
                            className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
                        })
                    })
                }
                else if (verifyCartItems.rejected.match(resultAction)) {
                    if(resultAction.payload){
                        const { extraMessage } = resultAction.payload;
                        toast({
                            variant: "destructive",
                            title: extraMessage?.title || "Order Confirmation failed",
                            description: extraMessage?.description || '',
                            className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
                        })
                    }
                    dispatch(loadCart())
                    navigate('/cart')
                }
            })
            .finally(() => {
                setConfirmButtonActive(false)
            })
    }

    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                {cart && cart.items.length > 0 && (
                    <>
                        <SubHeading className="text-left mb-10">Payment</SubHeading>
                        <div className="flex gap-6">
                            <div className="flex-grow">
                                <div className="mb-4 max-w-[400px]">
                                    <div className="border rounded-xl overflow-hidden px-3 mb-4">
                                        <RadioGroup defaultValue="COD" className="flex flex-col gap-3">
                                            <div className="py-4 flex items-center justify-between border-b">
                                                <Label className="text-lg cursor-pointer" htmlFor="r1">Cash On Delivery</Label>
                                                <RadioGroupItem value="COD" id="r1" />
                                            </div>
                                            <div className="py-4 flex items-center justify-between border-b">
                                                <Label className="text-lg cursor-pointer" htmlFor="r2">Wallet</Label>
                                                <RadioGroupItem disabled={true} value="wallet" id="r2" />
                                            </div>
                                            <div className="py-4 flex items-center justify-between border-b">
                                                <Label className="text-lg cursor-pointer" htmlFor="r3">Card Payment</Label>
                                                <RadioGroupItem disabled={true} value="card" id="r3" />
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <Button onClick={handleOrderConfirm} disabled={confirmButtonActive} className="rounded-full w-full">
                                        {confirmButtonActive ? <CircularProgress color="inherit" size={20} /> : 'Confirm Order'}
                                    </Button>
                                </div>
                                <div>
                                    <Button onClick={() => navigate('/checkout')} variant={"secondary"} className="rounded-full"><ArrowLeft className="me-2" size={20} /> Back to Checkout</Button>
                                </div>
                            </div>
                            <div className="w-full max-w-[400px] h-max flex flex-col gap-4">
                                <div className="border px-3 py-2 rounded-xl">
                                    <h1 className="text-xl font-medium mb-2">Delivery Address</h1>
                                    {checkoutAddress && (
                                        <div className="mb-5">
                                            <div className="text-gray-400">
                                                <div className="font-medium">{checkoutAddress.fullName}</div>
                                                <div>{checkoutAddress.addressLine1}</div>
                                                <div>{checkoutAddress.phone}</div>
                                                <div>
                                                    {checkoutAddress.city + ', ' + checkoutAddress.state + ", " + checkoutAddress.country}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border px-3 py-2 rounded-xl">
                                    <h1 className="text-xl font-medium mb-2">Order Summary</h1>

                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Subtotal</p>
                                        <p>{cart.cartTotal.subtotal > 0 ? formatPrice(cart.cartTotal.subtotal) : "-"}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Discount</p>
                                        <p className="text-red-500">{cart.cartTotal.discount > 0 ? cart.cartTotal.discount : '-'}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Delivery Fee</p>
                                        <p>{cart.orderTotal.deliveryFee > 0 ? formatPrice(cart.orderTotal.deliveryFee) : '-'}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-centerb border-t py-3">
                                        <p>Total</p>
                                        <p className="font-semibold text-xl">{cart.orderTotal.total > 0 ? formatPrice(cart.orderTotal.total) : '-'}</p>
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
