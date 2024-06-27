import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/User/Header";
import Footer from "../components/User/Footer";
import { useAppSelector } from "../hooks/useSelector";

const UserScreen = () => {
    const user = useAppSelector((state) => state.auth.user);
    if(user?.isAdmin || user?.isStaff){
        return <Navigate to='/admin' replace={true}/>
    }
    
    return (
        <div>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    );
}

export default UserScreen;
