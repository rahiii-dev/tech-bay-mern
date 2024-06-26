import { Outlet } from "react-router-dom";
import Header from "../components/User/Header";
import Footer from "../components/User/Footer";

const UserPage = () => {
    
    return (
        <div>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    );
}

export default UserPage;
