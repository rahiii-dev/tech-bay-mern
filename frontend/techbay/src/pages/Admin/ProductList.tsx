import { PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import ProductListTable from "../../components/Admin/ProductListTable";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { useNavigate } from "react-router-dom";

export interface Product {
    id: string;
    name: string;
    thumbnail: string;
    quantity: number;
    price: number;
    rating: number;
    isActive: boolean;
};

const products = [
    {
        id: "1",
        name: "Smartphone XYZ",
        thumbnail: "https://via.placeholder.com/150",
        quantity: 8,
        price: 699.99,
        rating: 4.5,
        isActive: true
    },
    {
        id: "2",
        name: "Wireless Headphones ABC",
        thumbnail: "https://via.placeholder.com/150",
        quantity: 150,
        price: 199.99,
        rating: 4.7,
        isActive: true
    },
    {
        id: "3",
        name: "4K TV 55 inch",
        thumbnail: "https://via.placeholder.com/150",
        quantity: 30,
        price: 1199.99,
        rating: 4.8,
        isActive: true
    },
    {
        id: "4",
        name: "Bluetooth Speaker DEF",
        thumbnail: "https://via.placeholder.com/150",
        quantity: 200,
        price: 49.99,
        rating: 4.3,
        isActive: true
    },
    {
        id: "5",
        name: "Gaming Laptop GHI",
        thumbnail: "https://via.placeholder.com/150",
        quantity: 25,
        price: 1599.99,
        rating: 4.6,
        isActive: true
    },
    {
        id: "6",
        name: "Smartwatch JKL",
        thumbnail: "https://via.placeholder.com/150",
        quantity: 75,
        price: 299.99,
        rating: 4.2,
        isActive: true
    },
    {
        id: "7",
        name: "DSLR Camera MNO",
        thumbnail: "https://via.placeholder.com/150",
        quantity: 40,
        price: 899.99,
        rating: 4.7,
        isActive: true
    },
    {
        id: "8",
        name: "Tablet PQR",
        thumbnail: "https://via.placeholder.com/150",
        quantity: 60,
        price: 499.99,
        rating: 4.4,
        isActive: false
    },
    {
        id: "9",
        name: "Fitness Tracker STU",
        thumbnail: "https://via.placeholder.com/150",
        quantity: 120,
        price: 99.99,
        rating: 4.5,
        isActive: true
    },
    {
        id: "10",
        name: "Wireless Mouse VWX",
        thumbnail: "https://via.placeholder.com/150",
        quantity: 300,
        price: 29.99,
        rating: 4.3,
        isActive: true
    }
];



const ProductList = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-col gap-2 overflow-x-hidden custom-scrollbar">
            <div className="w-full flex justify-between items-center gap-2">
                <div></div>
                <div>
                    <Button size="sm" className="h-8 gap-1" onClick={() => navigate('/admin/product/add')}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Product
                        </span>
                    </Button>
                </div>
            </div>
            <div className="w-full overflow-x-hidden custom-scrollbar bg-primary-foreground rounded-md shadow-lg">
                <ProductListTable products={products} />
                <div className="py-2 mt-2 border-t-2 text-secondary overflow-hidden">
                    <Pagination >
                        <PaginationContent>
                            <PaginationItem className="text-primary">
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem className="text-primary">
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem className="text-primary">
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem className="text-primary">
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
