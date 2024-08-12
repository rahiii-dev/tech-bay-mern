import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useSelector";
import { toast } from "../components/ui/use-toast";
import { useEffect } from "react";
import PageLoader from "../components/ui/PageLoader";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const UserScreenProtected = () => {
    const { user } = useAppSelector((state) => state.auth);

    const navigate = useNavigate();

    const initialOptions = {
        "clientId": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        "enable-funding": "venmo",
        "disable-funding": "",
        "data-page-type": "product-details",
        components: "buttons",
        "data-sdk-integration-source": "developer-studio",
    };

    useEffect(() => {
        if (!user) {
            toast({
                variant: "destructive",
                title: `You are not LoggedIn`,
                description: "Please login to continue",
                className: "bg-red-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
            return navigate(-1)
        }
    }, [user]);

    if (!user) {
        return <PageLoader/>
    }

    return (
        <PayPalScriptProvider options={initialOptions}>
            <Outlet />
        </PayPalScriptProvider>
    );
}

export default UserScreenProtected;
