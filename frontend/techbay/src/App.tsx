import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import UserScreen from "./screens/UserScreen"
import AdminScreen from "./screens/AdminScreen"
import DashBoard from "./pages/Admin/DashBoard"
import HomePage from "./pages/User/HomePage"
import AuthScreen from "./screens/AuthScreen"
import LoginForm from "./components/auth/LoginForm"
import RegisterForm from "./components/auth/RegisterForm"
import Category from "./pages/Admin/Category"
import Customers from "./pages/Admin/Customers"
import { setupInterceptor } from "./utils/axios"
import { Toaster } from "./components/ui/toaster"
import { useAppDispatch } from "./hooks/useDispatch"
import ProfilePage from "./pages/User/ProfilePage"
import OtpForm from "./components/auth/OtpForm"
import { logoutAsync } from "./features/auth/authThunk"
import { ThemeProvider } from "./components/ui/ThemeProvider"
import Brands from "./pages/Admin/Brands"
import ProductList from "./pages/Admin/ProductList"
import ProductEdit from "./pages/Admin/productEdit"
import ProductAdd from "./pages/Admin/ProductAdd"
import ShopPage from "./pages/User/ShopPage"
import ProductDetails from "./pages/User/ProductDetails"
import CartPage from "./pages/User/CartPage"
import UserScreenProtected from "./screens/UserScreenProtected"
import CheckoutPage from "./pages/User/CheckoutPage"
import PaymentPage from "./pages/User/PaymentPage"
import OrderConfirmation from "./pages/User/OrderConfirmation"
import OrdersPage from "./pages/User/OrdersPage"
import { clearCart } from "./features/cart/cartSlice"
import OrdersList from "./pages/Admin/OrdersList"
import OrderView from "./pages/Admin/OrderView"


function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const CustomNavigate = (url:string, ShoudLogout=false) => {
    if(ShoudLogout){
      dispatch(logoutAsync())
      .then((resultAction) => {
        if(logoutAsync.fulfilled.match(resultAction)){
            dispatch(clearCart())
            navigate('/login', {replace: true})
        }
        return
    })
    } else if(url){
      navigate(url, {replace: true})
    }
  }

  setupInterceptor(CustomNavigate)    

  return (
    <ThemeProvider defaultTheme="light" storageKey="techbay-theme">
      <Routes>
        <Route element={<AuthScreen/>}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/otp-validate" element={<OtpForm />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<UserScreen />}>
          <Route index element={<HomePage />} />
          <Route path="/shop" element={<ShopPage/>}/>
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route element={<UserScreenProtected/>}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order-confirm" element={<OrderConfirmation />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>
        </Route>


        {/* Admin Routes (requires admin authorization) */}
        <Route path="/admin" element={<AdminScreen />}>
          <Route index element={<Navigate to='dashboard' />} />
          <Route path="/admin/dashboard" element={<DashBoard />} />
          <Route path="/admin/orders" element={<OrdersList />} />
          <Route path="/admin/order" element={<OrderView />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/categories" element={<Category />} />
          <Route path="/admin/brands" element={<Brands />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product/add" element={<ProductAdd />} />
          <Route path="/admin/product/edit" element={<ProductEdit />} />
        </Route>

        {/* Catch-all invalid paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster/>
    </ThemeProvider>
  );
}



export default App
