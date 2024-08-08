import Order from "../models/Order.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pdf from 'html-pdf-node';
import { formatPrice } from "./helpers/appHelpers.js";
import ExcelJS from 'exceljs';


export const generateSalesReport = async (
  filterType,
  startDate,
  endDate,
  page = 1,
  limit = 10,
  pagination=true,
) => {
  const matchCriteria = {
    status: { $in: ["Delivered", "Shipped", "Processing"] },
  };

  if (filterType === "custom") {
    matchCriteria.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  } else {
    const currentDate = new Date();
    switch (filterType) {
      case "day":
        matchCriteria.createdAt = {
          $gte: new Date(currentDate.setDate(currentDate.getDate())),
        };
        break;
      case "week":
        matchCriteria.createdAt = {
          $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)),
        };
        break;
      case "month":
        matchCriteria.createdAt = {
          $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
        };
        break;
      case "year":
        matchCriteria.createdAt = {
          $gte: new Date(
            currentDate.setFullYear(currentDate.getFullYear() - 1)
          ),
        };
        break;
      default:
        break;
    }
  }

  const salesReport = await Order.aggregate([
    {
      $match: matchCriteria,
    },
    {
      $unwind: "$orderedItems",
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$orderedAmount.total" },
        numberOfOrders: { $sum: 1 },
        totalItemsSold: { $sum: "$orderedItems.quantity" },
        averageOrderValue: { $avg: "$orderedAmount.total" },
        totalDiscount: { $sum: "$orderedAmount.discount" },
        couponApplied: {
          $sum: { $cond: [{ $ifNull: ["$coupon.couponId", false] }, 1, 0] },
        },
      },
    },
  ]);

  const fetchOptions = {
    populate: [
      {
        path: "user",
        select: "email fullName",
      },
      {
        path: "transaction",
        select: "paymentMethod transactionNumber",
      },
    ],
    sort: { createdAt: -1 },
  };

  let ordersInRange;

  if (pagination) {
    const myCustomLabels = {
      totalDocs: "totalOrders",
      docs: "orders",
    };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      customLabels: myCustomLabels,
      ...fetchOptions,
    };

    ordersInRange = await Order.paginate(matchCriteria, options);
  } else {
    // Fetch all orders without pagination
    ordersInRange = await Order.find(matchCriteria)
      .populate(fetchOptions.populate)
      .sort(fetchOptions.sort);
  }

  return {
    salesReport: salesReport[0] || {
      totalSales: 0,
      numberOfOrders: 0,
      totalItemsSold: 0,
      averageOrderValue: 0,
      totalDiscount: 0,
      couponApplied: 0,
    },
    ordersInRange,
  };
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getBase64Image = async (filePath) => {
  try {
    const image = await fs.readFile(filePath);
    return `data:image/png;base64,${image.toString('base64')}`;
  } catch (error) {
    console.error('Error reading image file:', error);
    return '';
  }
};

export const generatePDF = async (salesReport, ordersInRange, res) => {
  // Get the base64 encoded logo image
  const logoPath = path.resolve(__dirname, '../uploads/logo/logo-black.png');
  const logoBase64 = await getBase64Image(logoPath);

  // Create the HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sales Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            text-align: center;
          }
          .summary-data {
            display: flex;
          }
          .summary-data > div {
            width: 100%;
          }
          .summary, .orders {
            margin-bottom: 20px;
          }
          .orders table {
            width: 100%;
            border-collapse: collapse;
          }
          .orders th, .orders td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          .orders th {
            background-color: #f2f2f2;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <img src="${logoBase64}" alt="Logo" width="100">
        <h1>Sales Report</h1>
        <div class="summary">
          <h2>Summary</h2>
          <div class="summary-data">
            <div>
              <p>Total Sales: ${formatPrice(salesReport.totalSales)}</p>
              <p>Number of Orders: ${salesReport.numberOfOrders}</p>
              <p>Total Items Sold: ${salesReport.totalItemsSold}</p>
            </div>
            <div>
              <p>Average Order Value: ${formatPrice(salesReport.averageOrderValue)}</p>
              <p>Total Discount: <span style="color: red">-${formatPrice(salesReport.totalDiscount)}</span></p>
              <p>Coupon Applied: ${salesReport.couponApplied}</p>
            </div>
          </div>
        </div>
        <div class="orders">
          <h2>Order Details</h2>
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Transaction</th>
                <th>User</th>
                <th>Total</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              ${ordersInRange.map(order => `
                <tr>
                  <td>${order.orderNumber}</td>
                  <td>${order.transaction.transactionNumber}</td>
                  <td>${order.user.email} (${order.user.fullName})</td>
                  <td>${formatPrice(order.orderedAmount.total)}</td>
                  <td>${order.transaction.paymentMethod}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;

  // Generate PDF options
  let options = { format: 'A4' };

  try {
    // Generate the PDF buffer
    const pdfBuffer = await pdf.generatePdf({ content: htmlContent }, options);
    
    // Send the PDF as a response
    res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Error generating PDF')
  }
};

export const generateExcel = async (salesReport, ordersInRange, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  // Add summary data
  worksheet.addRow(['Total Sales:', formatPrice(salesReport.totalSales)]);
  worksheet.addRow(['Number of Orders:', salesReport.numberOfOrders]);
  worksheet.addRow(['Total Items Sold:', salesReport.totalItemsSold]);
  worksheet.addRow(['Average Order Value:', formatPrice(salesReport.averageOrderValue)]);
  worksheet.addRow(['Total Discount:', `-${formatPrice(salesReport.totalDiscount)}`]);
  worksheet.addRow(['Coupon Applied:', salesReport.couponApplied]);
  worksheet.addRow([]); // Empty row for spacing

  // Add table headers
  worksheet.addRow(['Order Number', 'Transaction', 'User', 'Total', 'Payment Method']);

  // Add table rows
  ordersInRange.forEach(order => {
    worksheet.addRow([
      order.orderNumber,
      order.transaction.transactionNumber,
      `${order.user.email} (${order.user.fullName})`,
      formatPrice(order.orderedAmount.total),
      order.transaction.paymentMethod,
    ]);
  });

  // Set the response headers
  res.setHeader('Content-Disposition', 'attachment; filename=sales_report.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  // Write the workbook to a buffer and send it
  const buffer = await workbook.xlsx.writeBuffer();
  res.send(buffer);
};
