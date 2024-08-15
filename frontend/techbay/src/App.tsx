import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { setupInterceptor } from "./utils/axios";
import { Toaster } from "./components/ui/toaster";
import { useAppDispatch } from "./hooks/useDispatch";
import { logoutAsync } from "./features/auth/authThunk";
import { clearCart } from "./features/cart/cartSlice";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import PageLoader from "./components/ui/PageLoader";

// Lazy loaded components
const UserScreen = lazy(() => import("./screens/UserScreen"));
const AdminScreen = lazy(() => import("./screens/AdminScreen"));
const DashBoard = lazy(() => import("./pages/Admin/DashBoard"));
const HomePage = lazy(() => import("./pages/User/HomePage"));
const AuthScreen = lazy(() => import("./screens/AuthScreen"));
const LoginForm = lazy(() => import("./components/auth/LoginForm"));
const RegisterForm = lazy(() => import("./components/auth/RegisterForm"));
const Category = lazy(() => import("./pages/Admin/Category"));
const Customers = lazy(() => import("./pages/Admin/Customers"));
const ProfilePage = lazy(() => import("./pages/User/ProfilePage"));
const OtpForm = lazy(() => import("./components/auth/OtpForm"));
const Brands = lazy(() => import("./pages/Admin/Brands"));
const ProductList = lazy(() => import("./pages/Admin/ProductList"));
const ProductEdit = lazy(() => import("./pages/Admin/productEdit"));
const ProductAdd = lazy(() => import("./pages/Admin/ProductAdd"));
const ShopPage = lazy(() => import("./pages/User/ShopPage"));
const ProductDetails = lazy(() => import("./pages/User/ProductDetails"));
const CartPage = lazy(() => import("./pages/User/CartPage"));
const UserScreenProtected = lazy(() => import("./screens/UserScreenProtected"));
const CheckoutPage = lazy(() => import("./pages/User/CheckoutPage"));
const PaymentPage = lazy(() => import("./pages/User/PaymentPage"));
const OrderConfirmation = lazy(() => import("./pages/User/OrderConfirmation"));
const OrdersPage = lazy(() => import("./pages/User/OrdersPage"));
const OrdersList = lazy(() => import("./pages/Admin/OrdersList"));
const OrderView = lazy(() => import("./pages/Admin/OrderView"));
const OrderReturnList = lazy(() => import("./pages/Admin/OrderReturnList"));
const WalletHistoryPage = lazy(() => import("./pages/User/WalletHistoryPage"));
const WishListPage = lazy(() => import("./pages/User/WishListPage"));
const CouponsPage = lazy(() => import("./pages/Admin/CouponsPage"));
const SalesReportPage = lazy(() => import("./pages/Admin/SalesReportPage"));

function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const CustomNavigate = (url: string, ShouldLogout = false) => {
    if (ShouldLogout) {
      dispatch(logoutAsync()).then((resultAction) => {
        if (logoutAsync.fulfilled.match(resultAction)) {
          dispatch(clearCart());
          navigate("/login", { replace: true });
        }
        return;
      });
    } else if (url) {
      navigate(url, { replace: true });
    }
  };

  setupInterceptor(CustomNavigate);

  return (
    <ThemeProvider defaultTheme="light" storageKey="techbay-theme">
      <Suspense fallback={<PageLoader/>}>
        <Routes>
          <Route element={<AuthScreen />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/otp-validate" element={<OtpForm />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<UserScreen />}>
            <Route index element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route element={<UserScreenProtected />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishListPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/order-confirm" element={<OrderConfirmation />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/wallet-history" element={<WalletHistoryPage />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminScreen />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="/admin/dashboard" element={<DashBoard />} />
            <Route path="/admin/orders" element={<OrdersList />} />
            <Route path="/admin/order" element={<OrderView />} />
            <Route path="/admin/return-orders" element={<OrderReturnList />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/categories" element={<Category />} />
            <Route path="/admin/brands" element={<Brands />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/product/add" element={<ProductAdd />} />
            <Route path="/admin/product/edit" element={<ProductEdit />} />
            <Route path="/admin/coupons" element={<CouponsPage />} />
            <Route path="/admin/sales-report" element={<SalesReportPage />} />
          </Route>

          {/* Catch-all invalid paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
