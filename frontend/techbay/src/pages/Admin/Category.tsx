import { useEffect, useState } from "react";
import TableSkeleton from "../../components/ui/TableSkeleton";
import useAxios from "../../hooks/useAxios";
import { BACKEND_RESPONSE } from "../../utils/types/backendResponseTypes";
import { CATEGORY_DELETE_URL, CATEGORY_LIST_URL, CATEGORY_RESTORE_URL } from "../../utils/urls/adminUrls";
import CategoryTable from "../../components/Admin/CategoryTable";
import { toast } from "../../components/ui/use-toast";
import axios from "../../utils/axios";
import { Dialog, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { PlusCircle } from "lucide-react";
import CategoryForm from "../../components/Admin/CategoryForm";
import { Category as CategoryResponse, CategoryList as CategoryListResponse } from "../../utils/types/categoryTypes";
import { filterCategory } from "../../utils/filters/categoryFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import CustomPagination from "../../components/ui/CustomPagination";
import { debounce } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../components/ui/input";

const Category = () => {
    const { data, error, loading, fetchData } = useAxios<CategoryListResponse>({}, false);

    const [filter, setFilter] = useState("all");
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<CategoryResponse[]>([]);
    const [searchCategory, setSearchCategory] = useState("");
    const [searchParams] = useSearchParams();
  
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        fetchData({
          url: `${CATEGORY_LIST_URL}?page=${currentPage}`,
          method: 'GET'
        })
      }, [currentPage]);

    useEffect(() => {
        if (data) {
            setCategories(data.categories);
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

    const handleSearch = debounce((term: string) => {
        fetchData({
            url: `${CATEGORY_LIST_URL}?page=${currentPage}&search=${term.trim()}`,
            method: 'GET'
        })
    }, 300);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchCategory(value)
        handleSearch(value)
    }

    return (
        <div className="h-full w-full flex flex-col gap-2 overflow-y-hidden">
            <div className="w-full flex justify-between items-center gap-2">
                <div className="w-full h-max py-2 flex justify-between items-center gap-2">
                    <div>
                        <Input className="h-[35px]" placeholder="Search by category" value={searchCategory} onChange={handleChange} />
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
                                    Add Category
                                </span>
                            </Button>
                        </DialogTrigger>
                        <CategoryForm succesFormSubmit={fetchData} />
                    </Dialog>
                </div>
            </div>

            <div className="w-full max-h-[800px] custom-scrollbar overflow-x-hidden overflow-y-scroll flex-grow bg-primary-foreground rounded-md shadow-lg">
                {loading && <TableSkeleton />}
                {!loading && !error && filteredCategories.length === 0 && (
                    <div className="p-4 text-center text-foreground">No Category found.</div>
                )}
                {!loading && !error && filteredCategories.length > 0 && (
                    <>
                        <CategoryTable refetData={fetchData} categories={filteredCategories} handleCategoryDeleteandRestore={handleCategoryDeleteandRestore} />
                        <div className="px-4 py-3 border-t-2 border-secondary flex justify-between items-center gap-3">
                            {data && (
                                <>
                                    <div className="text-sm font-medium text-gray-400">
                                        {(data.totalCategories ?? 0) > 10
                                            ? `Showing 1 - ${data.limit} of ${data.totalCategories}`
                                            : `Showing all ${data.totalCategories}`}
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

export default Category;
