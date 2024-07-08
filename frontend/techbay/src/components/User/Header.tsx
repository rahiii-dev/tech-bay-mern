import { Link, NavLink } from "react-router-dom";
import Logout from "../auth/Logout";
import { useTheme } from "../ui/ThemeProvider";
import { LOGO_BLACK, LOGO_WHITE } from "../../utils/constants";
import { Input } from "../ui/input";
import { AlignJustify, Heart, LogOut, Search, ShoppingCart, User } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useAppSelector } from "../../hooks/useSelector";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

const Header = () => {
    const user = useAppSelector((state) => state.auth.user);
    const { theme } = useTheme();

    return (
        <>
            <header className="user-header w-screen">
                <div className="container py-3 flex items-center gap-3">
                    <Link to={'/'} className="min-w-[80px] sm:min-w-[100px]">
                        <img className="w-full h-auto object-contain" src={theme === 'light' ? LOGO_BLACK : LOGO_WHITE} alt="logo" />
                    </Link>

                    <nav className="h-full hidden sm:flex transition-all duration-300">
                        <NavLink to={'shop'} className="navlink px-2 block text-sm font-medium hover:font-bold">Shop</NavLink>
                        <NavLink to={'about'} className="navlink px-2 block text-sm font-medium hover:font-bold">About</NavLink>
                        <NavLink to={'contact'} className="navlink px-2 block text-sm font-medium hover:font-bold">Contact</NavLink>
                    </nav>

                    <div className="flex-grow flex justify-end sm:justify-between items-center">
                        <div className="hidden sm:block bg-secondary flex-grow max-w-[500px] relative rounded-full overflow-hidden">
                            <button className="bg-transparent absolute top-[50%] translate-y-[-50%] px-2 z-10 h-full"><Search className="text-gray-400" size={20} /></button>
                            <Input className="bg-inherit rounded-full ps-[40px] border-none" placeholder="Search for products...." />
                        </div>

                        <nav className="h-full flex items-center gap-2">
                            <NavLink to={'wishlist'} className="navlink px-2 block text-sm text-gray-400 hover:text-primary transition-colors duration-200"><Heart /></NavLink>
                            <NavLink to={'cart'} className="navlink px-2 block text-sm text-gray-400 hover:text-primary transition-colors duration-200"><ShoppingCart /></NavLink>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="border-none focus:text-primary focus:outline-none text-gray-400 duration-300 hover:text-primary"><User /></DropdownMenuTrigger>
                                    <DropdownMenuContent className="shadow-lg mt-3 w-[130px] bg-background">
                                        {user ? (
                                            <>
                                                <DropdownMenuItem className="hover:bg-secondary">
                                                    <Link className="w-full h-full" to={'/profile'}>My Profile</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="hover:bg-secondary">
                                                    <Logout className="w-full bg-inherit text-inherit hover:text-secondary-foreground hover:bg-secondary">
                                                        <LogOut size={20} /> <span className="font-medium ms-2">Logout</span>
                                                    </Logout>
                                                </DropdownMenuItem>
                                            </>
                                        ) : (
                                            <>
                                                <DropdownMenuItem className="hover:bg-secondary">
                                                    <Link className="w-full h-full" to={'/login'}>Sign In</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="hover:bg-secondary">
                                                    <Link className="w-full h-full" to={'/register'}>Sign Up</Link>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                         
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="px-2 block sm:hidden text-sm text-gray-400 hover:text-primary transition-colors duration-200 rounded-full">
                                        <AlignJustify strokeWidth={1.5} />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-full max-w-64">
                                    <SheetHeader>
                                        <SheetTitle>Menu</SheetTitle>
                                    </SheetHeader>
                                    <nav className="flex flex-col gap-2">
                                        <NavLink to={'shop'} className="navlink px-2 block text-sm font-medium hover:font-bold">Shop</NavLink>
                                        <NavLink to={'about'} className="navlink px-2 block text-sm font-medium hover:font-bold">About</NavLink>
                                        <NavLink to={'contact'} className="navlink px-2 block text-sm font-medium hover:font-bold">Contact</NavLink>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
