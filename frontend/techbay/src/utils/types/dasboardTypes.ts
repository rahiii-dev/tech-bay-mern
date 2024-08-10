import { Order } from "./orderTypes";
import { Product } from "./productTypes";

interface DailyDataId {
    year: number;
    month: number;
    day: number;
  }
  
  interface DailyDataEntry {
    _id: DailyDataId;
    total: number;
    percentageChange: string; 
  }
  
  export interface SummarizedData {
    dailyData: DailyDataEntry[];
    total: number;
    percentageChange: number; 
  }
  
  
  
  // Interface for top selling products
  interface TopSellingProduct {
    _id: string; // Product ID
    totalQuantity: number;
    totalSales: number;
    productDetails: Product
  }
  
  export interface DashboardResponse {
    ordersData: SummarizedData;
    profitData: SummarizedData;
    salesData: SummarizedData;
    customersData: SummarizedData;
    latestOrders: Order[];
    topSellingProducts: TopSellingProduct[];
  }
  