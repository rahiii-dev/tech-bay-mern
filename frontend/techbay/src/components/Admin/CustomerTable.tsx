import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { formatDate } from '../../utils/appHelpers';
import { User } from "../../features/auth/authTypes";
import { Badge } from "../ui/badge";

interface CustomerTableProps {
    customers: User[];
    handleBlockStatusChange: (userId: string, block: boolean) => void;
}

const CustomerTable = ({ customers, handleBlockStatusChange }: CustomerTableProps) => {
    return (
        <Table className="w-full overflow-x-scroll">
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold">Name</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold">Created</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {customers.map(user => (
                    <TableRow key={user._id}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>{user.isVerified ? <Badge variant="sucess">Verified</Badge> : <Badge variant="destructive">Not Verified</Badge>}</TableCell>
                        <TableCell>
                            <Button
                                variant={user.isBlocked ? "default" : "destructive"}
                                className="min-w-[80px]"
                                size={"sm"}
                                onClick={() => handleBlockStatusChange(user._id, !user.isBlocked)}
                            >
                                {user.isBlocked ? "Unblock" : "Block"}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default CustomerTable;
