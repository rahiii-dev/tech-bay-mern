import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";
import { formatPrice } from "../../utils/appHelpers";
import { HERO_IMG } from "../../utils/userContants";
import { ArrowLeft } from "lucide-react";

const OrdersPage = () => {
    const navigate = useNavigate();

    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                <SubHeading className="text-left mb-10">My Orders</SubHeading>
                <div className="mb-4">
                    <div className="border rounded-xl overflow-hidden px-3 max-w-[800px] mx-auto">
                        <div className="flex justify-between items-center border-b py-4 px-3">
                            <div className="flex gap-3">
                                <div className="size-20">
                                    <img src={`${HERO_IMG}`} alt="product-img" />
                                </div>
                                <div className="font-medium">
                                    <div className="flex gap-2">
                                        <h3>JBL Headphone</h3>
                                    </div>
                                    <p className="text-sm">Brand: <span className="text-gray-400">JBL</span></p>
                                    <h2 className="text-xl">{formatPrice(4999)}</h2>
                                </div>
                            </div>

                            <div className="font-semibold">
                                <p>Delevered On</p>
                                <p>03-May-2024</p>
                            </div>

                            <div>
                                <Button variant={"secondary"} className="rounded-full min-w-[100px]">Return</Button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-b py-4 px-3">
                            <div className="flex gap-3">
                                <div className="size-20">
                                    <img src={`${HERO_IMG}`} alt="product-img" />
                                </div>
                                <div className="font-medium">
                                    <div className="flex gap-2">
                                        <h3>JBL Headphone</h3>
                                    </div>
                                    <p className="text-sm">Brand: <span className="text-gray-400">JBL</span></p>
                                    <h2 className="text-xl">{formatPrice(4999)}</h2>
                                </div>
                            </div>

                            <div className="font-semibold text-green-600">
                                <p>Arriving On</p>
                                <p>03-May-2024</p>
                            </div>

                            <div>
                                <Button variant={"destructive"} className="rounded-full min-w-[100px]">Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Button onClick={() => navigate('/shop')} variant={"secondary"} className="rounded-full"><ArrowLeft className="me-2" size={20} /> Back to Shop</Button>
                </div>
            </div>
        </section>

    );
}

export default OrdersPage;
