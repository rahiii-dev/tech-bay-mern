import {Outlet} from "react-router-dom";

const AdminScreen = () => {
    console.log("Admin Srceen");
    
    return (
        <>
            <h1>Header</h1>
            <Outlet/>
        </>
    );
}

export default AdminScreen;
