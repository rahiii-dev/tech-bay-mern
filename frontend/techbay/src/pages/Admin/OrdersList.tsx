import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { ORDER_LIST_URL } from "../../utils/urls/adminUrls";
import useAxios from "../../hooks/useAxios";
import CustomPagination from "../../components/ui/CustomPagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { debounce } from "@mui/material";
import { Order, OrderList } from "../../utils/types/orderTypes";
import OrderListTable from "../../components/Admin/OrderListTable";
import { Button } from "../../components/ui/button";

const OrdersList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState("all");
    const [searchOrder, setSearchorder] = useState("");
    const [searchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const { data, loading, fetchData } = useAxios<OrderList>({}, false)

    useEffect(() => {
        fetchData({
            url: `${ORDER_LIST_URL}?page=${currentPage}&status=${filter}`,
            method: 'GET'
        })
    }, [currentPage, filter]);

    useEffect(() => {
        if (data) {
            setOrders(data.orders)
        }
    }, [data]);

    const handleSearch = debounce((term: string) => {
        fetchData({
            url: `${ORDER_LIST_URL}?page=${currentPage}&search=${term.trim()}`,
            method: 'GET'
        })
    }, 300);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchorder(value)
        handleSearch(value)
    }

    return (
        <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
            <div className="w-full h-max py-2 flex justify-between items-center gap-2">
                <div>
                    <Input className="h-[35px]" placeholder="Search by orders" value={searchOrder} onChange={handleChange} />
                </div>
                <div className="flex items-center gap-3">
                    <div>
                        <Link to={"/admin/return-orders"}>
                            <Button className="py-0 px-4 h-[34px]" size={"sm"}>Returns</Button>
                        </Link>
                    </div>
                    <div>
                        <Select onValueChange={setFilter}>
                            <SelectTrigger className="w-[120px] h-[35px]">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                <SelectItem value="Returned">Returned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
                {loading && !searchOrder && <TableSkeleton />}
                {!loading && data && orders && orders.length === 0 && (
                    <div className="p-4 text-center text-foreground">No orders found.</div>
                )}
                {data && orders && orders.length > 0 && (
                    <>
                        <OrderListTable orders={orders} />
                        <div className="px-4 py-3 border-t-2 border-secondary flex justify-between items-center gap-3">
                            {data && (
                                <>
                                    <div className="text-sm font-medium text-gray-400">
                                        {(data.totalOrders ?? 0) > 10
                                            ? `Showing 1 - ${data.limit} of ${data.totalOrders}`
                                            : `Showing all ${data.totalOrders}`}
                                    </div>
                                    <CustomPagination hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} page={data.page} totalPages={data.totalPages} />
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default OrdersList;
