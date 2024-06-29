import { AlignJustify, Home, Layers3, LogOut, Package, PackagePlus, UsersRound } from 'lucide-react';
import { LOGO_IMAGE } from "../../utils/constants";
import { NavLink } from "react-router-dom";
import Logout from "../../components/auth/Logout";

const Sidebar = () => {
    return (
        <aside className="bg-primary-foreground w-full max-w-[260px] h-full">
            <div className="sidebar-header flex justify-between items-center px-3 py-2">
                <div className="h-7">
                    <img className="h-full w-auto" src={LOGO_IMAGE} alt="logo" />
                </div>
                <button className="text-gray-400"><AlignJustify strokeWidth={1.5} /></button>
            </div>

            <div className="nav-container custom-scrollbar h-full w-full overflow-y-scroll overflow-x-hidden">
                <div className="px-3 pt-3 flex flex-col gap-2">
                    <NavLink to={'dashboard'} className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                        <Home size={20} /> <span className="font-medium">Dashboard</span>
                    </NavLink>
                    <NavLink to={'customers'} className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                        <UsersRound size={20} /> <span className="font-medium">Customers</span>
                    </NavLink>
                    <NavLink to={'categories'} className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                        <Layers3 size={20} /> <span className="font-medium">Categories</span>
                    </NavLink>
                </div>
                <div className="px-3 pt-3 flex flex-col gap-2">
                    <h1 className="font-medium text-gray-400">Products</h1>
                    <NavLink to={'products'} className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                        <Package size={20} /> <span className="font-medium">Product List</span>
                    </NavLink>
                    <NavLink to={'products/add'} className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                        <PackagePlus size={20} /> <span className="font-medium">Add Product</span>
                    </NavLink>
                </div>
                <div className="px-3 py-3 flex flex-col gap-2">
                    <h1 className="font-medium text-gray-400">Admin</h1>
                    <div className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                        <Logout className="navlink bg-transparent">
                            <LogOut size={20} /> <span className="font-medium">Logout</span>
                        </Logout>
                    </div>
                </div>
            </div>

        </aside>
    );
}

export default Sidebar;
