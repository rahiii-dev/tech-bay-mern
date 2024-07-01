import { createContext, useContext, useEffect, useState } from 'react';

interface AuthFormContextType {
    formData: any;
    setFormData: (data: any) => void;
    otpPageAccessible: boolean;
    setOtpPageAccessible: (accessible: boolean) => void;
}

const AuthFormContext = createContext<AuthFormContextType | null>(null);

export const AuthFormContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [formData, setFormData] = useState<any>(() => {
        const sessionFormData = sessionStorage.getItem('formData');
        return sessionFormData ? JSON.parse(sessionFormData) : null;
    });
    const [otpPageAccessible, setOtpPageAccessible] = useState<boolean>(() => {
        const sessionOtpAccessible = sessionStorage.getItem('otpPageAccessible');
        return sessionOtpAccessible ? JSON.parse(sessionOtpAccessible) : false;
    });

    useEffect(() => {
        sessionStorage.setItem('formData', JSON.stringify(formData));
        sessionStorage.setItem('otpPageAccessible', JSON.stringify(otpPageAccessible));
    }, [formData, otpPageAccessible]);

    useEffect(() => {
        return () => {
            console.log("Auth Provider unmounred");
            setOtpPageAccessible(false)
            sessionStorage.removeItem('formData');
            sessionStorage.removeItem('otpPageAccessible');
        };
    }, []);

    return (
        <AuthFormContext.Provider value={{ formData, setFormData, otpPageAccessible, setOtpPageAccessible }}>
            {children}
        </AuthFormContext.Provider>
    );
};

export const useAuthFormContext = () => {
    const context = useContext(AuthFormContext);
    if (!context) {
        throw new Error('useAuthFormContext must be used within an AuthFormContextProvider');
    }
    return context;
};
