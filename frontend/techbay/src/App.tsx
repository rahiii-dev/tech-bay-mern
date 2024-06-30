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
import { useToast } from "./components/ui/use-toast"
import { Toaster } from "./components/ui/toaster"
import { useAppDispatch } from "./hooks/useDispatch"
import { logout } from './features/auth/authSlice';


function App() {
  const {toast} = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const CustomNavigate = (url:string, ShoudLogout=false) => {
    if(ShoudLogout){
      dispatch(logout())
    }
    navigate('/login', {replace: true})
  }
  setupInterceptor(toast, CustomNavigate)    

  return (
    <>
      <Routes>
        <Route element={<AuthScreen/>}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<UserScreen />}>
          <Route index element={<HomePage />} />
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
    </>

  );
}



export default App
