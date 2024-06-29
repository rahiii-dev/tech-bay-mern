import {Navigate, Outlet, useLocation} from "react-router-dom";
import { useAppSelector } from "../hooks/useSelector";
import AdminLayout from "../pages/Admin/AdminLayout";

const AdminScreen = () => {
    const user = useAppSelector(state => state.auth.user);

    const location = useLocation()
    
    if(!user){
        return <Navigate to='/login' replace={true} state={{from: location.pathname}}/>
    }
    if(!user?.isAdmin){
        return <Navigate to='/'/>
    }
    return (
        <AdminLayout>
            <Outlet/>
        </AdminLayout>
    );
}

export default AdminScreen;
