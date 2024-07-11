import { twMerge } from "tailwind-merge";

type SubHeadingProp = {
    className?: string;
    children : string;
}

const SubHeading = ({className, children}: SubHeadingProp) => {
    return (
        <h1 className={twMerge("text-5xl text-center font-extrabold uppercase mb-16", className)} >
            {children}
        </h1>
    );
}

export default SubHeading;
