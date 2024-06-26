import { ReactNode } from "react";

type LayoutProp = {
    image: string,
    children: ReactNode
}

const AuthLayout = ({ image, children }: LayoutProp) => {
    return (
        <div className="w-full lg:max-h-screen lg:grid lg:grid-cols-2 overflow-hidden">
            <div className="flex justify-center h-screen overflow-y-scroll py-12 px-4 
                custom-scrollbar">
                {children}
            </div>
            <div className="hidden bg-muted lg:block h-full overflow-hidden">
                <img
                    src={image}
                    alt="Image"
                    className="h-full w-full object-cover object-center dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}

export default AuthLayout;
