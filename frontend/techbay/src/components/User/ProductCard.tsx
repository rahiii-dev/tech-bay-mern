import { Rating } from "@mui/material";
import { SERVER_URL } from "../../utils/constants";
import { Link } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { formatPrice } from "../../utils/appHelpers";
import { Product } from "../../utils/types/productTypes";

type ProductCardProps = {
    product: Product;
    label?: boolean
}

const ProductCard = ({ product, label }: ProductCardProps) => {
    return (
        <Link to={`/product/${product._id}`} className="group relative overflow-hidden">
            {label && (
                <>
                    {product.stock === 0 && <div className="absolute bg-red-500 text-primary-foreground text-sm py-1 px-3 z-10 rounded-tl-2xl rounded-br-2xl">Out of Stock</div>}
                    {product.stock > 0 && product.isFeatured && <div className="absolute bg-primary text-primary-foreground text-sm py-1 px-3 z-10 rounded-tl-2xl rounded-br-2xl">Featured</div>}

                </>
            )}
            {product.offerDiscount && <div className="absolute right-0 top-0 bg-primary text-green-500 text-sm py-1 px-3 z-10 rounded-bl-2xl">{product.offerDiscount}%</div>}
            <div className="w-full max-w-[300px] mx-auto overflow-hidden">
                <div className="w-full aspect-square overflow-hidden rounded-2xl">
                    <img src={`${SERVER_URL}${product.thumbnail}`} alt="product-img"
                        className="product-card-image mx-auto h-full w-full object-contain group-hover:scale-[1.05] transition-[transform] duration-300 filter brightness-95 bg-primary-foreground mix-blend-multiply" />
                </div>
                <div className="px-3 py-4">
                    <h4 className="text-medium font-medium mb-2">{product.name}</h4>
                    <div className="flex items-center gap-1 mb-1">
                        <Rating name="read-only" value={3} size="small" readOnly />
                        <span>3/5</span>
                    </div>
                    <div className="flex items-baseline gap-2">    
                        <p className="text-xl font-bold">{product.offerDiscount ? formatPrice(product.finalPrice) : formatPrice(product.price)}</p>
                        {product.offerDiscount && (<p className="text-sm font-medium line-through text-gray-500">{formatPrice(product.price)}</p>)}
                    </div>
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
