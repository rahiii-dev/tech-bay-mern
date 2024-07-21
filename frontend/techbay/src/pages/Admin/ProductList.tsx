import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import ProductListTable from "../../components/Admin/ProductListTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { Product, ProductListResponse } from "../../utils/types/productTypes"
import { PRODUCT_DELETE_URL, PRODUCT_LIST_URL, PRODUCT_RESTORE_URL } from "../../utils/urls/adminUrls";
import useAxios from "../../hooks/useAxios";
import CustomPagination from "../../components/ui/CustomPagination";
import axios from "../../utils/axios";
import { toast } from "../../components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { debounce } from "@mui/material";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchProducts, setSearchProducts] = useState("");
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data, loading, fetchData } = useAxios<ProductListResponse>({}, false)

  useEffect(() => {
    fetchData({
      url: `${PRODUCT_LIST_URL}?page=${currentPage}&status=${filter}`,
      method: 'GET'
    })
  }, [currentPage, filter]);

  useEffect(() => {
    if (data) {
      setProducts(data.products)
    }
  }, [data]);

  // useEffect(() => {
  //   if (products.length > 0) {
  //     setFilteredProducts(products);
  //   }
  // }, [products]);

  const handleDeleteAndRestore = async (prodId: string, deleteProd: boolean) => {
    const url = deleteProd ? PRODUCT_DELETE_URL(prodId) : PRODUCT_RESTORE_URL(prodId);
    const method = deleteProd ? 'delete' : 'put';
    const updatedStatus = deleteProd ? false : true;

    try {
      await axios[method](url);
      const updatedProducts = products.map(product =>
        product._id === prodId ? { ...product, isActive: updatedStatus } : product
      );
      setProducts(updatedProducts);
      toast({
        variant: "default",
        title: `Product ${deleteProd ? 'Deleted' : 'Restored'} Successfully.`,
        description: "",
        className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Failed to ${deleteProd ? 'Delete' : 'Restore'} Product.`,
        description: "Please try again.",
        className: "bg-red-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
      });
    }
  };

  const handleSearch = debounce((term: string) => {
    fetchData({
      url: `${PRODUCT_LIST_URL}?page=${currentPage}&search=${term.trim()}`,
      method: 'GET'
    })
  }, 300);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchProducts(value)
    handleSearch(value)
  }
  

  return (
    <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
      <div className="w-full h-max py-2 flex justify-between items-center gap-2">
        <div>
          <Input className="h-[35px]" placeholder="Search by products" value={searchProducts} onChange={handleChange}/>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <Select onValueChange={setFilter}>
              <SelectTrigger className="w-[120px] h-[35px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="h-8 gap-1" onClick={() => navigate('/admin/product/add')}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
      </div>

      <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
        {loading && !searchProducts && <TableSkeleton />}
        {!loading && data && products.length === 0 && (
          <div className="p-4 text-center text-foreground">No products found.</div>
        )}
        {products.length > 0 && (
          <>
            <ProductListTable products={products} handleDeleteAndRestore={handleDeleteAndRestore} />
            <div className="px-4 py-3 border-t-2 border-secondary flex justify-between items-center gap-3">
              {data && (
                <>
                  <div className="text-sm font-medium text-gray-400">
                    {(data.totalProducts ?? 0) > 10
                      ? `Showing 1 - ${data.limit} of ${data.totalProducts}`
                      : `Showing all ${data.totalProducts}`}
                  </div>
                  <CustomPagination hasNextPage={data.hasNextPage} hasPrevPage={data.hasPrevPage} page={data.page} totalPages={data.totalPages} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductList;
