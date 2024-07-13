import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";

const OrderConfirmation = () => {
    const navigate = useNavigate()
    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                <div className="bg-primary rounded-2xl overflow-hidden px-3 py-5 text-primary-foreground min-h-[250px]">
                    <SubHeading className="text-primary-foreground mb-4">Order Confirmed 🥳</SubHeading>
                    <p className="text-xl font-semibold text-center mb-6">Your Order is confirmed</p>
                    <div className="flex justify-center gap-4">
                        <Button onClick={() => navigate('/orders')} variant={"secondary"} className="rounded-full min-w-[150px]">Order Details</Button>
                        <Button onClick={() => navigate('/shop')} variant={"secondary"} className="rounded-full min-w-[150px]">Continue Shopping</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OrderConfirmation;
