import { useSearchParams } from "react-router-dom";
import CustomPagination from "../ui/CustomPagination";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { useShop } from "./ShopProvider";
import { useEffect } from "react";

const ShopPageGrid = () => {
    const { productsData, status, setActivePage } = useShop();

    const [searchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        setActivePage(currentPage)
    }, [currentPage]);

    return (
        <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {status === "loading" ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))

                ) : status === "success" ? (
                    productsData && productsData.products.length === 0 ? (<div className="text-center w-screen">No products available</div>) :
                        productsData && productsData.products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                ) : (
                    <div>No products available</div>
                )}
            </div>
            {productsData &&
                <div className="pt-2 flex justify-center">
                    <CustomPagination hasNextPage={productsData.hasNextPage} hasPrevPage={productsData.hasPrevPage} page={productsData.page} totalPages={productsData.totalPages} />
                </div>
            }
        </>

    );
}

export default ShopPageGrid;