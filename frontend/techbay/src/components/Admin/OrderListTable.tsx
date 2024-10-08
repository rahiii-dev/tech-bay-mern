import { TableBody } from "@mui/material";
import { Order } from "../../utils/types/orderTypes";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { formatDate, formatPrice } from "../../utils/appHelpers";
import { useNavigate } from "react-router-dom";

type OrderListTable = {
    orders: Order[]
}

const OrderListTable = ({ orders }: OrderListTable) => {
    const navigate = useNavigate();

    const handleView = (orderId: string) => {
        navigate('/admin/order', { state: { orderId } })
    }

    return (
        <Table className="w-full overflow-x-scroll">
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold">Order ID</TableHead>
                    <TableHead className="font-bold">Created</TableHead>
                    <TableHead className="font-bold">Customer</TableHead>
                    <TableHead className="font-bold">Total</TableHead>
                    <TableHead className="font-bold">Payment</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map(order => (
                    <TableRow key={order.orderNumber} onClick={() => handleView(order._id)} className="hover:font-medium cursor-pointer">
                        <TableCell>#{order.orderNumber}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{order.user.fullName}</TableCell>
                        <TableCell className="font-medium">{formatPrice(order.orderedAmount.total)}</TableCell>
                        <TableCell>{order.transaction ? order.transaction.paymentMethod : '-'}</TableCell>
                        <TableCell>
                            {order.status === "Pending" && <span className="bg-yellow-100 text-yellow-600 px-2 rounded-lg font-medium text-[12px]">Pending</span>}
                            {order.status === "Processing" && <span className="bg-blue-100 text-blue-600 px-2 rounded-lg font-medium text-[12px]">Processing</span>}
                            {order.status === "Shipped" && <span className="bg-yellow-100 text-yellow-600 px-2 rounded-lg font-medium text-[12px]">Shipped</span>}
                            {order.status === "Delivered" && <span className="bg-green-100 text-green-600 px-2 rounded-lg font-medium text-[12px]">Delivered</span>}
                            {order.status === "Cancelled" && <span className="bg-red-100 text-red-600 px-2 rounded-lg font-medium text-[12px]">Cancelled</span>}
                            {order.status === "Returned" && <span className="bg-red-100 text-red-600 px-2 rounded-lg font-medium text-[12px]">Returned</span>}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default OrderListTable;
