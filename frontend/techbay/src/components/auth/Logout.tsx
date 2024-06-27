import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useDispatch';
import { logout } from '../../features/auth/authSlice';
import { Button } from '../ui/button';

const Logout = () => {
    const navigate = useNavigate();
    const dipatch = useAppDispatch();

    function handleLogout() {
        dipatch(logout())
        navigate('/login', {replace: true})
    }

    return (
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
    );
}

export default Logout;
