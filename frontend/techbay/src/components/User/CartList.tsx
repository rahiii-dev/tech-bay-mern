import { Minus, Plus, Trash2 } from "lucide-react";
import { HERO_IMG } from "../../utils/userContants";
import { Button } from "../ui/button";
import { CartItem as ICartItem } from "../../utils/types/cartTypes";

type CartListProp = {
    cartItems : ICartItem[];
}

const CartList = ({cartItems}: CartListProp) => {
    return (
        <div className="border rounded-xl overflow-hidden px-3">
            {cartItems.map( (cart, index) => (
                <CartItem key={index} details={cart}/>
            ))}
        </div>
    );
}

type CartItemProp = {
    details : ICartItem;
}

export const CartItem = ({details}: CartItemProp) => {
    return (
        <div className="flex justify-between border-b py-4 px-3">
            <div className="flex gap-3">
                <div className="size-20">
                    <img src={`${HERO_IMG}`} alt="product-img" />
                </div>
                <div className="font-medium">
                    <h3>{details.product.name}</h3>
                    <p className="text-sm">Brand: <span className="text-gray-400"></span></p>
                    <h2 className="text-xl">{details.product.price}</h2>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between">
                <Trash2 className="text-red-500 cursor-pointer" size={20} />
                <div className="flex items-center bg-gray-200 text-secondary-foreground rounded-full overflow-hidden gap-2">
                    <Button variant={"secondary"} className="bg-inherit text-inherit rounded-none"><Minus size={20}/></Button>
                    <span className="font-medium">{details.quantity}</span>
                    <Button variant={"secondary"} className="bg-inherit text-inherit rounded-none"><Plus size={20}/></Button>
                </div>
            </div>
        </div>
    )
}

export default CartList;
