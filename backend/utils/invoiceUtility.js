import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pdf from 'html-pdf-node';
import { formatPrice } from "./helpers/appHelpers.js";

const getBase64Image = async (filePath) => {
    try {
      const image = await fs.readFile(filePath);
      return `data:image/png;base64,${image.toString('base64')}`;
    } catch (error) {
      console.error('Error reading image file:', error);
      return '';
    }
  };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = async (order, res) => {
  // Get the base64 encoded logo image
  const logoPath = path.resolve(__dirname, "../uploads/logo/logo-black.png");
  const logoBase64 = await getBase64Image(logoPath);

  console.log(order);
  

  // Create the HTML content
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              width: 80%;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #f2f2f2;
              padding-bottom: 10px;
            }
            .header img {
              max-width: 150px;
            }
            .header h1 {
              font-size: 24px;
              margin: 0;
            }
            .order-details, .order-items, .order-summary {
              margin-bottom: 20px;
            }
            .order-details h2, .order-items h2, .order-summary h2 {
              font-size: 18px;
              border-bottom: 2px solid #f2f2f2;
              padding-bottom: 5px;
            }
            .order-details p, .order-summary p {
              margin: 5px 0;
              font-size: 14px;
            }
            .order-items table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            .order-items th, .order-items td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .order-items th {
              background-color: #f9f9f9;
              font-size: 14px;
              font-weight: bold;
            }
            .order-items td {
              font-size: 14px;
            }
            .order-items td img {
              width: 50px;
              height: auto;
              border-radius: 5px;
            }
            .order-summary .summary-item {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
            }
            .order-summary .summary-item strong {
              font-weight: bold;
            }
            .order-summary .total {
              font-size: 16px;
              font-weight: bold;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${logoBase64}" alt="Logo">
              <h1>Invoice</h1>
            </div>
  
            <div class="order-details">
              <h2>Order Details</h2>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(
                order.createdAt
              ).toLocaleDateString()}</p>
              <p><strong>Customer Name:</strong> ${order.address.fullName}</p>
              <p><strong>Email:</strong> ${order.user.email}</p>
              <p><strong>Phone:</strong> ${order.address.phone}</p>
              <p><strong>Address:</strong> ${order.address.addressLine1}, ${
    order.address.addressLine2 ? order.address.addressLine2 + ", " : ""
  }${order.address.city}, ${order.address.state}, ${order.address.zipCode}, ${
    order.address.country
  }</p>
            </div>
  
            <div class="order-items">
              <h2>Items Purchased</h2>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Image</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.orderedItems
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td><img src="http://localhost:5000${item.thumbnail}" alt="${item.name}"></td>
                      <td>${item.quantity}</td>
                      <td>${formatPrice(item.price)}</td>
                      <td>${formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
  
            <div class="order-summary">
              <h2>Order Summary</h2>
              <div class="summary-item">
                <p>Subtotal:</p>
                <p>${formatPrice(order.orderedAmount.subtotal)}</p>
              </div>
              <div class="summary-item">
                <p>Discount:</p>
                <p>${formatPrice(order.orderedAmount.discount)}</p>
              </div>
              <div class="summary-item">
                <p>Shipping:</p>
                <p>Free</p> <!-- Adjust if you have shipping fees -->
              </div>
              <div class="summary-item total">
                <p>Total:</p>
                <p>${formatPrice(order.orderedAmount.total)}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

  // Generate PDF options
  let options = { format: "A4", margin: { top: "20mm", bottom: "20mm" } };

  try {
    // Generate the PDF buffer
    const pdfBuffer = await pdf.generatePdf({ content: htmlContent }, options);

    // Send the PDF as a response
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order.orderNumber}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Error generating PDF");
  }
};
