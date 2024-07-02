import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useDispatch";
import axios from "../../utils/axios";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { setCredential } from "../../features/auth/authSlice";
import { User } from "../../features/auth/authTypes";
import { useState } from "react";
import { BACKEND_RESPONSE } from "../../utils/types";
import { toast } from "../ui/use-toast";

interface AuthResult {
  code?: string;
  error?: string;
}

const GoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const responseGoogle = async (authResult: AuthResult) => {
    setLoading(true);
    if (authResult.error) {
      toast({
        variant: "destructive",
        title: `${authResult.error.toUpperCase()}`,
        className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
      });
      setLoading(false);
      return;
    }

    try {
      if (authResult.code) {
        const response = await axios.get<BACKEND_RESPONSE<User>>(`/auth/google?code=${authResult.code}`);
        const result = response.data.data;

        dispatch(setCredential(result));

        if (result?.isAdmin || result?.isStaff) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
    }
    finally {
      setLoading(false)
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <Button type="button" variant="outline" className="w-full" onClick={googleLogin} disabled={loading}>
      <img src="/google-icon.png" className="w-5 aspect-square" alt="google-icon" />
      <span className="ms-2">Continue with Google</span>
    </Button>
  );
}

export default GoogleLogin;
