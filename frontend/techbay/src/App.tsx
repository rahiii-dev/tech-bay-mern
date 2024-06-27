import { Navigate, Route, Routes } from "react-router-dom"
import UserScreen from "./screens/UserScreen"
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import AdminScreen from "./screens/AdminScreen"
import DashBoard from "./pages/Admin/DashBoard"
import HomePage from "./pages/User/HomePage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

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
