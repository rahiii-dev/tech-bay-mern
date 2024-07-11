import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useSelector";
import { toast } from "../components/ui/use-toast";
import { useEffect } from "react";
import PageLoader from "../components/ui/PageLoader";

const UserScreenProtected = () => {
    const { user } = useAppSelector((state) => state.auth);

    const navigate = useNavigate();

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
        <Outlet />
    );
}

export default UserScreenProtected;
