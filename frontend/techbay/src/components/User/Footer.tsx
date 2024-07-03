import { Link } from "react-router-dom";
import { LOGO_BLACK, LOGO_WHITE } from "../../utils/constants";
import { useTheme } from "../ui/ThemeProvider";

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer className="bg-gray-200 w-screen overflow-hidden">
            <div className="container py-16">
                <div className="sm:flex gap-8 pb-6">
                    <div className="text-center w-full sm:w-auto sm:text-left">
                        <div className="wid-full max-w-[120px] mb-2 mx-auto sm:mx-0">
                            <img className="w-full h-auto object-contain" src={theme === 'light' ? LOGO_BLACK : LOGO_WHITE} alt="logo" />
                        </div>
                        <p className="text-sm mb-3 max-w-[400px] sm:max-w-[250px]">Empower Your Electronics Experience. Plug into the future of electronics shopping with AmpCart today.</p>
                    </div>

                    <div className="flex-grow w-full flex justify-between">
                        <div className="h-full flex flex-col gap-3">
                            <h1 className="uppercase font-medium">Company</h1>
                            <Link to={'shop'} className="block text-sm hover:font-bold transition-all duration-300">Shop</Link>
                            <Link to={'about'} className="block text-sm hover:font-bold transition-all duration-300">About</Link>
                            <Link to={'contact'} className="block text-sm hover:font-bold transition-all duration-300">Contact</Link>
                        </div>
                        <div className="h-full flex flex-col gap-3">
                            <h1 className="uppercase font-medium">Help</h1>
                            <a href="#" className="block text-sm hover:font-bold transition-all duration-300">Customer Support</a>
                            <a href="#" className="block text-sm hover:font-bold transition-all duration-300">Delivery Details</a>
                            <a href="#" className="block text-sm hover:font-bold transition-all duration-300">Terms & Conditions</a>
                            <a href="#" className="block text-sm hover:font-bold transition-all duration-300">Privacy Policy</a>
                        </div>
                        <div className="h-full flex flex-col gap-3">
                            <h1 className="uppercase font-medium">FAQ</h1>
                            <a href="#" className="block text-sm hover:font-bold transition-all duration-300">Account</a>
                            <a href="#" className="block text-sm hover:font-bold transition-all duration-300">Manage Deliveries</a>
                            <a href="#" className="block text-sm hover:font-bold transition-all duration-300">Orders</a>
                            <a href="#" className="block text-sm hover:font-bold transition-all duration-300">Payments</a>
                        </div>
                    </div>

                </div>
                <hr className="bg-gray-300 h-[1px]"/>
                <div className="pt-4 text-center">
                    <p>TechBay ©2024, All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
