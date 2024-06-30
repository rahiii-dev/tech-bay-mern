import { Link } from "react-router-dom";
import Logout from "../auth/Logout";

const Header = () => {
   

    return (
        <header>
            <h1>Header</h1>
            <Logout/>
            <Link to='/profile' className="p-2 bg-foreground text-background">Profile</Link>
        </header>
    );
}

export default Header;
