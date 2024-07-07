import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import ProductListTable from "../../components/Admin/ProductListTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/useSelector";
import { useAppDispatch } from "../../hooks/useDispatch";
import { getProductsList } from "../../features/product/productThunk";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Product } from "../../features/product/productTypes";
import { filterProducts } from "../../utils/filters/productsFIlter";


const ProductList = () => {
    const [filter, setFilter] = useState("all");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const { products, status } = useAppSelector((state) => state.products)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (status === "idle") {
            dispatch(getProductsList())
        }
    }, []);

    useEffect(() => {
        setFilteredProducts(filterProducts(products, filter));
    }, [filter, products]);

    const navigate = useNavigate();
    return (
        <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
            <div className="w-full flex justify-between items-center gap-2">
                <Tabs defaultValue="all" className="w-[250px] shadow-sm" onValueChange={setFilter}>
                    <TabsList className="flex items-center justify-between gap-2 bg-primary-foreground rounded-sm">
                        <TabsTrigger value="all" className="bg-secondary w-full rounded-sm p-1 data-[state=active]:bg-foreground data-[state=active]:text-background">All</TabsTrigger>
                        <TabsTrigger value="inactive" className="bg-secondary w-full rounded-sm p-1 data-[state=active]:bg-foreground data-[state=active]:text-background">Inactive</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div>
                    <Button size="sm" className="h-8 gap-1" onClick={() => navigate('/admin/product/add')}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                        </span>
                    </Button>
                </div>
            </div>

            <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
                {status === "loading" && <TableSkeleton />}
                {filteredProducts.length === 0 && (
                    <div className="p-4 text-center text-foreground">No products found.</div>
                )}
                {status === "success" && filteredProducts.length > 0 && (
                    <ProductListTable products={filteredProducts} />
                )}
            </div>
        </div>
    );
}

export default ProductList;
