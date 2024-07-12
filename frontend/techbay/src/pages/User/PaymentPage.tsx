import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";
import { formatPrice } from "../../utils/appHelpers";
import { useAppSelector } from "../../hooks/useSelector";
import { ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";

const PaymentPage = () => {
    const cart = useAppSelector((state) => state.cart.cart)
    const navigate = useNavigate();

    if ((!cart || cart.items.length === 0)) {
        return <Navigate to={'/cart'} />
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
                                    <Button className="rounded-full w-full">Pay Now</Button>
                                </div>
                                <div>
                                    <Button onClick={() => navigate('/checkout')} variant={"secondary"} className="rounded-full"><ArrowLeft className="me-2" size={20} /> Back to Checkout</Button>
                                </div>
                            </div>
                            <div className="w-full max-w-[400px] h-max flex flex-col gap-4">
                                <div className="border px-3 py-2 rounded-xl">
                                    <h1 className="text-xl font-medium mb-2">Delivery Address</h1>

                                    <div className="mb-5">
                                        <p className="text-gray-400">John Doe ,
                                            20261 Guillermo Passage,
                                            Eranakulam, Kerala 685758 </p>
                                    </div>
                                </div>

                                <div className="border px-3 py-2 rounded-xl">
                                    <h1 className="text-xl font-medium mb-2">Order Summary</h1>

                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Subtotal</p>
                                        <p>{formatPrice(cart.cartTotal.subtotal)}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Discount</p>
                                        <p className="text-red-500">{cart.cartTotal.discount > 0 ? cart.cartTotal.discount : '-'}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Delivery Fee</p>
                                        <p>{formatPrice(50)}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-centerb border-t py-3">
                                        <p>Total</p>
                                        <p className="font-semibold text-xl">{formatPrice(cart.cartTotal.total)}</p>
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
