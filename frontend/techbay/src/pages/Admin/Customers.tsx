import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { format } from 'date-fns';
import axios from "../../utils/axios";
import { useToast } from "../../components/ui/use-toast";
import { ToastAction } from "../../components/ui/toast";

interface User {
    _id: string;
    fullName: string;
    email: string;
    createdAt: string;
    isBlocked: boolean;
}

interface CustomerListResponse {
    totalCustomerCount: number;
    customers: User[];
}

const filterUsers = (users: User[], filter: string): User[] => {
    switch (filter) {
        case 'blocked':
            return users.filter((user) => user.isBlocked);
        case 'unblocked':
            return users.filter((user) => !user.isBlocked);
        default:
            return users;
    }
};

const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd-MMM-yyyy');
};

const Customers = () => {
    const [filter, setFilter] = useState("all");
    const [customers, setCustomers] = useState<User[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);

    const { toast } = useToast()

    const { data, loading, error } = useAxios<CustomerListResponse>({
        url: '/admin/customer/list',
        method: 'GET'
    });

    useEffect(() => {
        if (data) {
            setCustomers(data.customers);
        }
    }, [data]);

    useEffect(() => {
        const filteredItems = filterUsers(customers, filter);
        setFilteredCustomers(filteredItems);
    }, [filter, customers]);

    const handleBlock = async (userId: string) => {
        try {
            const response = await axios.put<User>(`/admin/customer/${userId}/block`);
            if (response.data) {
                const updatedCustomers = customers.map((user) =>
                    user._id === userId ? { ...user, isBlocked: true } : user
                );
                setCustomers(updatedCustomers);
                toast({
                    variant: "default",
                    title: "Customer Blocked Succesfully.",
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again" onClick={() => handleBlock(userId)}>Try again</ToastAction>,
            })
        }
    };

    const handleUnblock = async (userId: string) => {
        try {
            const response = await axios.put<User>(`/admin/customer/${userId}/unblock`);
            if (response.data) {
                const updatedCustomers = customers.map((user) =>
                    user._id === userId ? { ...user, isBlocked: false } : user
                );
                setCustomers(updatedCustomers);
                toast({
                    variant: "default",
                    title: "Customer Unblocked Succesfully.",
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again" onClick={() => handleUnblock(userId)}>Try again</ToastAction>,
            })
        }
    };

    return (
        <>
            <div className="flex justify-between items-center g-2 mb-2">
                <Tabs defaultValue="all" className="w-[400px]" onValueChange={setFilter}>
                    <TabsList className="flex items-center justify-between gap-2 bg-primary-foreground rounded-sm">
                        <TabsTrigger value="all" className="bg-secondary w-full rounded-sm p-1">All</TabsTrigger>
                        <TabsTrigger value="blocked" className="bg-secondary w-full rounded-sm p-1">Blocked</TabsTrigger>
                        <TabsTrigger value="unblocked" className="bg-secondary w-full rounded-sm p-1">Unblocked</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="text-sm font-medium">
                    Showing 1 - 10 of {data?.totalCustomerCount || ''}
                </div>
            </div>

            <div className="bg-primary-foreground rounded-md shadow-sm">
                {loading && <p>Loading...</p>}
                {error && <p>Error loading data</p>}
                {!loading && !error && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.map(user => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                    <TableCell>
                                        <div>
                                            <Button
                                                variant={user.isBlocked ? "default" : "destructive"}
                                                className="min-w-[80px]"
                                                size={"sm"}
                                                onClick={() => user.isBlocked ? handleUnblock(user._id) : handleBlock(user._id)}
                                            >
                                                {user.isBlocked ? "Unblock" : "Block"}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );
};

export default Customers;
