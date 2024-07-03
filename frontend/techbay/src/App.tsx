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


function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const CustomNavigate = (url='', ShoudLogout=false) => {
    if(ShoudLogout){
      dispatch(logoutAsync())
    }
    if(url){
      navigate(url, {replace: true})
    }
  }

  setupInterceptor(CustomNavigate)    

  return (
    <ThemeProvider defaultTheme="light">
      <Routes>
        <Route element={<AuthScreen/>}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/otp-validate" element={<OtpForm />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<UserScreen />}>
          <Route index element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>


        {/* Admin Routes (requires admin authorization) */}
        <Route path="/admin" element={<AdminScreen />}>
          <Route index element={<Navigate to='dashboard' />} />
          <Route path="/admin/dashboard" element={<DashBoard />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/categories" element={<Category />} />
        </Route>

        {/* Catch-all invalid paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster/>
    </ThemeProvider>
  );
}



export default App
