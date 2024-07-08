import { Rating } from "@mui/material";
import { Product } from "../../features/product/productTypes";
import { SERVER_URL } from "../../utils/constants";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

type ProductCardProps = {
    product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
    const formattedAmount = product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    return (
        <Link to={`product/${product._id}`} className="group">
            <div className="w-full max-w-[300px] mx-auto overflow-hidden">
                <div className="w-full aspect-square overflow-hidden rounded-2xl">
                    <img src={`${SERVER_URL}${product.thumbnail}`} alt="product-img"
                        className="product-card-image group-hover:scale-[1.05] transition-[transform] duration-300 filter brightness-95 bg-primary-foreground mix-blend-multiply" />
                </div>
                <div className="px-3 py-4">
                    <h4 className="text-medium font-medium mb-2">{product.name}</h4>
                    <div className="flex items-center gap-1 mb-1">
                        <Rating name="read-only" value={3} size="small" readOnly />
                        <span>3/5</span>
                    </div>
                    <p className="text-xl font-bold">{formattedAmount}</p>
                </div>
            </div>
        </Link>
    );
}

export const ProductCardSkeleton = () => {

    return (
        <div className="w-full max-w-[300px] mx-auto overflow-hidden">
            <div className="w-full aspect-square overflow-hidden rounded-2xl">
                <Skeleton className="h-full" />
            </div>
            <div className="px-3 py-4">
                <h4 className="text-medium font-medium mb-2">
                    <Skeleton className="h-6 w-[80%]" />
                </h4>
                <div className="flex items-center gap-1 mb-1">
                    <Skeleton className="h-6 w-[70%]" />
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
