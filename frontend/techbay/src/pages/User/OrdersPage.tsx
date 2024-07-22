import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";
import { formatDate, formatPrice } from "../../utils/appHelpers";
import { ArrowLeft } from "lucide-react";
import useAxios from "../../hooks/useAxios";
import { USER_CANCEL_ORDER_URL, USER_ORDER_LIST_URL } from "../../utils/urls/userUrls";
import { Order, OrderProduct } from "../../utils/types/orderTypes";
import { SERVER_URL } from "../../utils/constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import axios from "../../utils/axios";
import { toast } from "../../components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

const OrdersPage = () => {
    const [modelActive, setModelActive] = useState(false);
    const [itemToCancel, setItemToCancel] = useState<{ orderId: string, OrderProduct: OrderProduct } | null>(null);
    const [cancelReason, setCancelReason] = useState("");

    const { data: OrdersList, loading, fetchData: fetchOdersList } = useAxios<Order[]>({
        url: USER_ORDER_LIST_URL,
        method: 'GET',
    });

    console.log(OrdersList);

    const navigate = useNavigate();

    const handleCloseModel = () => {
        setModelActive(false);
        setItemToCancel(null);
        setCancelReason("");
    };

    const handleCancelItemModel = (orderId: string, product: OrderProduct) => {
        setItemToCancel({ orderId, OrderProduct: product });
        setModelActive(true);
    };

    const handleCancel = async () => {
        if (itemToCancel) {
            try {
                await axios.post(USER_CANCEL_ORDER_URL(itemToCancel.orderId), {
                    productId: itemToCancel.OrderProduct.productID,
                    reason: cancelReason
                });
                fetchOdersList();
                toast({
                    variant: "default",
                    title: `Order cancelled successfully.`,
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
                handleCloseModel();
            } catch (error) {
                fetchOdersList();
                toast({
                    variant: "destructive",
                    title: `Failed to cancel order`,
                    description: "",
                    className: "text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
                handleCloseModel();
            }
        }
    };

    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                <SubHeading className="text-left mb-10">{OrdersList && OrdersList.length === 0 ? 'No orders yet' : 'My Orders'}</SubHeading>
                <div className="mb-4 flex flex-col gap-4">
                    {!loading && OrdersList && OrdersList.length > 0 && (
                        OrdersList.map((order, index) => (
                            <div key={order._id} className={`flex-grow w-full border rounded-xl overflow-hidden px-3 max-w-[800px] mx-auto ${order.status === "Cancelled" && 'text-gray-400'}`}>
                                <div className="flex justify-between items-start border-b py-4 px-3">
                                    <div>
                                        <h1 className="text-md font-medium">#{order.orderNumber}</h1>
                                        <h3 className="text-sm text-gray-400">Order Placed: {formatDate(order.createdAt)}</h3>
                                    </div>

                                    <div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="cursor-pointer">
                                                        <h1 className="font-medium">Shipping Address:</h1>
                                                        <div className="text-gray-400 font-medium">{order.address.fullName}...</div>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="text-gray-400">
                                                        <div className="font-medium">{order.address.fullName}</div>
                                                        <div>{order.address.addressLine1}</div>
                                                        <div>{order.address.phone}</div>
                                                        <div>
                                                            {order.address.city + ', ' + order.address.state + ", " + order.address.country}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>

                                    <div className={`font-semibold`}>
                                        {order.status === "Delivered" && (
                                            <div>
                                                <p>Delivered On</p>
                                                <p>{order.deliveryDate && formatDate(order.deliveryDate)}</p>
                                            </div>
                                        )}

                                        {order.status === "Pending" && (
                                            <div className="text-yellow-600">
                                                <p>Order is Pending</p>
                                            </div>
                                        )}

                                        {(order.status === "Processing" || order.status === "Pending") && (
                                            <div className="text-blue-600">
                                                <p>Order is Proceesing</p>
                                            </div>
                                        )}

                                        {order.status === "Shipped" && (
                                            <div className="text-green-600">
                                                <p>Arriving On</p>
                                                <p>{order.deliveryDate && formatDate(order.deliveryDate)}</p>
                                            </div>
                                        )}

                                        {order.status === "Cancelled" && (
                                            <div className="text-gray-400">
                                                <p>Order is Cancelled</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Accordion defaultValue={`${index === 0 && `item-${index}`}`} type="single" collapsible className="border-b-0">
                                    <AccordionItem value={`item-${index}`}>
                                        <AccordionTrigger>Order Details</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="border-t">
                                                {order.orderedItems.map(item => (
                                                    <div key={item.productID} className={`py-3 border-b flex justify-between items-center gap-2 ${item.cancelled && 'text-gray-400'}`}>
                                                        <div className="flex gap-3 w-[300px] overflow-x-hidden">
                                                            <div className={`size-16 ${item.cancelled && 'opacity-30'}`}>
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

                                                        <div>
                                                            {item.canCancel && <Button onClick={() => handleCancelItemModel(order._id, item)} variant={"destructive"} size={"sm"} className="rounded-full min-w-[100px]">Cancel</Button>}
                                                            {item.canReturn && <Button variant={"secondary"} size={"sm"} className="rounded-full min-w-[100px]">Return</Button>}
                                                        </div>

                                                        {item.cancelled ? (<div>Item cancelled</div>) : (
                                                            <div className="text-center font-medium">
                                                                <div className="text-gray-400 mb-2">Item total</div>
                                                                <div>{formatPrice(item.price * item.quantity)}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                <div className="flex justify-between">
                                                    <div className="py-2 flex gap-2 items-center justify-end text-gray-400">
                                                        <div className="font-medium">Payment Type: </div>
                                                        <div>{order.paymentMethod === "cod" ? "Cash On Delivey" : order.paymentMethod.toUpperCase()}</div>
                                                    </div>
                                                    <div className="py-2 flex gap-2 items-center justify-end">
                                                        <div className="font-medium">Total:</div>
                                                        <div>{order.status === "Cancelled" ? '-' : formatPrice(order.orderedAmount.total)}</div>
                                                    </div>
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

            <Dialog open={modelActive} onOpenChange={handleCloseModel}>
                <DialogContent className="flex flex-col gap-4 sm:max-w-[500px] h-[80vh] overflow-y-scroll custom-scrollbar">
                    <DialogHeader>
                        <div className="grid gap-2 text-center">
                            <DialogTitle className="text-3xl font-bold">Cancel this Item?</DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col gap-3">
                        {itemToCancel && (
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3 w-[300px] overflow-x-hidden">
                                    <div className="size-16">
                                        <img src={`${SERVER_URL}${itemToCancel.OrderProduct.thumbnail}`} alt="product-img" />
                                    </div>
                                    <div className="font-medium">
                                        <div className="flex gap-2">
                                            <h3>{itemToCancel.OrderProduct.name}</h3>
                                        </div>
                                        <p className="text-sm">Brand: <span className="text-gray-400">{itemToCancel.OrderProduct.brand}</span></p>
                                        <h2 className="text-xl">{formatPrice(itemToCancel.OrderProduct.price)}</h2>
                                    </div>
                                </div>
                                <div className="text-center font-medium">
                                    <div className="text-gray-400 mb-2">Quantity</div>
                                    <div>{itemToCancel.OrderProduct.quantity}</div>
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-md font-semibold mb-3">Select Cancel Reason</h3>
                            <Select onValueChange={(value) => setCancelReason(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a reason (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ordered_by_mistake">Ordered by mistake</SelectItem>
                                    {/* <SelectItem value="item_damaged_or_defective">Item was damaged or defective</SelectItem> */}
                                    {/* <SelectItem value="item_arrived_too_late">Item arrived too late</SelectItem> */}
                                    <SelectItem value="changed_mind">Changed mind</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2">
                            <Button variant={"destructive"} onClick={handleCancel} className="w-full rounded-full">Cancel Order</Button>
                            <Button variant={"secondary"} onClick={handleCloseModel} className="w-full rounded-full">Dismiss</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default OrdersPage;
