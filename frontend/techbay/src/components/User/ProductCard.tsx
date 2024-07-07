import { Rating } from "@mui/material";

const ProductCard = () => {
    return (
        <div className="w-full max-w-[300px] mx-auto overflow-hidden">
            <div className="w-full aspect-square overflow-hidden rounded-2xl">
                <img src="/user/hero-img.png" alt="product-img" 
                className="product-card-image filter brightness-95 bg-primary-foreground mix-blend-multiply" />
            </div>
            <div className="px-3 py-4">
                <h4 className="text-medium font-medium mb-2">JBL Tune 770NC</h4>
                <div className="flex items-center gap-1 mb-1">
                    <Rating name="read-only" value={3} size="small" readOnly />
                    <span>3/5</span>
                </div>
                <p className="text-xl font-bold">₹ 12,0200</p>
            </div>
        </div>
    );
}

export default ProductCard;
