# TechBay

A comprehensive e-commerce application with an admin and user side, offering features like user management, product management, order tracking, payment integration, and more.

## Features

<details style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
  <summary style="font-size: 18px; font-weight: bold; cursor: pointer; padding: 5px; color: #2c3e50;">
    🚀 <strong>Admin Side Features</strong>
  </summary>
  <ul style="padding-left: 20px; line-height: 1.6; margin-top: 10px;">
    <li>Admin sign in</li>
    <li>User management (list users, block/unblock)</li>
    <li>Category management (add, edit, soft delete)</li>
    <li>Product management (add, edit, soft delete)</li>
    <li>Multiple images for products (minimum 3, cropped, resized before upload)</li>
    <li>Order management (list orders, change order status, cancel orders)</li>
    <li>Inventory/Stock management</li>
    <li>Offer module (product and category offers)</li>
    <li>Sales report (daily, weekly, yearly, custom date)</li>
    <li>Admin dashboard with charts (filter by yearly, monthly, etc.)</li>
    <li>Coupon management (create, delete)</li>
    <li>Best-selling products (top 10)</li>
  </ul>
</details>

<details style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
  <summary style="font-size: 18px; font-weight: bold; cursor: pointer; padding: 5px; color: #2c3e50;">
    🌟 <strong>User Side Features</strong>
  </summary>
  <ul style="padding-left: 20px; line-height: 1.6; margin-top: 10px;">
    <li>Home page</li>
    <li>User sign up & login with validation (OTP, Google, Facebook, etc.)</li>
    <li>Product listing and details (image zoom, ratings, price, stock, etc.)</li>
    <li>User profile management (details, addresses, orders, cancel orders)</li>
    <li>Cart management (add to cart, remove items, control quantity based on stock)</li>
    <li>Advanced search with sorting (popularity, price, ratings, etc.)</li>
    <li>Checkout page (multiple addresses, order with COD)</li>
    <li>Order management (history, status, cancellation, returns)</li>
    <li>Coupon management (apply, remove coupons)</li>
    <li>Wishlist management (add/remove products)</li>
    <li>Wallet for canceled orders</li>
    <li>Invoice download (PDF)</li>
    <li>Error handling for failed payments, retry option</li>
  </ul>
</details>


## Installation

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/rahiii-dev/tech-bay-mern.git
   cd tech-bay-mern
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up environment variables:
   Copy the contents of `.backend-env-example` to a new `.env` file and fill in the necessary values.

   ```bash
   cp backend/.backend-env-example backend/.env
   ```

4. Start the backend server:
   ```bash
   npm run dev-server
   ```

### Frontend

1. Navigate to the frontend folder and install dependencies:
   ```bash
   cd frontend/techbay
   npm install
   ```

2. Set up environment variables:
   Copy the contents of `.frontend-env-example` to a new `.env` file and fill in the necessary values.

   ```bash
   cp frontend/.frontend-env-example frontend/.env
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Ensure that you create the `.env` files for both the frontend and backend based on the provided examples.

- [Frontend `.frontend-env-example`](./frontend/frontend-env-example)
- [Backend `.backend-env-example`](./backend/backend-env-example)

Copy the content from the corresponding `.env-example` files and create `.env` files in the same directory, replacing the placeholder values with your actual credentials and configuration.

## License

This project is licensed under the MIT License.
