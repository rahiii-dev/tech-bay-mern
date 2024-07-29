import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";
import WishList from "../../components/User/WishList";
import useAxios from "../../hooks/useAxios";
import { Wishlist } from "../../utils/types/wishlistTypes";
import { USER_WISHLIST_URL } from "../../utils/urls/userUrls";
import { useAppDispatch } from "../../hooks/useDispatch";
import { wishToCart } from "../../features/cart/cartThunk";

const WishListPage = () => {
    const {data: wishlistData, fetchData: fetchWishListData} = useAxios<Wishlist>({
        url: USER_WISHLIST_URL,
        method: 'GET'
    })

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onItemRemoveSuccess = () => {
        fetchWishListData()
    }

    const handleWishToCart = () => {
        dispatch(wishToCart())
        navigate('/cart')
    }

    return (
        <div className="container border-t-2 border-gray-100 py-6">
            {(!wishlistData || wishlistData.products.length === 0) ? (
                    <div className="h-[250px]">
                        <SubHeading className="mb-10">WishList is Empty</SubHeading>
                        <div className="text-center mt-3">
                            <Link to={'/shop'}>
                                <Button size={"lg"} className="rounded-full">Go To Shop</Button>
                            </Link>
                        </div>
                    </div>
            ) : (
                <>
                    <SubHeading className="text-left mb-10">Your Wishlist</SubHeading>
                    <div className="mx-auto w-full max-w-[600px] flex flex-col gap-6">
                        <div className="flex-grow">
                            <WishList wishlistItems={wishlistData.products} onItemRemoveSuccess={onItemRemoveSuccess} />
                        </div>
                        <div className="mb-2 flex justify-end">
                            <Button onClick={handleWishToCart} className="max-w-[200px] rounded-full w-full">Add All Items To Cart</Button>
                            {/* <Button disabled={verifyCart} onClick={handleCheckout} className="rounded-full w-full">
                                    {verifyCart ? <CircularProgress color="inherit" size={20} /> : 'Go to Checkout'}
                                    {!verifyCart && <ArrowRight className="ms-2" size={20} />}
                                </Button> */}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default WishListPage;
