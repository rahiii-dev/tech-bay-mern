import { useEffect, useState } from "react";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import useAxios from "../../hooks/useAxios";
import { BACKEND_RESPONSE } from "../../utils/types";
import { BRAND_DELETE_URL, BRAND_LIST_URL, BRAND_RESTORE_URL } from "../../utils/urls/adminUrls";
import { toast } from "../../components/ui/use-toast";
import axios from "../../utils/axios";
import { Dialog, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";
import BrandForm from "../../components/Admin/BrandForm";
import BrandTable from "../../components/Admin/BrandTable";

export interface BrandResponse {
    _id: string;
    name: string;
    description: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

interface BrandListResponse {
    brandCount: number;
    brands: BrandResponse[];
}

const filterBrand = (brands: BrandResponse[], filter: string): BrandResponse[] => {
    switch (filter) {
        case 'inactive':
            return brands.filter((brand) => brand.isDeleted);
        default:
            return brands;
    }
};

const Brands = () => {
    const { data, error, loading, fetchData } = useAxios<BACKEND_RESPONSE<BrandListResponse>>({
        url: BRAND_LIST_URL,
        method: 'GET'
    });

    const [filter, setFilter] = useState("all");
    const [brands, setBrands] = useState<BrandResponse[]>([]);
    const [filteredBrands, setFilteredBrands] = useState<BrandResponse[]>([]);

    useEffect(() => {
        if (data?.data) {
            setBrands(data.data.brands);
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
            console.log(error);
        }
    };

    return (
        <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
            <div className="w-full flex justify-between items-center gap-2">
                <Tabs defaultValue="all" className="w-[250px] shadow-sm" onValueChange={setFilter}>
                    <TabsList className="flex items-center justify-between gap-2 bg-primary-foreground rounded-sm">
                        <TabsTrigger value="all" className="bg-secondary w-full rounded-sm p-1 data-[state=active]:bg-foreground data-[state=active]:text-background">All</TabsTrigger>
                        <TabsTrigger value="inactive" className="bg-secondary w-full rounded-sm p-1 data-[state=active]:bg-foreground data-[state=active]:text-background">Inactive</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="text-sm font-medium">
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
                    <BrandTable refetData={fetchData} brands={filteredBrands} handleBrandDeleteandRestore={handleBrandDeleteandRestore} />
                )}
            </div>
        </div>
    );
}

export default Brands;
