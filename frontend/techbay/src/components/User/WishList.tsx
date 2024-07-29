import { Trash2 } from "lucide-react";
import { formatPrice } from "../../utils/appHelpers";
import { SERVER_URL } from "../../utils/constants";
import { Button } from "../ui/button";
import { Product } from "../../utils/types/productTypes";
import axios from "../../utils/axios";
import { USER_REMOVE_FROM_WISHLIST_URL } from "../../utils/urls/userUrls";
import { useAppDispatch } from "../../hooks/useDispatch";
import { useNavigate } from "react-router-dom";
import { addItemToCart } from "../../features/cart/cartThunk";

type WishListProp = {
    wishlistItems: Product[];
    onItemRemoveSuccess?: () => void;
}

const WishList = ({ wishlistItems, onItemRemoveSuccess }: WishListProp) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleRemoveWishListItem = async (productId: string) => {
        try {
            await axios.put(USER_REMOVE_FROM_WISHLIST_URL(productId));
            onItemRemoveSuccess?.();
        } catch (error) {
            console.error(error);
        }
    }

    const handleAddToCart = (id: string) => {
        dispatch(addItemToCart({ productId: id, quantity: 1 }))
        navigate('/cart')
    }


    return (
        <div className="border rounded-xl overflow-hidden px-3">
            {wishlistItems.map(item => (
                <div key={item._id} className="flex justify-between border-b py-4 px-3">
                    <div className="flex gap-3">
                        <div className="size-20">
                            <img src={`${SERVER_URL}${item.thumbnailUrl}`} alt="product-img" />
                        </div>
                        <div className="font-medium">
                            <div className="flex gap-2">
                                <h3>{item.name}</h3>
                                {(item.stock < 5) &&
                                    (<div className="flex items-baseline gap-2">
                                        {item.stock === 0 ? (
                                            <>
                                                <span className="bg-red-200 text-red-800 px-3 text-[12px] font-medium rounded-full">out-of Stock</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="bg-red-200 text-red-800 px-3 text-[12px] font-medium rounded-full">{item.stock}</span>
                                                <span className="text-gray-400 text-sm">left</span>
                                            </>
                                        )}
                                    </div>)
                                }
                            </div>
                            <p className="text-sm">Brand: <span className="text-gray-400">{typeof item.brand != 'string' && item.brand.name}</span></p>
                            <h2 className="text-xl">{formatPrice(item.price)}</h2>
                        </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                        <Trash2 onClick={() => handleRemoveWishListItem(item._id)} className="text-red-500 cursor-pointer" size={20} />
                        {item.stock > 0 && <Button onClick={() => handleAddToCart(item._id)} variant={"secondary"} className="bg-gray-200 rounded-full">Add to cart</Button>}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default WishList;
