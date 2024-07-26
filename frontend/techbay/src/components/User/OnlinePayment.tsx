import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useDispatch";
import { loadCart, verifyCartItems } from "../../features/cart/cartThunk";
import axios from "../../utils/axios";
import { USER_CREATE_ORDER_URL, USER_ORDER_CAPTURE_URL } from "../../utils/urls/userUrls";
import { toast } from "../ui/use-toast";

// Renders errors or successful transactions on the screen.
type MessageProp = {
    content: string;
}
function Message({ content }: MessageProp) {
    return <p className="text-red-400 font-medium">{content}</p>;
}

type OnlinePaymentProps = {
    cartID: string;
    addressID: string;
}
const OnlinePayment = ({ cartID, addressID }: OnlinePaymentProps) => {
    const initialOptions = {
        "clientId": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        "enable-funding": "venmo",
        "disable-funding": "",
        // country: "IN",
        // currency: "INR",
        "data-page-type": "product-details",
        components: "buttons",
        "data-sdk-integration-source": "developer-studio",
    };

    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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
                            const resultAction = await dispatch(verifyCartItems());

                            if (verifyCartItems.fulfilled.match(resultAction)) {
                                const response = await axios.post(USER_CREATE_ORDER_URL, {
                                    cartId: cartID,
                                    addressId: addressID,
                                    paymentMethod: "paypal",
                                });
                                console.log(response);
                                return response.data.paypalOrderID;
                            } else {
                                dispatch(loadCart());
                                const { extraMessage } = resultAction.payload || {};
                                toast({
                                    variant: "destructive",
                                    title: extraMessage?.title || "Payment failed",
                                    description: extraMessage?.description || '',
                                    className: 'w-auto py-6 px-12 fixed bottom-2 right-2',
                                });
                                dispatch(loadCart());
                                navigate('/cart');
                                throw new Error("Cart verification failed");
                            }
                        } catch (error) {
                            console.error(error);
                            setMessage("Could not initiate PayPal Checkout");
                            throw new Error("Could not initiate PayPal Checkout");
                        }
                    }}
                    onApprove={async (data, actions) => {
                        try {
                          const response = await axios.post(USER_ORDER_CAPTURE_URL, { 
                            orderID: data.orderID,
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
                            // Successful transaction
                            const transaction = orderData.purchase_units[0].payments.captures[0];
                            setMessage(`Transaction ${transaction.status}: ${transaction.id}. See console for details.`);
                            console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
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

export default OnlinePayment;
