import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";
import { formatDate, formatPrice } from "../../utils/appHelpers";
import { ArrowLeft } from "lucide-react";
import useAxios from "../../hooks/useAxios";
import { USER_CANCEL_ORDER_URL, USER_ORDER_LIST_URL } from "../../utils/urls/userUrls";
import { Order } from "../../utils/types/orderTypes";
import { SERVER_URL } from "../../utils/constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import axios from "../../utils/axios";
import { toast } from "../../components/ui/use-toast";

const OrdersPage = () => {
    const { data: OrdersList, loading, fetchData:fetchOdersList } = useAxios<Order[]>({
        url: USER_ORDER_LIST_URL,
        method: 'GET',
    });

    const navigate = useNavigate();

    const handleCancelItem = async (orderId: string) => {
        try {
            await axios.post(USER_CANCEL_ORDER_URL(orderId), {orderId})
            fetchOdersList()
            toast({
                variant: "default",
                title: `Order cancelled successfully.`,
                description: "",
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: `Failed to cancel order`,
                description: "",
                className: "text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
        }
    }

    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                <SubHeading className="text-left mb-10">{OrdersList && OrdersList.length === 0 ? 'No orders yet' : 'My Orders'}</SubHeading>
                <div className="mb-4 flex flex-col gap-4">
                    {!loading && OrdersList && OrdersList.length && (
                        OrdersList.map(order => (

                            <div key={order._id} className="flex-grow w-full border rounded-xl overflow-hidden px-3 max-w-[800px] mx-auto">

                                <div className="flex justify-between items-center border-b py-4 px-3">
                                    <div>
                                        <h1 className="text-md font-medium">#{order.orderNumber}</h1>
                                    </div>

                                    <div className={`font-semibold`}>
                                        {order.status === "Delivered" && (
                                            <div>
                                                <p>Delevered On</p>
                                                <p>{formatDate(order.deliveryDate)}</p>
                                            </div>
                                        )}

                                        {(order.status === "Processing" || order.status === "Pending") && (
                                            <div className="text-blue-600">
                                                <p>Order is proceesing</p>
                                            </div>
                                        )}

                                        {order.status === "Shipped" && (
                                            <div className="text-green-600">
                                                <p>Arriving On</p>
                                                <p>{formatDate(order.deliveryDate)}</p>
                                            </div>
                                        )}

                                        {order.status === "Cancelled" && (
                                            <div className="text-gray-400">
                                                <p>Order is cancelled</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        {order.status === "Delivered" && (
                                            <Button variant={"secondary"} className="rounded-full min-w-[100px]">Return</Button>
                                        )}
                                        {(order.status === "Cancelled") && <Button className="rounded-full min-w-[100px] bg-transparent text-transparent" disabled={true}>-</Button>}
                                        {(order.status !== "Cancelled" && order.status != "Delivered") && <Button onClick={() => handleCancelItem(order._id)} variant={"destructive"} className="rounded-full min-w-[100px]">Cancel</Button>}
                                    </div>
                                </div>

                                <Accordion type="single" collapsible className="border-b-0">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Ordered Items</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="border-t">
                                                {order.orderedItems.map(item => (
                                                    <div key={item.productID} className="py-3 border-b flex justify-between items-center gap-2">
                                                        <div className="flex gap-3">
                                                            <div className="size-16">
                                                                <img src={`${SERVER_URL}${item.thumbnail}`} alt="product-img" />
                                                            </div>
                                                            <div className="font-medium">
                                                                <div className="flex gap-2">
                                                                    <h3>{item.name}</h3>
                                                                </div>
                                                                <p className="text-sm">Brand: <span className="text-gray-400">{item.brand}</span></p>
                                                                <h2 className="text-xl">{formatPrice(item.price)}</h2>
                                                            </div>
                                                        </div>

                                                        <div className="text-center font-medium">
                                                            <div className="text-gray-400 mb-2">Quantity</div>
                                                            <div>{item.quantity}</div>
                                                        </div>

                                                        <div className="text-center font-medium">
                                                            <div className="text-gray-400 mb-2">Item total</div>
                                                            <div>{formatPrice(item.price * item.quantity)}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="py-2 flex gap-2 items-center justify-end">
                                                    <div className="font-medium">Total</div>
                                                    <div>{formatPrice(order.orderedAmount.total)}</div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        ))
                    )}
                </div>
                <div>
                    <Button onClick={() => navigate('/shop')} variant={"secondary"} className="rounded-full"><ArrowLeft className="me-2" size={20} /> Back to Shop</Button>
                </div>
            </div>
        </section>

    );
}

export default OrdersPage;
