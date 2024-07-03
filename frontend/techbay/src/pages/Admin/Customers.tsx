import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { User } from "../../features/auth/authTypes";
import axios from "../../utils/axios";
import { filterUsers } from "../../utils/filterUser";
import { useToast } from "../../components/ui/use-toast";
import CustomerTable from "../../components/Admin/CustomerTable";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { CUSTOMER_LIST_URL } from "../../utils/urls/adminUrls";

interface CustomerListResponse {
    totalCustomerCount: number;
    customers: User[];
}

const Customers = () => {
    const [filter, setFilter] = useState("all");
    const [customers, setCustomers] = useState<User[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);

    const { toast } = useToast();

    const { data, error, loading } = useAxios<CustomerListResponse>({
        url: CUSTOMER_LIST_URL,
        method: 'GET'
    });


    useEffect(() => {
        if (data) {
            setCustomers(data.customers);
        }
    }, [data]);

    useEffect(() => {
        setFilteredCustomers(filterUsers(customers, filter));
    }, [filter, customers]);

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
           
        }
    };

    return (
        <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
            <div className="w-full flex justify-between items-center gap-2">
                <Tabs defaultValue="all" className="w-[250px] shadow-sm" onValueChange={setFilter}>
                    <TabsList className="flex items-center justify-between gap-2 bg-primary-foreground rounded-sm">
                        <TabsTrigger value="all" className="bg-secondary w-full rounded-sm p-1 data-[state=active]:bg-foreground data-[state=active]:text-background">All</TabsTrigger>
                        <TabsTrigger value="blocked" className="bg-secondary w-full rounded-sm p-1 data-[state=active]:bg-foreground data-[state=active]:text-background">Blocked</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="text-sm font-medium">
                    {(data?.totalCustomerCount ?? 0) > 10
                        ? `Showing 1 - 10 of ${data?.totalCustomerCount}`
                        : `Showing all ${data?.totalCustomerCount}`}
                </div>
            </div>

            <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
            {loading && <TableSkeleton />}
                {!loading && !error && filteredCustomers.length === 0 && (
                    <div className="p-4 text-center text-foreground">No customers found.</div>
                )}
                {!loading && !error && filteredCustomers.length > 0 && (
                    <CustomerTable customers={filteredCustomers} handleBlockStatusChange={handleBlockStatusChange} />
                )}
            </div>
        </div>
    );
};

export default Customers;
