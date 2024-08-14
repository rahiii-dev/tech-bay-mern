import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";
import { formatDate, formatPrice } from "../../utils/appHelpers";
import { ArrowLeft, CircleAlert } from "lucide-react";
import useAxios from "../../hooks/useAxios";
import { USER_CANCEL_ORDER_URL, USER_ORDER_LIST_URL, USER_RETURN_ORDER_URL } from "../../utils/urls/userUrls";
import { Order, OrderProduct } from "../../utils/types/orderTypes";
import { SERVER_URL } from "../../utils/constants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import axios from "../../utils/axios";
import { toast } from "../../components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import DownloadInvoice from "../../components/User/DownloadInvoice";
import { useCart } from "../../components/User/CartProvider";

const filterOrders = (orders: Order[], status: string[]): Order[] => {
    if (status.length === 0) {
        return orders;
    }

    return orders.filter(order => status.includes(order.status));
}

const OrdersPage = () => {
    const [filteredOrderList, setFilteredOrderList] = useState<Order[]>([]);
    const [filter, setFilter] = useState<string[]>(["Processing", "Shipped"]);
    const [cancelModelActive, setCancelModelActive] = useState(false);
    const [returnModelActive, setReturnModelActive] = useState(false);
    const [itemToCancel, setItemToCancel] = useState<{ orderId: string, OrderProduct: OrderProduct } | null>(null);
    const [itemToReturn, setItemToReturn] = useState<{ orderId: string, OrderProduct: OrderProduct } | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [returnReason, setReturnReason] = useState("");
    const { setPaymentPageAccessible } = useCart()

    const { data: OrdersList, loading, fetchData: fetchOrdersList } = useAxios<Order[]>({
        url: USER_ORDER_LIST_URL,
        method: 'GET',
    });

    useEffect(() => {
        if (OrdersList) {
            setFilteredOrderList(filterOrders(OrdersList, filter))
        }
    }, [OrdersList, filter])

    const navigate = useNavigate();

    const handleCloseModel = () => {
        setCancelModelActive(false);
        setReturnModelActive(false);
        setItemToCancel(null);
        setItemToReturn(null);
        setCancelReason("");
        setReturnReason("");
    };

    const handleCancelItemModel = (orderId: string, product: OrderProduct) => {
        setItemToCancel({ orderId, OrderProduct: product });
        setCancelModelActive(true);
    };

    const handleReturnItemModel = (orderId: string, product: OrderProduct) => {
        setItemToReturn({ orderId, OrderProduct: product });
        setReturnModelActive(true);
    };

    const handleCancel = async () => {
        if (itemToCancel) {
            try {
                await axios.post(USER_CANCEL_ORDER_URL(itemToCancel.orderId), {
                    productId: itemToCancel.OrderProduct.productID,
                    reason: cancelReason
                });
                fetchOrdersList();
                toast({
                    variant: "default",
                    title: `Order cancelled successfully.`,
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
                handleCloseModel();
            } catch (error) {
                fetchOrdersList();
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

    const handleReturn = async () => {
        if (itemToReturn) {
            try {
                await axios.post(USER_RETURN_ORDER_URL(itemToReturn.orderId), {
                    productId: itemToReturn.OrderProduct.productID,
                    reason: returnReason
                });
                fetchOrdersList();
                toast({
                    variant: "default",
                    title: `Return initiated successfully.`,
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
                handleCloseModel();
            } catch (error) {
                fetchOrdersList();
                toast({
                    variant: "destructive",
                    title: `Failed to initiate return`,
                    description: "",
                    className: "text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
                handleCloseModel();
            }
        }
    };

    const handleFilter = (filter: string[]) => {
        setFilter(filter);
    }

    const handlePayment = (order: Order) => {
        setPaymentPageAccessible(true);
        navigate("/payment", { state: { order } });
    }

    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                {!loading && OrdersList && OrdersList.length === 0 ? (
                    <div className="h-[250px]">
                        <SubHeading className="mb-10">No Orders Yet</SubHeading>
                        <div className="text-center mt-3">
                            <Link to={'/shop'}>
                                <Button size={"lg"} className="rounded-full">Shop Now</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <SubHeading className="text-left mb-10">My Orders</SubHeading>
                        <div className="flex gap-3 items-center justify-between border-b mb-3">
                            <div className="flex gap-2">
                                <Button onClick={() => handleFilter(["Processing", "Shipped"])} className={`bg-transparent text-gray-400 rounded-none hover:bg-transparent hover:text-primary ${(filter.includes("Processing") || filter.includes("Shipped")) && 'text-primary border-b-2 border-primary'}`}>Orders</Button>
                                <Button onClick={() => handleFilter(["Pending"])} className={`bg-transparent text-gray-400 rounded-none hover:bg-transparent hover:text-primary ${(filter.includes("Pending")) && 'text-primary border-b-2 border-primary'}`}>Pending Payment</Button>
                                <Button onClick={() => handleFilter(["Delivered"])} className={`bg-transparent text-gray-400 rounded-none hover:bg-transparent hover:text-primary ${(filter.includes("Delivered")) && 'text-primary border-b-2 border-primary'}`}>Delivered</Button>
                                <Button onClick={() => handleFilter(["Cancelled", "Returned"])} className={`bg-transparent text-gray-400 rounded-none hover:bg-transparent hover:text-primary ${(filter.includes("Cancelled") || filter.includes("Returned")) && 'text-primary border-b-2 border-primary'}`}>Cancelled / Returned</Button>
                            </div>
                            <div>
                                <Button onClick={() => navigate(-1)} variant={"outline"} size={"sm"} className="gap-2 text-xs rounded-full border-none"><ArrowLeft size="18" /> Go Back</Button>
                            </div>
                        </div>
                    </>
                )}

                {!loading && (
                    <>
                        {filteredOrderList.length > 0 ? (
                            <div className="mb-4 flex flex-col gap-4">
                                {filteredOrderList.map((order, index) => (
                                    <div key={order._id} className={`flex-grow w-full border rounded-xl overflow-hidden px-3 max-w-[800px] mx-auto ${(order.status === "Cancelled" || order.status == "Returned") && 'text-gray-400'}`}>
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
                                                    <div>
                                                        <p className="text-yellow-600 mb-2">Order Pending</p>
                                                        <Button onClick={() => handlePayment(order)} size={"sm"} className="rounded-full min-w-[100px]">Pay Now</Button>
                                                    </div>
                                                )}

                                                {(order.status === "Processing") && (
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

                                                {order.status === "Returned" && (
                                                    <div className="text-gray-400">
                                                        <p>Order is Returned</p>
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
                                                            <div key={item.productID} className={`py-3 border-b flex justify-between items-center gap-2 ${(item.cancelled || item.returnConfirmed) && 'text-gray-400'}`}>
                                                                <div className="flex gap-3 w-[300px] overflow-x-hidden">
                                                                    <div className={`size-16 ${(item.cancelled || item.returnConfirmed) && 'opacity-30'}`}>
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

                                                                {order.status != "Pending" && (
                                                                    <div>
                                                                        {item.canCancel && <Button onClick={() => handleCancelItemModel(order._id, item)} variant={"destructive"} size={"sm"} className="rounded-full min-w-[100px]">Cancel</Button>}
                                                                        {item.canReturn && <Button onClick={() => handleReturnItemModel(order._id, item)} variant={"secondary"} size={"sm"} className="rounded-full min-w-[100px]">Return</Button>}
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    {item.cancelled && <div>Item Cancelled</div>}
                                                                    {item.returned && <div className="text-center">
                                                                        <div className="font-medium text-primary">Item Returned</div>
                                                                        {!item.returnConfirmed && <div className="max-w-[150px] text-sm">Our team is confirming your return request.</div>}
                                                                    </div>}
                                                                    {(!item.cancelled && !item.returned) && (
                                                                        <div className="text-center font-medium">
                                                                            <div className="text-gray-400 mb-2">Item total</div>
                                                                            <div>{formatPrice(item.price * item.quantity)}</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}

                                                        <div className="flex justify-between">
                                                            <div>
                                                                <div className="py-2 flex gap-2 items-center justify-end text-gray-400">
                                                                    <div className="font-medium">Payment Type: </div>
                                                                    {order.transaction ? (
                                                                        <div>{order.transaction.paymentMethod === "cod" ? "Cash On Delivey" : order.transaction.paymentMethod}</div>
                                                                    ) : '-'}
                                                                    
                                                                </div>
                                                                {order.status === "Delivered" && (
                                                                    <DownloadInvoice orderID={order._id} orderNumber={order.orderNumber}/>
                                                                )}
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
                                ))}
                            </div>
                        ) : (
                            <div className="font-medium text-gray-400 text-center pb-6">
                                {OrdersList && OrdersList.length > 0 && (filter.includes("Processing") || filter.includes("Shipped")) && "No Orders"}
                                {OrdersList && OrdersList.length > 0 && (filter.includes("Pending")) && "No Pending Orders"}
                                {OrdersList && OrdersList.length > 0 && filter.includes("Delivered") && "No Orders Delivered yet"}
                                {OrdersList && OrdersList.length > 0 && (filter.includes("Cancelled") || filter.includes("Returned")) && "No Returned or Cancelles Orders"}
                            </div>
                        )}
                    </>
                )}
            </div>

            {cancelModelActive && (
                <Dialog open={cancelModelActive} onOpenChange={() => handleCloseModel()}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Cancel Order Item</DialogTitle>
                        </DialogHeader>

                        <div>
                            <div className="my-2 text-gray-400 flex items-center gap-3">
                                <p><CircleAlert /></p>
                                <p className="text-sm text-gray-400">Are you sure you want to cancel this item? This action cannot be undone.</p>
                            </div>

                            {itemToCancel && (
                                <div className="flex justify-between">
                                    <div className="flex gap-3 w-[300px] overflow-x-hidden">
                                        <div className={`size-16 ${(itemToCancel.OrderProduct.cancelled || itemToCancel.OrderProduct.returnConfirmed) && 'opacity-30'}`}>
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

                            <div className="mt-4">
                                <Select onValueChange={(value) => setCancelReason(value)} defaultValue={cancelReason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Better price available">Better price available</SelectItem>
                                        <SelectItem value="Need to change shipping address">Need to change shipping address</SelectItem>
                                        <SelectItem value="Order created by mistake">Order created by mistake</SelectItem>
                                        <SelectItem value="Need to change payment method">Need to change payment method</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center mt-6 gap-3">
                                <Button disabled={!cancelReason} onClick={handleCancel} className="w-full">Confirm Cancel</Button>
                                <Button variant={"secondary"} onClick={handleCloseModel} className="w-full">Close</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {returnModelActive && (
                <Dialog open={returnModelActive} onOpenChange={() => handleCloseModel()}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Return Order Item</DialogTitle>
                        </DialogHeader>

                        <div>
                            <div className="my-2 text-gray-400 flex items-center gap-3">
                                <p><CircleAlert /></p>
                                <p className="text-sm">Are you sure you want to return this item? Returns are accepted within 10 days of delivery. The return will be confirmed by our team and the amount will be added to your wallet.</p>
                            </div>

                            {itemToReturn && (
                                <div className="flex justify-between">
                                    <div className="flex gap-3 w-[300px] overflow-x-hidden">
                                        <div className={`size-16 ${(itemToReturn.OrderProduct.cancelled || itemToReturn.OrderProduct.returnConfirmed) && 'opacity-30'}`}>
                                            <img src={`${SERVER_URL}${itemToReturn.OrderProduct.thumbnail}`} alt="product-img" />
                                        </div>
                                        <div className="font-medium">
                                            <div className="flex gap-2">
                                                <h3>{itemToReturn.OrderProduct.name}</h3>
                                            </div>
                                            <p className="text-sm">Brand: <span className="text-gray-400">{itemToReturn.OrderProduct.brand}</span></p>
                                            <h2 className="text-xl">{formatPrice(itemToReturn.OrderProduct.price)}</h2>
                                        </div>
                                    </div>

                                    <div className="text-center font-medium">
                                        <div className="text-gray-400 mb-2">Quantity</div>
                                        <div>{itemToReturn.OrderProduct.quantity}</div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <Select onValueChange={(value) => setReturnReason(value)} defaultValue={returnReason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Item damaged">Item damaged</SelectItem>
                                        <SelectItem value="Wrong item received">Wrong item received</SelectItem>
                                        <SelectItem value="Item not as described">Item not as described</SelectItem>
                                        <SelectItem value="No longer needed">No longer needed</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center mt-6 gap-3">
                                <Button disabled={!returnReason} onClick={handleReturn} className="w-full">Confirm Return</Button>
                                <Button variant={"secondary"} onClick={handleCloseModel} className="w-full">Close</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </section>
    )
}

export default OrdersPage;
