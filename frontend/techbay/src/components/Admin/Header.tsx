import { Link, useLocation } from "react-router-dom";
import ThemeToggler from "../ui/ThemeToggler";

const ADMIN_URL_MAP = new Map([
    ['/admin/dashboard', 'Dashboard'],
    ['/admin/customers', 'Customers'],
    ['/admin/categories', 'Categories'],
]);

const Header = () => {
    const location = useLocation();
    const pageTitle = ADMIN_URL_MAP.get(location.pathname) || 'Admin';



    return (
        <header className="flex justify-between items-center py-2">
            <h1 className="text-primary font-bold text-xl">{pageTitle}</h1>
            <div className="flex items-center gap-4">
                <ThemeToggler/>
                <Link to={'profile'} className="size-8 rounded-full bg-primary text-primary-foreground flex justify-center items-center">A</Link>
            </div>
        </header>
    );
}

export default Header;
