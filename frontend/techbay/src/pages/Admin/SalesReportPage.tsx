import { FileUp } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import useAxios from "../../hooks/useAxios";
import { SALES_REPORT_URL } from "../../utils/urls/adminUrls";
import { Label } from "../../components/ui/label";
import { formatPrice } from "../../utils/appHelpers";
import { SalesReportResponse } from "../../utils/types/salesReportTypes";
import OrderListTable from "../../components/Admin/OrderListTable";
import CustomPagination from "../../components/ui/CustomPagination";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "../../components/ui/use-toast";
import { SERVER_URL } from "../../utils/constants";

const SalesReportPage = () => {
    const [filter, setFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const { data, loading, fetchData } = useAxios<SalesReportResponse>({}, false);

    useEffect(() => {
        fetchData({ url: `${SALES_REPORT_URL}?page=${currentPage}` });
    }, [currentPage]);

    const handleGetReport = () => {
        if (filter === "custom" && (!startDate || !endDate)) {
            toast({
                variant: "destructive",
                title: "Please select both start and end dates",
                className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
            })
            return;
        }

        const url = new URL(`/api${SALES_REPORT_URL}`, SERVER_URL);
        url.searchParams.append("filter", filter);
        if (filter === "custom") {
            url.searchParams.append("startDate", startDate);
            url.searchParams.append("endDate", endDate);
        }
        url.searchParams.append("page", currentPage.toString());

        fetchData({ 
            url: url.toString(),
            method: 'GET'
         });
    };

    return (
        <div className="h-full w-full flex flex-col gap-2">
            <div className="w-full h-max py-2 flex justify-end items-center gap-2">
                <div>
                    <Button size="sm" className="h-8 gap-1" onClick={() => ''}>
                        <FileUp className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Export
                        </span>
                    </Button>
                </div>
            </div>

            <div className="w-full py-2 flex gap-4">
                <div className="flex-grow flex flex-col gap-4 bg-primary-foreground p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4">Filter Report</h2>
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-full h-[40px]">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                            <SelectItem value="day">Day</SelectItem>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                    </Select>
                    {filter === "custom" && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Label>Start Date:</Label>
                                <Input className="h-[40px] w-full" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className="flex-1">
                                <Label>End Date:</Label>
                                <Input className="h-[40px] w-full" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                        </div>
                    )}
                    <Button size="sm" className="h-10 mt-4" onClick={handleGetReport}>
                        Get Report
                    </Button>
                </div>

                <div className="h-full bg-primary-foreground p-6 rounded-xl">
                    <h2 className="text-xl font-bold mb-4">Sales Report</h2>
                    {!loading && data && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="text-lg">
                                <span className="font-medium text-gray-400">Number of Orders:</span> <span>{data.salesReport.numberOfOrders}</span>
                            </div>
                            <div className="text-lg">
                                <span className="font-medium text-gray-400">Average Order Value:</span> <span>{formatPrice(data.salesReport.averageOrderValue)}</span>
                            </div>
                            <div className="text-lg">
                                <span className="font-medium text-gray-400">Total Items Sold:</span> <span>{data.salesReport.totalItemsSold}</span>
                            </div>
                            <div className="text-lg">
                                <span className="font-medium text-gray-400">Coupon Applied:</span> <span>{data.salesReport.couponApplied}</span>
                            </div>
                            <div className="text-lg">
                                <span className="font-medium text-gray-400">Total Discount:</span> <span className="text-red-500 font-medium">- {formatPrice(data.salesReport.totalDiscount)}</span>
                            </div>
                            <div className="text-lg">
                                <span className="font-medium text-gray-400">Total Sales:</span> <span>{formatPrice(data.salesReport.totalSales)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full py-2 bg-primary-foreground p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Orders</h2>
                {loading && <TableSkeleton />}
                {!loading && data && data.ordersInRange.orders.length === 0 && (
                    <div className="p-4 text-center text-foreground">No orders found.</div>
                )}
                {data && data.ordersInRange.orders.length > 0 && (
                    <div className="">
                        <OrderListTable orders={data.ordersInRange.orders} />
                        <div className="px-4 py-3 border-t-2 border-secondary flex justify-between items-center gap-3">
                            {data && (
                                <>
                                    <div className="text-sm font-medium text-gray-400">
                                        {(data.ordersInRange.totalOrders ?? 0) > 10
                                            ? `Showing 1 - ${data.ordersInRange.limit} of ${data.ordersInRange.totalOrders}`
                                            : `Showing all ${data.ordersInRange.totalOrders}`}
                                    </div>
                                    <CustomPagination hasNextPage={data.ordersInRange.hasNextPage} hasPrevPage={data.ordersInRange.hasPrevPage} page={data.ordersInRange.page} totalPages={data.ordersInRange.totalPages} />
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SalesReportPage;
