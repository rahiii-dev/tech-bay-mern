import { useEffect, useState } from "react";
import TableSkeleton from "../../components/ui/TableSkeleton";
import useAxios from "../../hooks/useAxios";
import { BACKEND_RESPONSE } from "../../utils/types/backendResponseTypes";
import { BRAND_DELETE_URL, BRAND_LIST_URL, BRAND_RESTORE_URL } from "../../utils/urls/adminUrls";
import { toast } from "../../components/ui/use-toast";
import axios from "../../utils/axios";
import { Dialog, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";
import BrandForm from "../../components/Admin/BrandForm";
import BrandTable from "../../components/Admin/BrandTable";
import { Brand, BrandList } from "../../utils/types/brandTypes";
import { filterBrand } from "../../utils/filters/brandFilter";
import { useSearchParams } from "react-router-dom";
import { debounce } from "@mui/material";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import CustomPagination from "../../components/ui/CustomPagination";

const Brands = () => {
    const { data, error, loading, fetchData } = useAxios<BrandList>({}, false);

    const [filter, setFilter] = useState("all");
    const [brands, setBrands] = useState<Brand[]>([]);
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const [searchBrand, setSearchBrand] = useState("");
    const [searchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        fetchData({
            url: `${BRAND_LIST_URL}?page=${currentPage}`,
            method: 'GET'
        })
    }, [currentPage]);

    useEffect(() => {
        if (data) {
            setBrands(data.brands);
        }
    }, [data]);

    useEffect(() => {
        setFilteredBrands(filterBrand(brands, filter));
    }, [brands, filter]);

    const handleBrandDeleteandRestore = async (brandId: string, isDeleted: boolean) => {
        try {
            let response;

            if (isDeleted) {
                response = await axios.put<BACKEND_RESPONSE>(BRAND_RESTORE_URL(brandId));
            } else {
                response = await axios.delete<BACKEND_RESPONSE>(BRAND_DELETE_URL(brandId));
            }

            if (response?.data) {
                const updatedBrands = brands.map((brand) =>
                    brand._id === brandId ? { ...brand, isDeleted: !isDeleted } : brand
                );
                setBrands(updatedBrands);

                toast({
                    variant: "default",
                    title: `Brand ${isDeleted ? 'Restored' : 'Deactivated'} successfully.`,
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
            }
        } catch (error) {
            // console.log(error);
        }
    };

    const handleSearch = debounce((term: string) => {
        fetchData({
            url: `${BRAND_LIST_URL}?page=${currentPage}&search=${term.trim()}`,
            method: 'GET'
        })
    }, 300);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchBrand(value)
        handleSearch(value)
    }

    return (
        <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
            <div className="w-full h-max py-2 flex justify-between items-center gap-2">
                <div>
                    <Input className="h-[35px]" placeholder="Search by brands" value={searchBrand} onChange={handleChange} />
                </div>
                <div className="text-sm font-medium flex items-center gap-3">
                    <div>
                        <Select onValueChange={setFilter}>
                            <SelectTrigger className="w-[120px] h-[35px]">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Brand
                                </span>
                            </Button>
                        </DialogTrigger>
                        <BrandForm succesFormSubmit={fetchData} />
                    </Dialog>
                </div>
            </div>

            <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
                {loading && <TableSkeleton />}
                {!loading && !error && filteredBrands.length === 0 && (
                    <div className="p-4 text-center text-foreground">No Brand found.</div>
                )}
                {!loading && !error && filteredBrands.length > 0 && (
                    <>
                        <BrandTable refetData={fetchData} brands={filteredBrands} handleBrandDeleteandRestore={handleBrandDeleteandRestore} />
                        <div className="px-4 py-3 border-t-2 border-secondary flex justify-between items-center gap-3">
                            {data && (
                                <>
                                    <div className="text-sm font-medium text-gray-400">
                                        {(data.totalBrands ?? 0) > 10
                                            ? `Showing 1 - ${data.limit} of ${data.totalBrands}`
                                            : `Showing all ${data.totalBrands}`}
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

export default Brands;
