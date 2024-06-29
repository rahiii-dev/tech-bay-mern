import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useDispatch';
import { logout } from '../../features/auth/authSlice';
import { Button } from '../ui/button';

type LogoutProps = {
    className?: string,
    children?: React.ReactNode | string
}
const Logout = ({className, children = 'Logout'}: LogoutProps) => {
    const navigate = useNavigate();
    const dipatch = useAppDispatch();

    function handleLogout() {
        dipatch(logout())
        navigate('/login', {replace: true})
    }

    return (
        <Button className={className} onClick={handleLogout}>{children}</Button>
    );
}

export default Logout;
