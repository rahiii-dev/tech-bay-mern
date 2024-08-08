import asyncHandler from "express-async-handler";
import {generateExcel, generatePDF, generateSalesReport } from "../utils/salesReportUtils.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";


/*  
    Route: GET api/admin/salesreport
    Purpose: show sales report
    filter: all, custom, day, week, month
*/
export const getSalesReport = asyncHandler(async (req, res) => {
  const {page = 1, limit = 10, filter = 'all', startDate, endDate } = req.query;

  try {
    const report = await generateSalesReport(filter, startDate, endDate, page, limit);
    res.json(report);
  } catch (error) {
    throw new Error(error.message);
  }
});

/*  
    Route: GET api/admin/sales-report/download
    Purpose: download sales report in pdf or excel format
*/
export const downloadSalesReport = asyncHandler(async (req, res) => {
  const { filter = 'all', startDate, endDate, type = "pdf" } = req.query;

  const allowedTypes = ["pdf" , "excel"];

  if(!allowedTypes.includes(type)){
    return handleErrorResponse(res, 400, "Only PDF and Excel type is available")
  }

  try {
    const report = await generateSalesReport(filter, startDate, endDate, 1, 100);
    if (type === "pdf") {
      await generatePDF(report.salesReport, report.ordersInRange.orders, res);
    } else if (type === "excel") {
      await generateExcel(report.salesReport, report.ordersInRange.orders, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error(error.message);
  }
});