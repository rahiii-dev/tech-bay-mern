import { useEffect, useState } from "react";
import TableSkeleton from "../../components/ui/TableSkeleton";
import useAxios from "../../hooks/useAxios";
import { BACKEND_RESPONSE } from "../../utils/types/backendResponseTypes";
import { COUPON_DELETE_URL, COUPON_LIST_URL, COUPON_RESTORE_URL } from "../../utils/urls/adminUrls";
import { toast } from "../../components/ui/use-toast";
import axios from "../../utils/axios";
import { Dialog, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import CustomPagination from "../../components/ui/CustomPagination";
import { debounce } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Coupon, CouponList } from "../../utils/types/couponTypes";
import CouponsListTable from "../../components/Admin/CouponsListTable";
import CouponForm from "../../components/Admin/CouponForm";

const CouponsPage = () => {
    const { data, error, loading, fetchData } = useAxios<CouponList>({}, false);

    const [filter, setFilter] = useState("all");
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [filteredcoupons, setFilteredCoupons] = useState<Coupon[]>([]);
    const [searchCoupon, setSearchCoupon] = useState("");
    const [searchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const fetchCoupons = () => {
        fetchData({
            url: `${COUPON_LIST_URL}?page=${currentPage}&filter=${filter}`,
            method: 'GET'
        })
    }

    useEffect(() => {
        fetchCoupons()
    }, [currentPage, filter]);

    useEffect(() => {
        if (data) {
            setCoupons(data.coupons);
        }
    }, [data]);

    useEffect(() => {
        setFilteredCoupons(coupons);
    }, [coupons, filter])

    const handleCouponDeleteandRestore = async (couponID: string, isDeleted: boolean) => {
        try {
            let response;

            if (isDeleted) {
                response = await axios.put<BACKEND_RESPONSE>(COUPON_RESTORE_URL(couponID));
            }
            else {
                response = await axios.delete<BACKEND_RESPONSE>(COUPON_DELETE_URL(couponID));
            }

            if (response?.data) {
                const updatedCoupons = coupons.map((coupon) =>
                    coupon._id === couponID ? { ...coupon, isActive: isDeleted } : coupon
                );

                setCoupons(updatedCoupons);

                toast({
                    variant: "default",
                    title: `Coupon ${isDeleted ? 'Restored' : 'Deactivated'} successfully.`,
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = debounce((term: string) => {
        fetchData({
            url: `${COUPON_LIST_URL}?page=${currentPage}&search=${term.trim()}`,
            method: 'GET'
        })
    }, 300);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchCoupon(value)
        handleSearch(value)
    }

    return (
        <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
            <div className="w-full flex justify-between items-center gap-2">
                <div className="w-full h-max py-2 flex justify-between items-center gap-2">
                    <div>
                        <Input className="h-[35px]" placeholder="Search by coupons" value={searchCoupon} onChange={handleChange} />
                    </div>
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
                                    Add Coupon
                                </span>
                            </Button>
                        </DialogTrigger>
                        <CouponForm successFormSubmit={fetchCoupons} />
                    </Dialog>
                </div>
            </div>

            <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
                {loading && <TableSkeleton />}
                {!loading && !error && filteredcoupons.length === 0 && (
                    <div className="p-4 text-center text-foreground">No Coupons found.</div>
                )}
                {!loading && !error && filteredcoupons.length > 0 && (
                    <>
                        <CouponsListTable coupons={filteredcoupons} refetchCoupons={fetchCoupons} handleCouponDeleteandRestore={handleCouponDeleteandRestore} />
                        <div className="px-4 py-3 border-t-2 border-secondary flex justify-between items-center gap-3">
                            {data && (
                                <>
                                    <div className="text-sm font-medium text-gray-400">
                                        {(data.totalCoupons ?? 0) > 10
                                            ? `Showing 1 - ${data.limit} of ${data.totalCoupons}`
                                            : `Showing all ${data.totalCoupons}`}
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

export default CouponsPage;
