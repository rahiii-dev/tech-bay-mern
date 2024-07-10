import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

type ProductPaginationProps = {
    hasPrevPage: boolean | null;
    hasNextPage: boolean | null;
    page: number;
    totalPages: number;
}

const CustomPagination = ({ hasPrevPage, hasNextPage, page, totalPages }: ProductPaginationProps) => {
    const renderPageNumbers = () => {
        const pageNumbers = [];

        // Always show the first page
        if (totalPages > 0) {
            pageNumbers.push(
                <div key={1} className={`rounded-full size-9 flex justify-center items-center cursor-pointer font-semibold ${1 === page ? 'bg-secondary text-primary' : 'bg-transparent hover:bg-secondary text-primary'}`}>
                    <Link to={'?page=1'}>1</Link>
                </div>
            );
        }

        // Show ellipsis if current page is far from the first page
        if (page > 3) {
            pageNumbers.push(
                <div key="start-ellipsis" className="rounded-full size-9 flex justify-center items-center font-semibold">
                    <MoreHorizontal className="h-4 w-4"/>
                </div>
            );
        }

        // Show the previous, current, and next pages around the current page
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pageNumbers.push(
                <div key={i} className={`rounded-full size-9 flex justify-center items-center cursor-pointer font-semibold ${i === page ? 'bg-secondary text-primary' : 'bg-transparent hover:bg-secondary text-primary'}`}>
                    <Link to={`?page=${i}`}>{i}</Link>
                </div>
            );
        }

        // Show ellipsis if current page is far from the last page
        if (page < totalPages - 2) {
            pageNumbers.push(
                <div key="end-ellipsis" className="rounded-full size-9 flex justify-center items-center font-semibold">
                    <MoreHorizontal className="h-4 w-4"/>
                </div>
            );
        }

        // Always show the last page
        if (totalPages > 1) {
            pageNumbers.push(
                <div key={totalPages} className={`rounded-full size-9 flex justify-center items-center cursor-pointer font-semibold ${totalPages === page ? 'bg-secondary text-primary' : 'bg-transparent hover:bg-secondary text-primary'}`}>
                    <Link to={`?page=${totalPages}`}>{totalPages}</Link>
                </div>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="flex gap-2">
            <div className={`bg-secondary rounded-full size-9 flex justify-center items-center cursor-pointer ${!hasPrevPage ? 'pointer-events-none text-gray-300' : 'bg-transparent hover:bg-secondary text-primary'}`}>
                <Link to={`?page=${page - 1}`}><ChevronLeft /></Link>
            </div>
            {renderPageNumbers()}
            <div className={`bg-secondary rounded-full size-9 flex justify-center items-center cursor-pointer ${!hasNextPage ? 'pointer-events-none text-gray-300' : 'bg-transparent hover:bg-secondary text-primary'}`}>
                <Link to={`?page=${page + 1}`}><ChevronRight /></Link>
            </div>
        </div>
    );
};

export default CustomPagination;
