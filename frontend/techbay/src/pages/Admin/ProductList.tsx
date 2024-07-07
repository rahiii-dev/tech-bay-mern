import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import ProductListTable from "../../components/Admin/ProductListTable";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { PRODUCT_LIST_URL } from "../../utils/urls/adminUrls";
import { BACKEND_RESPONSE } from "../../utils/types";
import { useEffect, useState } from "react";

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    thumbnail: string;
    images: string[];
    stock: number;
    price: number;
    rating: number;
    isActive: boolean;
};

interface ProductList {
    productCount: number;
    products: Product[];
}


const ProductList = () => {
    const { data, error, loading, fetchData } = useAxios<BACKEND_RESPONSE<ProductList>>({
        url: PRODUCT_LIST_URL,
        method: 'GET'
    });

    const [products, setProducts] = useState<Product[]>([])

    // console.log(data);
    useEffect(() => {
        if (data?.data) {
            setProducts(data.data?.products);
        }
    }, [data]);

    const navigate = useNavigate();

    return (
        <div className="w-full h-screen flex flex-col gap-2 overflow-x-hidden custom-scrollbar">
            <div className="w-full flex justify-between items-center gap-2">
                <div></div>
                <div>
                    <Button size="sm" className="h-8 gap-1" onClick={() => navigate('/admin/product/add')}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                        </span>
                    </Button>
                </div>
            </div>
            <div className="w-full h-full overflow-x-hidden custom-scrollbar bg-primary-foreground rounded-md shadow-lg">
                <ProductListTable products={products} />

                {products.length > 0 && (
                    <div className="py-2 mt-2 border-t-2 text-secondary overflow-hidden">
                        <Pagination >
                            <PaginationContent>
                                <PaginationItem className="text-primary">
                                    <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem className="text-primary">
                                    <PaginationLink href="#">1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem className="text-primary">
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem className="text-primary">
                                    <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList;
