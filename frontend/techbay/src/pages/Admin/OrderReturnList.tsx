import { useEffect, useState } from "react";
import OrderReturnTable from "../../components/Admin/OrderReturnTable";
import CustomPagination from "../../components/ui/CustomPagination";
import TableSkeleton from "../../components/ui/TableSkeleton";
import useAxios from "../../hooks/useAxios";
import { OrderList } from "../../utils/types/orderTypes";
import { ORDER_RETURNS_LIST_URL } from "../../utils/urls/adminUrls";
import { useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

const OrderReturnList = () => {
    const [filter, setFilter] = useState("false");
    const [searchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const { data: returnOrderList, loading, fetchData } = useAxios<OrderList>({}, false);

    useEffect(() => {
        fetchData({
            url: `${ORDER_RETURNS_LIST_URL}?page=${currentPage}&confirmed=${filter}`,
            method: 'GET'
        })
    }, [currentPage, filter]);

    const OnReturnConfirmSuccess = () => {
        fetchData({
            url: `${ORDER_RETURNS_LIST_URL}?page=${currentPage}&confirmed=${filter}`,
            method: 'GET'
        })
    }

    return (
        <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
            <div className="w-full h-max py-2 flex justify-between items-center gap-2">
                <div>
                    <h1 className="font-medium">{filter === "false" ? 'Orders Waiting for Confirmation' : 'Confirmed Return Orders'}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[120px] h-[35px]">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Confirmed</SelectItem>
                                <SelectItem value="false">Not_Confirmed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
                {loading && <TableSkeleton />}
                {!loading && returnOrderList && returnOrderList.orders.length === 0 && (
                    <div className="p-4 text-center text-foreground">No Returns found.</div>
                )}
                {returnOrderList && returnOrderList.orders && returnOrderList.orders.length > 0 && (
                    <>
                        <OrderReturnTable orders={returnOrderList.orders} onReturnSucess={OnReturnConfirmSuccess} tableType={filter === "false" ? 'approve' : 'list'} />
                        <div className="px-4 py-3 border-t-2 border-secondary flex justify-between items-center gap-3">
                            {returnOrderList && (
                                <>
                                    <div className="text-sm font-medium text-gray-400">
                                        {(returnOrderList.totalOrders ?? 0) > 10
                                            ? `Showing 1 - ${returnOrderList.limit} of ${returnOrderList.totalOrders}`
                                            : `Showing all ${returnOrderList.totalOrders}`}
                                    </div>
                                    <CustomPagination hasNextPage={returnOrderList.hasNextPage} hasPrevPage={returnOrderList.hasPrevPage} page={returnOrderList.page} totalPages={returnOrderList.totalPages} />
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default OrderReturnList;
