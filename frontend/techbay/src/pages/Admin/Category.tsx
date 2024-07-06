import { useEffect, useState } from "react";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import useAxios from "../../hooks/useAxios";
import { BACKEND_RESPONSE } from "../../utils/types";
import { CATEGORY_DELETE_URL, CATEGORY_LIST_URL, CATEGORY_RESTORE_URL } from "../../utils/urls/adminUrls";
import CategoryTable from "../../components/Admin/CategoryTable";
import { toast } from "../../components/ui/use-toast";
import axios from "../../utils/axios";
import { Dialog, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";
import CategoryForm from "../../components/Admin/CategoryForm";

export interface CategoryResponse {
    _id: string;
    name: string;
    description: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryListResponse {
    categoryCount: number;
    categories: CategoryResponse[]
}

const filterCategory = (categories: CategoryResponse[], filter: string): CategoryResponse[] => {
    switch (filter) {
        case 'inactive':
            return categories.filter((category) => category.isDeleted);
        default:
            return categories;
    }
};


const Category = () => {
    const { data, error, loading, fetchData } = useAxios<BACKEND_RESPONSE<CategoryListResponse>>({
        url: CATEGORY_LIST_URL,
        method: 'GET'
    });

    const [filter, setFilter] = useState("all");
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<CategoryResponse[]>([]);

    useEffect(() => {
        if (data?.data) {
            setCategories(data.data?.categories);
        }
    }, [data]);

    useEffect(() => {
        setFilteredCategories(filterCategory(categories, filter))
    }, [categories, filter])

    const handleCategoryDeleteandRestore = async (categoryId: string, isDeleted: boolean) => {
        try {
            let response;

            if (isDeleted) {
                response = await axios.put<BACKEND_RESPONSE>(CATEGORY_RESTORE_URL(categoryId));
            }
            else {
                response = await axios.delete<BACKEND_RESPONSE>(CATEGORY_DELETE_URL(categoryId));
            }

            if (response?.data) {
                const updatedCategories = categories.map((category) =>
                    category._id === categoryId ? { ...category, isDeleted: !isDeleted } : category
                );
                setCategories(updatedCategories);

                toast({
                    variant: "default",
                    title: `Category ${isDeleted ? 'Restored' : 'Deactivated'} successfully.`,
                    description: "",
                    className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
                });
            }
        } catch (error) {
            //    console.log(error);
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
                    {/* {(data?.data?.categoryCount ?? 0) > 10
                        ? `Showing 1 - 10 of ${data?.data?.categoryCount}`
                        : `Showing all ${data?.data?.categoryCount}`} */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Category
                                </span>
                            </Button>
                        </DialogTrigger>
                        <CategoryForm succesFormSubmit={fetchData}/>
                    </Dialog>
                </div>
            </div>

            <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
                {loading && <TableSkeleton />}
                {!loading && !error && filteredCategories.length === 0 && (
                    <div className="p-4 text-center text-foreground">No Category found.</div>
                )}
                {!loading && !error && filteredCategories.length > 0 && (
                    <CategoryTable refetData={fetchData} categories={filteredCategories} handleCategoryDeleteandRestore={handleCategoryDeleteandRestore} />
                )}
            </div>
        </div>
    );
}

export default Category;
