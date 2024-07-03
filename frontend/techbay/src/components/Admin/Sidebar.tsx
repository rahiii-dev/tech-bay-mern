import { AlignJustify, Home, Layers3, LogOut, Package, PackagePlus, UsersRound } from 'lucide-react';
import { LOGO_BLACK, LOGO_WHITE } from "../../utils/constants";
import { NavLink } from "react-router-dom";
import Logout from "../../components/auth/Logout";
import { useTheme } from '../ui/ThemeProvider';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const Sidebar = () => {
    const [sidebarActive, setSidebarActive] = useState(() => {
        return localStorage.getItem('admin-sidebar') === '0' ? false: true; 
    });
    const { theme } = useTheme();

    const handleClick = () => {
        if(sidebarActive){
            localStorage.setItem('admin-sidebar', '0')
            setSidebarActive(false);
            return
        }

        localStorage.setItem('admin-sidebar', '1')
        setSidebarActive(true);
    }

    return (
        <aside id='sidebar' className={`bg-primary-foreground w-full h-full ${sidebarActive && 'active'}`}>
            <div className="sidebar-header flex items-center px-3 py-2">
                <div className="h-7">
                    <img className="h-full w-auto" src={theme === 'light' ? LOGO_BLACK : LOGO_WHITE} alt="logo" />
                </div>
                <button onClick={handleClick} className="p-2 text-gray-400 hover:text-primary dark:text-foreground  dark:hover:bg-gray-300 dark:hover:text-primary-foreground rounded-full"><AlignJustify strokeWidth={1.5} /></button>
            </div>

            <div className="nav-container custom-scrollbar h-full w-full overflow-y-scroll overflow-x-hidden">
                <div className="nav-section px-3 pt-3 flex flex-col gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink to={'dashboard'} className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                                    <Home size={20} /> <span className="font-medium">Dashboard</span>
                                </NavLink>
                            </TooltipTrigger>
                            {!sidebarActive && (
                                <TooltipContent side='right'>
                                    <p>Dashboard</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink to={'customers'} className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                                    <UsersRound size={20} /> <span className="font-medium">Customers</span>
                                </NavLink>
                            </TooltipTrigger>
                            {!sidebarActive && (
                                <TooltipContent side='right'>
                                    <p>Customers</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink to={'categories'} className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                                    <Layers3 size={20} /> <span className="font-medium">Categories</span>
                                </NavLink>
                            </TooltipTrigger>
                            {!sidebarActive && (
                                <TooltipContent side='right'>
                                    <p>Categories</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="nav-section px-3 pt-3 flex flex-col gap-2">
                    <h1 className="font-medium text-gray-400">Products</h1>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink to={'products'} className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                                    <Package size={20} /> <span className="font-medium">Product List</span>
                                </NavLink>
                            </TooltipTrigger>
                            {!sidebarActive && (
                                <TooltipContent side='right'>
                                    <p>Product List</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink to={'products/add'} className="navlink py-2 px-2 flex items-center gap-2 rounded-sm">
                                    <PackagePlus size={20} /> <span className="font-medium">Add Product</span>
                                </NavLink>
                            </TooltipTrigger>
                            {!sidebarActive && (
                                <TooltipContent side='right'>
                                    <p>Add Product</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="nav-section px-3 py-3 flex flex-col gap-2">
                    <h1 className="font-medium text-gray-400">Admin</h1>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={`navlink py-2 px-2 flex items-center gap-2 rounded-sm ${!sidebarActive && 'justify-center'}`}>
                                    <Logout className="navlink bg-transparent p-0">
                                        <LogOut size={20} /> <span className="font-medium ms-2">Logout</span>
                                    </Logout>
                                </div>
                            </TooltipTrigger>
                            {!sidebarActive && (
                                <TooltipContent side='right'>
                                    <p>Logout</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

        </aside>
    );
}

export default Sidebar;
