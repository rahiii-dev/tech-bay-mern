import ProductCard, { ProductCardSkeleton } from "../../components/User/ProductCard";
import ShopPageHeader from "../../components/User/ShopPageHeader";
import { useShop } from "../../components/User/ShopProvider";


const ShopPage = () => {
    const {products, status} = useShop()
    
    return (
        <section className="pb-6">
            <div className="container border-t-2 border-b-2 border-gray-100 mb-6 pb-10">
                <div className="py-4">
                    <ShopPageHeader />
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {status === "loading" ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))

                    ) : status === "success" ? (
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
