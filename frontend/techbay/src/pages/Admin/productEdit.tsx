import { useLocation } from "react-router-dom";

const ProductEdit = () => {
    const location = useLocation()
    return (
        <div className="w-full h-full overflow-x-hidden custom-scrollbar bg-primary-foreground rounded-md shadow-lg">
            Product Edit {location.state.productId}
        </div>
    );
}

export default ProductEdit;
