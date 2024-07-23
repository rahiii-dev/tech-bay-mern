import OrderReturnTable from "../../components/Admin/OrderReturnTable";
import CustomPagination from "../../components/ui/CustomPagination";
import TableSkeleton from "../../components/ui/TableSkeleton";
import useAxios from "../../hooks/useAxios";
import { OrderList } from "../../utils/types/orderTypes";
import { ORDER_RETURNS_LIST_URL } from "../../utils/urls/adminUrls";

const OrderReturnList = () => {
    const { data: returnOrderList, loading, fetchData } = useAxios<OrderList>({
        url: ORDER_RETURNS_LIST_URL,
        method: 'GET'
    });

    // console.log(returnOrderList);
    const OnReturnConfirmSuccess = () => {
        fetchData()
    }

    return (
        <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
            <div className="w-full h-max py-2 flex justify-between items-center gap-2">
                <div>
                    {/* <Input className="h-[35px]" placeholder="Search by orders" value={searchOrder} onChange={handleChange} /> */}
                </div>
                <div className="flex items-center gap-3">
                    {/* <div>
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
                            </SelectContent>
                        </Select>
                    </div> */}
                </div>
            </div>

            <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
                {loading && <TableSkeleton />}
                {!loading && returnOrderList && returnOrderList.orders.length === 0 && (
                    <div className="p-4 text-center text-foreground">No Returns found.</div>
                )}
                {returnOrderList && returnOrderList.orders && returnOrderList.orders.length > 0 && (
                    <>
                        <OrderReturnTable orders={returnOrderList.orders} onReturnSucess={OnReturnConfirmSuccess} />
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
