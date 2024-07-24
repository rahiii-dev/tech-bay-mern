import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, formatPrice } from "../../utils/appHelpers";
import { SERVER_URL } from "../../utils/constants";
import { Order, OrderProduct } from "../../utils/types/orderTypes";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import axios from "../../utils/axios";
import { ORDER_RETURN_CONFIRM_URL } from "../../utils/urls/adminUrls";
import { toast } from "../ui/use-toast";

type OrderReturnTableProp = {
    orders: Order[];
    tableType: 'approve' | 'list',
    onReturnSucess?: () => void;
}

const OrderReturnTable = ({ orders, onReturnSucess, tableType }: OrderReturnTableProp) => {
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [currentItem, setCurrentItem] = useState<OrderProduct | null>(null);
    const [updateStock, setUpdateStock] = useState(false);

    const handleOrderView = (orderId: string) => {
        navigate('/admin/order', { state: { orderId } })
    }

    const handleCloseDialoge = () => {
        setCurrentOrder(null);
        setCurrentItem(null);
        setUpdateStock(false);
        setIsDialogOpen(false);
    }

    const handleApprove = (order: Order, item: any) => {
        setCurrentOrder(order);
        setCurrentItem(item);
        setIsDialogOpen(true);
    }

    const confirmApprove = async () => {
        try {
            await axios.post(ORDER_RETURN_CONFIRM_URL, {
                orderId: currentOrder?._id,
                productId: currentItem?.productID,
                stockUpdate: updateStock
            });
            onReturnSucess?.()
            toast({
                variant: "default",
                title: `Order cancelled successfully.`,
                description: "",
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
            handleCloseDialoge();

        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: `Failed to cancel order`,
                description: "",
                className: "text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
            handleCloseDialoge();

        }
    }

    return (
        <>
            <Table className="w-full overflow-x-scroll">
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Return Item</TableHead>
                        <TableHead className="font-bold">Order ID</TableHead>
                        <TableHead className="font-bold">Customer</TableHead>
                        <TableHead className="font-bold">Reason</TableHead>
                        <TableHead className="font-bold">{tableType == "approve" ? 'Actions' : 'Confirmed Date'}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map(order => {
                        return order.orderedItems.map(item => (
                            <TableRow key={item.productID}>
                                <TableCell>
                                    <div className="flex gap-3 items-center overflow-hidden">
                                        <div className="w-[50px] h-[50px] overflow-hidden rounded-sm shadow-lg">
                                            <img src={`${SERVER_URL}${item.thumbnail}`} className="w-full h-full object-cover object-center" alt="product-image" />
                                        </div>
                                        <div>
                                            <h1>{item.name}</h1>
                                            <p>{formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div onClick={() => handleOrderView(order._id)} className="hover:font-medium cursor-pointer">
                                                    #{order.orderNumber}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side='top'>
                                                <p>View Order Details</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell>{order.user.fullName}</TableCell>
                                <TableCell>{item.returnReason}</TableCell>
                                <TableCell>
                                    {tableType == "approve" ? (
                                        <Button size={"sm"} onClick={() => handleApprove(order, item)}>Approve</Button>
                                    ) : item.returnConfirmationDate ? formatDate(item.returnConfirmationDate) : '-'}
                                </TableCell>
                            </TableRow>
                        ))
                    })}
                </TableBody>
            </Table>

            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialoge}>
                <DialogContent>
                    <DialogTitle>Confirm Approve?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to approve this return? You can also choose whether to update the stock.
                    </DialogDescription>
                    {currentItem && (
                        <>
                            <div className="flex justify-between">
                                <div className="flex gap-3 w-[300px] overflow-x-hidden">
                                    <div className={`size-16 ${(currentItem.cancelled || currentItem.returnConfirmed) && 'opacity-30'}`}>
                                        <img src={`${SERVER_URL}${currentItem.thumbnail}`} alt="product-img" />
                                    </div>
                                    <div className="font-medium">
                                        <div className="flex gap-2">
                                            <h3>{currentItem.name}</h3>
                                        </div>
                                        <p className="text-sm">Brand: <span className="text-gray-400">{currentItem.brand}</span></p>
                                        <h2 className="text-xl">{formatPrice(currentItem.price)}</h2>
                                    </div>
                                </div>

                                <div className="text-center font-medium">
                                    <div className="text-gray-400 mb-2">Quantity</div>
                                    <div>{currentItem.quantity}</div>
                                </div>
                            </div>
                            <div className="font-medium text-gray-400">
                                <span>Return Reason : {currentItem.returnReason}</span>
                            </div>
                        </>
                    )}
                    <div className="flex items-center gap-2 my-2">
                        <Checkbox id="updateStock" checked={updateStock} onCheckedChange={(checked) => checked ? setUpdateStock(true) : setUpdateStock(false)} />
                        <label htmlFor="updateStock">Update Stock</label>
                    </div>
                    <DialogFooter>
                        <Button onClick={confirmApprove}>Confirm</Button>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default OrderReturnTable;
