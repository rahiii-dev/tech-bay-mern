import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

const PageLoader = () => {
    useEffect(() => {
        document.body.classList.add('no-scroll');

        return () => {
            document.body.classList.remove('no-scroll');
        }
    }, []);

    return (
        <div className="text-primary fixed w-screen h-screen bg-primary-foreground top-0 left-0 flex justify-center items-center z-50">
            <CircularProgress color="inherit" />
        </div>
    );
}

export default PageLoader;
