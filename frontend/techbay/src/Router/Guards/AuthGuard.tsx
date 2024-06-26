import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthGuard = () => {
    const user = true;
    // const user = useSelector(state => state.auth.user);
    const location = useLocation();
  
    return user ? <Outlet /> : <Navigate to='/login' state={{from : location.pathname}}/>;
}

export default AuthGuard;
