import { useEffect } from "react";
import ProductCard, { ProductCardSkeleton } from "../../components/User/ProductCard";
import ShopPageHeader from "../../components/User/ShopPageHeader";
import { useAppSelector } from "../../hooks/useSelector";
import { useAppDispatch } from "../../hooks/useDispatch";
import { loadShopPage } from "../../features/shop/shopThunk";


const ShopPage = () => {
    const products = useAppSelector((state) => state.shop.products)
    const shopStatus = useAppSelector((state) => state.shop.status)

    const dispatch = useAppDispatch();

    useEffect(() => {

        if (shopStatus === "idle") {
            dispatch(loadShopPage())
        }
    }, [shopStatus]);

    return (
        <section className="pb-6">
            <div className="container border-t-2 border-b-2 border-gray-100 mb-6 pb-10">
                <div className="py-4">
                    <ShopPageHeader />
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {shopStatus === "loading" ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))

                    ) : shopStatus === "sucesess" ? (
                        products.length === 0 ? (<div className="text-center w-screen">No products available</div>) :
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                    ) : (
                        <div>No products available</div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ShopPage;
