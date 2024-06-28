import { Navigate, Route, Routes } from "react-router-dom"
import UserScreen from "./screens/UserScreen"
import AdminScreen from "./screens/AdminScreen"
import DashBoard from "./pages/Admin/DashBoard"
import HomePage from "./pages/User/HomePage"
import AuthScreen from "./screens/AuthScreen"
import LoginForm from "./components/auth/LoginForm"
import RegisterForm from "./components/auth/RegisterForm"

function App() {
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
        </Route>

        {/* Catch-all invalid paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}



export default App
