import { useRef, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useDispatch";
import { loadCart } from "../../features/cart/cartThunk";
import axios from "../../utils/axios";
import { USER_CREATE_ORDER_URL, USER_ORDER_CAPTURE_URL } from "../../utils/urls/userUrls";
import { toast } from "../ui/use-toast";
import { useCart } from "./CartProvider";
import { getBackendError, isBackendError } from "../../utils/types/backendResponseTypes";

// Renders errors or successful transactions on the screen.
type MessageProp = {
    content: string;
}
function Message({ content }: MessageProp) {
    return <p className="text-red-400 font-medium">{content}</p>;
}

type PayPalPaymentPaymentProps = {
    cartID: string;
    addressID: string;
    couponId: string | null;
}
const PayPalPaymentPayment = ({ cartID, addressID, couponId }: PayPalPaymentPaymentProps) => {
    const { setOrderConfirmPageAccessible, setCoupon } = useCart();

    const [message, setMessage] = useState<string>("");
    const orderIdRef = useRef<string | null>(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const initialOptions = {
        "clientId": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        "enable-funding": "venmo",
        "disable-funding": "",
        "data-page-type": "product-details",
        components: "buttons",
        "data-sdk-integration-source": "developer-studio",
    };

    return (
        <div className="App">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{
                        shape: "pill",
                        layout: "vertical",
                        color: "black",
                        label: "pay",
                    }}
                    createOrder={async () => {
                        try {
                            const response = await axios.post(USER_CREATE_ORDER_URL, {
                                cartId: cartID,
                                addressId: addressID,
                                couponId,
                                paymentMethod: "paypal",
                            });

                            if (response.data && response.data.orderID && response.data.paypalOrderID) {
                                orderIdRef.current = response.data.orderID;
                                return response.data.paypalOrderID;
                            } else {
                                throw new Error("Invalid response structure");
                            }

                        } catch (error) {
                            console.log("Error ", error);
                            if (isBackendError(error)) {
                                const { extraMessage } = getBackendError(error)
                                toast({
                                    variant: "destructive",
                                    title: extraMessage?.title || "Order Confirmation failed",
                                    description: extraMessage?.description || '',
                                    className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
                                })
                                dispatch(loadCart())
                                navigate('/cart')
                            }
                            setMessage("Could not initiate PayPal Checkout");
                            // throw new Error("Could not initiate PayPal Checkout");
                        }
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            const response = await axios.post(USER_ORDER_CAPTURE_URL, {
                                orderID: orderIdRef.current,
                                paypalOrderID: data.orderID
                            });

                            const orderData = await response.data;

                            const errorDetail = orderData?.details?.[0];

                            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                // Recoverable state
                                return actions.restart();
                            } else if (errorDetail) {
                                // Non-recoverable errors
                                throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                            } else {
                                dispatch(loadCart())
                                setOrderConfirmPageAccessible(true)
                                setCoupon(null)
                                navigate('/order-confirm', { replace: true })
                            }
                        } catch (error) {
                            console.error(error);
                            setMessage("Sorry, your transaction could not be processed");
                        }
                    }}
                />
            </PayPalScriptProvider>
            <Message content={message} />
        </div>
    );
}

export default PayPalPaymentPayment;
