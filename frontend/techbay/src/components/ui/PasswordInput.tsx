import React, { useState } from 'react';
import { Input, InputProps } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <Input
                className={className}
                type={showPassword ? 'text' : 'password'}
                ref={ref}
                {...props}
            />
            <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
            >
                {showPassword ? <Eye strokeWidth={1.75} className="w-5 h-5"/> : <EyeOff strokeWidth={1.5} className="w-5 h-5 text-muted-foreground" />}
            </button>
        </div>
    );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
