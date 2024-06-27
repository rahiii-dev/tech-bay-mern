import {Navigate, Outlet, useLocation} from "react-router-dom";
import { useAppSelector } from "../hooks/useSelector";
import Logout from "../components/auth/Logout";

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
        <>
            <h1>Header</h1>
            <Logout/>
            <Outlet/>
        </>
    );
}

export default AdminScreen;
