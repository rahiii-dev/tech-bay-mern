import { OrderList } from "./orderTypes";

export interface SalesReport {
    totalSales: number;
    numberOfOrders: number;
    totalItemsSold: number;
    averageOrderValue: number;
    totalDiscount: number;
    couponApplied: number;
}

export interface SalesReportResponse {
    ordersInRange : OrderList;
    salesReport: SalesReport;
}