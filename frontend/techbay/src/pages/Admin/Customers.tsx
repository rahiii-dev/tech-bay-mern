import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { User } from "../../features/auth/authTypes";
import axios from "../../utils/axios";
import { toast} from "../../components/ui/use-toast";
import CustomerTable from "../../components/Admin/CustomerTable";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { CUSTOMER_LIST_URL } from "../../utils/urls/adminUrls";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { PaginationResponse } from "../../utils/types/backendResponseTypes";
import { debounce } from "@mui/material";
import CustomPagination from "../../components/ui/CustomPagination";

interface CustomerListResponse extends PaginationResponse {
    totalCustomers: number;
    customers: User[];
}

const Customers = () => {
    const [filter, setFilter] = useState("all");
    const [customers, setCustomers] = useState<User[]>([]);
    const [searchCustomer, setSearchCustomer] = useState("");
    const [searchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const { data, loading, fetchData } = useAxios<CustomerListResponse>({}, false);

    useEffect(() => {
        fetchData({
            url: `${CUSTOMER_LIST_URL}?page=${currentPage}&filter=${filter}`,
            method: 'GET'
        })
    }, [currentPage, filter]);

    useEffect(() => {
        if (data) {
            setCustomers(data.customers);
        }
    }, [data]);

    const handleBlockStatusChange = async (userId: string, block: boolean) => {
        try {
            const url = `/admin/customer/${userId}/${block ? 'block' : 'unblock'}`;
            const response = await axios.put<User>(url);
            if (response.data) {
                const updatedCustomers = customers.map((user) =>
                    user._id === userId ? { ...user, isBlocked: block } : user
                );
                setCustomers(updatedCustomers);
                toast({
                    variant: "default",
                    title: `Customer ${block ? 'Blocked' : 'Unblocked'} Successfully.`,
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
            }
        } catch (error) {
           console.error(error);
        }
    };

    const handleSearch = debounce((term: string) => {
        fetchData({
            url: `${CUSTOMER_LIST_URL}?page=${currentPage}&search=${term.trim()}`,
            method: 'GET'
        })
    }, 300);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchCustomer(value)
        handleSearch(value)
    }
    

    return (
        <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
            <div className="w-full h-max py-2 flex justify-between items-center gap-2">
                <div>
                    <Input className="h-[35px]" placeholder="Search by customers" value={searchCustomer} onChange={handleChange} />
                </div>
                <div className="flex items-center gap-3">
                    <div>
                        <Select onValueChange={setFilter}>
                            <SelectTrigger className="w-[120px] h-[35px]">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="blocked">Blocked</SelectItem>
                                <SelectItem value="notverified">Not Verified</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
                {loading && !searchCustomer && <TableSkeleton />}
                {!loading && data && customers && customers.length === 0 && (
                    <div className="p-4 text-center text-foreground">No customers found.</div>
                )}
                {data && customers && customers.length > 0 && (
                    <>
                        <CustomerTable customers={customers} handleBlockStatusChange={handleBlockStatusChange} />
                        <div className="px-4 py-3 border-t-2 border-secondary flex justify-between items-center gap-3">
                            {data && (
                                <>
                                    <div className="text-sm font-medium text-gray-400">
                                        {(data.totalCustomers ?? 0) > 10
                                            ? `Showing 1 - ${data.limit} of ${data.totalCustomers}`
                                            : `Showing all ${data.totalCustomers}`}
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
};

export default Customers;
