import { useEffect, useState } from "react";
import LineChartComponent from "../../components/Admin/LineChart";
import OrderListTable from "../../components/Admin/OrderListTable";
import ProductListTable from "../../components/Admin/ProductListTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import TableSkeleton from "../../components/ui/TableSkeleton";
import useAxios from "../../hooks/useAxios";
import { DashboardResponse } from "../../utils/types/dasboardTypes";
import { DASHBOARD_DETAILS_URL } from "../../utils/urls/adminUrls";
import { Product } from "../../utils/types/productTypes";

const DashBoard = () => {
    const { data, loading } = useAxios<DashboardResponse>({
        url: DASHBOARD_DETAILS_URL,
        method: 'GET'
    });

    const [selectedTable, setSelectedTable] = useState('latestOrders');
    const [productsList, setProductsList] = useState<Product[]>([]);

    useEffect(() => {
        if(data){
            const productData = data.topSellingProducts.map(proudct => proudct.productDetails)
            setProductsList(productData)
        }
    }, [data]);

    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {loading && (
                    <>
                        <div className="w-full min-h-[200px] p-4 bg-primary-foreground rounded-xl">
                            <Skeleton className="h-6 w-[50%]" />
                            <div className="my-3 flex gap-3 justify-between items-center">
                                <Skeleton className="h-8 w-[60px]" />
                                <Skeleton className="w-full h-[100px]" />
                            </div>
                            <Skeleton className="h-4 w-[50%]" />
                        </div>
                        <div className="w-full min-h-[200px] p-4 bg-primary-foreground rounded-xl">
                            <Skeleton className="h-6 w-[50%]" />
                            <div className="my-3 flex gap-3 justify-between items-center">
                                <Skeleton className="h-8 w-[60px]" />
                                <Skeleton className="w-full h-[100px]" />
                            </div>
                            <Skeleton className="h-4 w-[50%]" />
                        </div>
                        <div className="w-full min-h-[200px] p-4 bg-primary-foreground rounded-xl">
                            <Skeleton className="h-6 w-[50%]" />
                            <div className="my-3 flex gap-3 justify-between items-center">
                                <Skeleton className="h-8 w-[60px]" />
                                <Skeleton className="w-full h-[100px]" />
                            </div>
                            <Skeleton className="h-4 w-[50%]" />
                        </div>
                        <div className="w-full min-h-[200px] p-4 bg-primary-foreground rounded-xl">
                            <Skeleton className="h-6 w-[50%]" />
                            <div className="my-3 flex gap-3 justify-between items-center">
                                <Skeleton className="h-8 w-[60px]" />
                                <Skeleton className="w-full h-[100px]" />
                            </div>
                            <Skeleton className="h-4 w-[50%]" />
                        </div>
                    </>
                )}
                {!loading && data && (
                    <>
                        <LineChartComponent Data={data.ordersData} title="Total Orders" label="Order" />
                        <LineChartComponent Data={data.profitData} title="Total Profit" label="Profit" />
                        <LineChartComponent Data={data.salesData} title="Total Sales" label="Sales" />
                        <LineChartComponent Data={data.customersData} title="Total Customers" label="Customer" />
                    </>
                )}
            </div>

            <div className="w-full py-2 bg-primary-foreground p-6 rounded-xl mt-4 mb-6">

                <div className="flex justify-between">
                    <h2 className="text-xl font-bold mb-4">
                        {selectedTable === 'latestOrders' ? 'Latest Orders' : 'Top Selling Products'}
                    </h2>
                    <div className="min-w-[100px]">
                        <Select onValueChange={(value) => setSelectedTable(value)}>
                            <SelectTrigger className="w-full h-[40px]">
                                <SelectValue placeholder="Show" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="latestOrders">Latest Orders</SelectItem>
                                <SelectItem value="topSellingProducts">Top Selling Products</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {loading && <TableSkeleton />}

                {!loading && data && (
                    selectedTable === 'latestOrders' ? (
                        <OrderListTable orders={data.latestOrders} />
                    ) : (
                        <ProductListTable products={productsList} actions={false}/>
                    )
                )}
            </div>
        </div>
    );
}

export default DashBoard;
