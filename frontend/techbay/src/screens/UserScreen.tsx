import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/User/Header";
import Footer from "../components/User/Footer";
import { useAppSelector } from "../hooks/useSelector";
import '../pages/User/User.css';
import { useEffect } from "react";
import { useTheme } from "../components/ui/ThemeProvider";
import ShopProvider from "../components/User/ShopProvider";

const UserScreen = () => {
    const user = useAppSelector((state) => state.auth.user);
    if (user?.isAdmin || user?.isStaff) {
        return <Navigate to='/admin' replace={true} />
    }

    const {setTheme} = useTheme();

    useEffect(() => {
        setTheme('light')
    })

    return (
        <ShopProvider>
            <div>
                <Header />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ShopProvider>
    );
}

export default UserScreen;
