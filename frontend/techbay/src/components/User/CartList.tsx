import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { CartItem as ICartItem } from "../../utils/types/cartTypes";
import { SERVER_URL } from "../../utils/constants";
import { formatPrice } from "../../utils/appHelpers";
import { useAppDispatch } from "../../hooks/useDispatch";
import { removeItemFromCart, updateItemQuantity } from "../../features/cart/cartThunk";

type CartListProp = {
    cartItems: ICartItem[];
    editable?: boolean;
}

const CartList = ({ cartItems, editable=true }: CartListProp) => {
    const dispatch = useAppDispatch();


    const handleDelete = (id: string) => {
        dispatch(removeItemFromCart({ productId: id }))
    }

    const handleQuantityUpdate = (id: string, action: 'increment' | 'decrement') => {
        dispatch(updateItemQuantity({ productId: id, action }))
    }

    return (
        <div className="border rounded-xl overflow-hidden px-3">
            {cartItems.map(item => (
                <div key={item._id} className="flex justify-between border-b py-4 px-3">
                    <div className="flex gap-3">
                        <div className="size-20">
                            <img src={`${SERVER_URL}${item.product.thumbnailUrl}`} alt="product-img" />
                        </div>
                        <div className="font-medium">
                            <div className="flex gap-2">
                                <h3>{item.product.name}</h3>
                                {(item.product.stock < 5) &&
                                    (<div className="flex items-baseline gap-2">
                                        {item.product.stock === 0 ? (
                                            <>
                                                <span className="bg-red-200 text-red-800 px-3 text-[12px] font-medium rounded-full">out-of Stock</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="bg-red-200 text-red-800 px-3 text-[12px] font-medium rounded-full">{item.product.stock}</span>
                                                <span className="text-gray-400 text-sm">left</span>
                                            </>
                                        )}
                                    </div>)
                                }
                            </div>
                            <p className="text-sm">Brand: <span className="text-gray-400">{item.product.brand.name}</span></p>
                            <h2 className="text-xl">{formatPrice(item.product.price)}</h2>
                        </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                        {!editable
                            ? (
                                <div className="bg-gray-200 text-secondary-foreground rounded-full px-4">{item.quantity}</div>
                            )
                            : (
                                <>
                                    <Trash2 onClick={() => handleDelete(item._id)} className="text-red-500 cursor-pointer" size={20} />
                                    <div className="flex items-center bg-gray-200 text-secondary-foreground rounded-full overflow-hidden gap-2">
                                        <Button onClick={() => handleQuantityUpdate(item._id, "decrement")} variant={"secondary"} className="bg-inherit text-inherit rounded-none"><Minus size={20} /></Button>
                                        <span className="font-medium">{item.quantity}</span>
                                        <Button onClick={() => handleQuantityUpdate(item._id, "increment")} variant={"secondary"} className="bg-inherit text-inherit rounded-none"><Plus size={20} /></Button>
                                    </div>
                                </>
                            )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CartList;
