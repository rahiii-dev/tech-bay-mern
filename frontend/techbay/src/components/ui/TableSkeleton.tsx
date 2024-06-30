import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";

const rows = new Array(10).fill(null);

const TableSkeleton = () => {
    return (
        <Table>
            <TableBody>
                {rows.map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-4 w-3/4" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-3/4" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-1/2" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-1/4" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableSkeleton;
