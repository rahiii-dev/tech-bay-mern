import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";
import { formatPrice } from "../../utils/appHelpers";
import { useAppSelector } from "../../hooks/useSelector";
import CartList from "../../components/User/CartList";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CheckoutPage = () => {
    const cart = useAppSelector((state) => state.cart.cart)
    const navigate = useNavigate();

    if((!cart || cart.items.length === 0)){
        return <Navigate to={'/cart'}/>
    }

    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                {cart && cart.items.length > 0 && (
                    <>
                        <SubHeading className="text-left mb-10">Checkout</SubHeading>
                        <div className="flex gap-6">
                            <div className="flex-grow">
                                <div className="mb-4">
                                    <CartList cartItems={cart.items} editable={false} />
                                </div>
                                <div>
                                    <Button onClick={() => navigate('/cart')} variant={"secondary"} className="rounded-full"><ArrowLeft className="me-2" size={20} /> Back to cart</Button>
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

                                    <div className="mb-2 flex items-center justify-between">
                                        <Button className="rounded-full w-[100px]">Add New</Button>
                                        <Button className="rounded-full w-[100px]">Edit</Button>
                                    </div>
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
                                    <div className="mb-2">
                                        <Button onClick={() => navigate('/payment')} className="rounded-full w-full">Proceed to Payment <ArrowRight className="ms-2" size={20} /></Button>
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

export default CheckoutPage;
