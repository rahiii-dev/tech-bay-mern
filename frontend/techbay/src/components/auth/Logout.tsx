import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useDispatch';
import { Button } from '../ui/button';
import { logoutAsync } from '../../features/auth/authThunk';
import { toast } from '../ui/use-toast';

type LogoutProps = {
    className?: string,
    children?: React.ReactNode | string
}
const Logout = ({className, children = 'Logout'}: LogoutProps) => {
    const navigate = useNavigate();
    const dipatch = useAppDispatch();

    async function handleLogout() {
        await dipatch(logoutAsync())
        navigate('/login', {replace: true})
        toast({
            variant: "default",
            title:'Logged out successfully',
            className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
        });
    }

    return (
        <Button className={className} onClick={handleLogout}>{children}</Button>
    );
}

export default Logout;
