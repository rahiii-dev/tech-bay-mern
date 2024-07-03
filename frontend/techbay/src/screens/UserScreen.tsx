import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/User/Header";
import Footer from "../components/User/Footer";
import { useAppSelector } from "../hooks/useSelector";
import '../pages/User/User.css';

const UserScreen = () => {
    const user = useAppSelector((state) => state.auth.user);
    if (user?.isAdmin || user?.isStaff) {
        return <Navigate to='/admin' replace={true} />
    }

    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default UserScreen;
