import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import useAxios from "../../hooks/useAxios";
import { ORDER_DETAIL_UPDATE_URL, ORDER_DETAIL_URL } from "../../utils/urls/adminUrls";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { Order } from "../../utils/types/orderTypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { SERVER_URL } from "../../utils/constants";
import { formatDate, formatPrice } from "../../utils/appHelpers";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import axios from "../../utils/axios";
import { toast } from "../../components/ui/use-toast";

const OrderView = () => {
    const { data: orderData, loading, fetchData } = useAxios<Order>({}, false)
    const [orderStatus, setOrderStatus] = useState("")
    const [modelOpen, setModelOpen] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();

    const orderId = location.state.oderId;

    useEffect(() => {
        if (orderId) {
            fetchData({
                url: ORDER_DETAIL_URL(orderId),
                method: "GET"
            })
        } else {
            navigate(-1);
        }
    }, [orderId])

    useEffect(() => {
        if(orderData){
            setOrderStatus(orderData.status)
        }
    }, [orderData])

    const handleOrderStatus = async (status: string) => {
        if(orderData && orderStatus != status){
            try {
                await axios.put(ORDER_DETAIL_UPDATE_URL(orderData._id), {status});
                setOrderStatus(status);
                toast({
                    variant: "default",
                    title: `Order status updated successfully.`,
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: `Failed to update order status`,
                    description: "",
                    className: "text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
            }
            finally{
                setModelOpen(false)
            }
        } else {
            setModelOpen(false)
        }
    }


    return (
        <div className="w-full flex flex-col gap-2 overflow-x-hidden custom-scrollbar">
            <div className="w-full flex justify-between items-center gap-2">
                <div>
                    {loading && <Skeleton className="h-5 w-[200px]" />}
                    {!loading && orderData && (
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold">#{orderData.orderNumber}</h1>
                            {orderStatus === "Pending" && <span className="bg-yellow-100 text-yellow-600 px-2 rounded-lg font-medium text-[12px]">Pending</span>}
                            {orderStatus === "Processing" && <span className="bg-blue-100 text-blue-600 px-2 rounded-lg font-medium text-[12px]">Processing</span>}
                            {orderStatus === "Shipped" && <span className="bg-yellow-100 text-yellow-600 px-2 rounded-lg font-medium text-[12px]">Shipped</span>}
                            {orderStatus === "Cancelled" && <span className="bg-red-100 text-red-600 px-2 rounded-lg font-medium text-[12px]">Cancelled</span>}
                            {orderStatus === "Delivered" && (
                                <>
                                    <span className="bg-green-100 text-green-600 px-2 rounded-lg font-medium text-[12px]">Delivered</span>
                                    <span className="text-gray-400 px-2 rounded-lg font-medium text-[12px]">{orderData.deliveryDate && `On${formatDate(orderData.deliveryDate)}`}</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {orderStatus != "Delivered" && (
                        <Dialog open={modelOpen} onOpenChange={setModelOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default" size={"sm"}>Change Status</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Change Order Status</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-3">
                                    <div onClick={() => handleOrderStatus("Processing")} className="border-2 border-transparent hover:border-blue-600 text-blue-600 bg-blue-100 rounded-md text-center cursor-pointer font-medium py-3">Processing</div>
                                    <div onClick={() => handleOrderStatus("Shipped")} className="border-2 border-transparent hover:border-yellow-600 text-yellow-600 bg-yellow-100 rounded-md text-center cursor-pointer font-medium py-3">Shipped</div>
                                    <div onClick={() => handleOrderStatus("Delivered")} className="border-2 border-transparent hover:border-green-600 text-green-600 bg-green-100 rounded-md text-center cursor-pointer font-medium py-3">Delivered</div>
                                    <div onClick={() => handleOrderStatus("Cancelled")} className="border-2 border-transparent hover:border-red-600 text-red-600 bg-red-100 rounded-md text-center cursor-pointer font-medium py-3">Cancel</div>
                                </div>
                                <DialogFooter className="sm:justify-end">
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                            Close
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
            <div className="w-full overflow-x-hidden custom-scrollbar">
                {orderData && (
                    <div className="flex flex-col gap-4 lg:flex-row">
                        <div className="flex-grow flex gap-4 flex-col">
                            <div className="bg-primary-foreground px-3 py-2 rounded-md">
                                <h1 className="font-semibold text-base pb-3 mb-3">Items Summary</h1>
                                <div>
                                    <Table className="w-full overflow-x-scroll">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="font-bold">Product</TableHead>
                                                <TableHead className="font-bold">Price</TableHead>
                                                <TableHead className="font-bold">Quantity</TableHead>
                                                <TableHead className="font-bold">Total Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orderData.orderedItems.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <div className="flex gap-3 max-w-[200px] items-center overflow-hidden">
                                                            <div className="w-[50px] h-[50px] overflow-hidden rounded-sm shadow-lg">
                                                                <img src={`${SERVER_URL}${item.thumbnail}`} className="w-full h-full object-cover object-center" alt="product-image" />
                                                            </div>
                                                            <div>
                                                                <h1>{item.name}</h1>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{formatPrice(item.price)}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div>
                                <div className="w-full bg-primary-foreground px-3 py-2 rounded-md">
                                    <h1 className="font-semibold text-base border-b pb-3 mb-3">Customer Details</h1>
                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Name</p>
                                        <p>{orderData.user.fullName}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Email</p>
                                        <p>{orderData.user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:min-w-[300px] flex gap-4 flex-col sm:flex-row lg:flex-col">
                            <div className="w-full bg-primary-foreground px-3 py-2 rounded-md">
                                <h1 className="font-semibold text-base border-b pb-3 mb-3">Order Summary</h1>
                                <div className="font-medium flex justify-between items-center mb-2">
                                    <p className="text-gray-400">Subtotal</p>
                                    <p>{formatPrice(orderData.orderedAmount.subtotal)}</p>
                                </div>
                                <div className="font-medium flex justify-between items-center mb-2">
                                    <p className="text-gray-400">Discount</p>
                                    <p className="text-red-500">{orderData.orderedAmount.discount > 0 ? orderData.orderedAmount.discount : '-'}</p>
                                </div>
                                <div className="font-medium flex justify-between items-center mb-2">
                                    <p className="text-gray-400">Delivery Fee</p>
                                    <p>{orderData.orderedAmount.deliveryFee > 0 ? formatPrice(orderData.orderedAmount.deliveryFee) : '-'}</p>
                                </div>
                                <div className="font-medium flex justify-between items-centerb">
                                    <p>Total</p>
                                    <p className="font-semibold text-xl">{formatPrice(orderData.orderedAmount.total)}</p>
                                </div>
                            </div>
                            <div className="w-full bg-primary-foreground px-3 py-2 rounded-md">
                                <h1 className="font-semibold text-base border-b pb-3 mb-3">Delivery Address</h1>
                                <div className="mb-5">
                                    <div className="text-gray-400">
                                        <div className="font-medium">{orderData.address.fullName}</div>
                                        <div>{orderData.address.addressLine1}</div>
                                        <div>{orderData.address.phone}</div>
                                        <div>
                                            {orderData.address.city + ', ' + orderData.address.state + ", " + orderData.address.country}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderView;
