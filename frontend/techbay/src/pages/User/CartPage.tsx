import { ArrowRight } from "lucide-react";
import SubHeading from "../../components/User/SubHeading";
import { Button } from "../../components/ui/button";
import CartList from "../../components/User/CartList";
import { useAppSelector } from "../../hooks/useSelector";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/appHelpers";
import { useEffect, useState } from "react";
import { toast } from "../../components/ui/use-toast";
import { useAppDispatch } from "../../hooks/useDispatch";
import { clearCartError } from "../../features/cart/cartSlice";
import { loadCart, verifyCartItems } from "../../features/cart/cartThunk";
import { CircularProgress } from "@mui/material";

const CartPage = () => {
    const cart = useAppSelector((state) => state.cart.cart);
    const cartError = useAppSelector((state) => state.cart.error);
    const [verifyCart, setVerifyCart] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(cartError){
            toast({
                variant: "destructive",
                title: cartError?.extraMessage?.title || "Cart operation failed",
                description: cartError?.extraMessage?.description || '',
                className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
              })
            dispatch(clearCartError())
        }
    }, [cartError])

    const handleCheckout  = () => {
        setVerifyCart(true);
        dispatch(verifyCartItems())
        .then((resultAction) => {
            if(verifyCartItems.fulfilled.match(resultAction)){
                dispatch(loadCart())
                navigate('/checkout')
            }
            else{
                dispatch(loadCart())
            }
        })
        .finally(() => {
            setVerifyCart(false)
        })
    }

    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                {(!cart || cart.items.length === 0) && (
                    <div className="h-[250px]">
                        <SubHeading className="mb-10">Cart is Empty</SubHeading>
                        <div className="text-center mt-3">
                            <Link to={'/shop'}>
                                <Button size={"lg"} className="rounded-full">Shop Now</Button>
                            </Link>
                        </div>
                    </div>
                )}
                {cart && cart.items.length > 0 && (
                    <>
                        <SubHeading className="text-left mb-10">Your Cart</SubHeading>
                        <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
                            <div className="flex-grow">
                                <CartList cartItems={cart.items}/>
                            </div>
                            <div className="border px-3 py-2 rounded-xl w-full max-w-[400px] h-max">
                                <h1 className="text-xl font-medium mb-2">Cart Total</h1>

                                <div className="font-medium flex justify-between items-center mb-2">
                                    <p className="text-gray-400">Subtotal</p>
                                    <p>{cart.cartTotal.subtotal > 0 ? formatPrice(cart.cartTotal.subtotal) : '-'}</p>
                                </div>
                                <div className="font-medium flex justify-between items-center mb-2">
                                    <p className="text-gray-400">Discount</p>
                                    <p className="text-red-500">{cart.cartTotal.discount > 0 ? cart.cartTotal.discount : '-'}</p>
                                </div>
                                <div className="font-medium flex justify-between items-centerb border-t py-3">
                                    <p>Total</p>
                                    <p className="font-semibold text-xl">{cart.cartTotal.total > 0 ? formatPrice(cart.cartTotal.total) : '-'}</p>
                                </div>
                                <div className="mb-2">
                                    <Button disabled={verifyCart} onClick={handleCheckout} className="rounded-full w-full">
                                        {verifyCart ? <CircularProgress color="inherit" size={20} /> :'Go to Checkout'}
                                        {!verifyCart && <ArrowRight className="ms-2" size={20} />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default CartPage;
