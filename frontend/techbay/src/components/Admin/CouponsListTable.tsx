import { useState } from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';
import { formatDate, formatPrice } from '../../utils/appHelpers';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Coupon } from "../../utils/types/couponTypes";
import CouponForm from './CouponForm';

type CouponsListTableProps = {
    coupons: Coupon[];
    handleCouponDeleteandRestore: (couponID: string, isDeleted: boolean) => void;
    refetchCoupons: () => void;
}

const CouponsListTable = ({ coupons, handleCouponDeleteandRestore, refetchCoupons }: CouponsListTableProps) => {
    const [viewCoupon, setViewCoupon] = useState<Coupon | null>(null);
    const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);

    const handleEditClick = (coupon: Coupon) => {
        setEditCoupon(coupon);
    };

    const handleCloseEdit = () => {
        setEditCoupon(null);
    };

    const handleViewClick = (coupon: Coupon) => {
        setViewCoupon(coupon);
    };

    const handleCloseView = () => {
        setViewCoupon(null);
    };

    return (
        <div>
            <Table className="w-full overflow-x-scroll">
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Coupon Code</TableHead>
                        <TableHead className="font-bold">Discount</TableHead>
                        <TableHead className="font-bold">Created</TableHead>
                        <TableHead className="font-bold">Expires</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {coupons.map(coupon => (
                        <TableRow key={coupon._id}>
                            <TableCell>{coupon.code}</TableCell>
                            <TableCell>{coupon.discount}%</TableCell>
                            <TableCell>{formatDate(coupon.createdAt)}</TableCell>
                            <TableCell>{formatDate(coupon.expiryDate)}</TableCell>
                            <TableCell>{coupon.isActive ? <Badge variant="sucess">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}</TableCell>
                            <TableCell>
                                {!coupon.isActive ? (
                                    <Button className="min-w-[80px]" onClick={() => handleCouponDeleteandRestore(coupon._id, !coupon.isActive)} size={"sm"}>Restore</Button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Eye size={20} className='cursor-pointer' onClick={() => handleViewClick(coupon)} />
                                                </TooltipTrigger>
                                                <TooltipContent side='top'>
                                                    <p>View Coupon</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Pencil size={20} className='text-yellow-600 cursor-pointer' onClick={() => handleEditClick(coupon)} />
                                                </TooltipTrigger>
                                                <TooltipContent side='top'>
                                                    <p>Edit Coupon</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Trash size={20} onClick={() => handleCouponDeleteandRestore(coupon._id, !coupon.isActive)} className='text-red-500 cursor-pointer' />
                                                </TooltipTrigger>
                                                <TooltipContent side='top'>
                                                    <p>Delete Coupon</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {editCoupon && (
                <Dialog open={!!editCoupon} onOpenChange={handleCloseEdit}>
                    <CouponForm successFormSubmit={refetchCoupons} coupon={editCoupon} />
                </Dialog>
            )}

            {viewCoupon && (
                <Dialog open={!!viewCoupon} onOpenChange={handleCloseView}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Coupon Details</DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                            <h1 className="text-2xl font-bold pb-4">{viewCoupon.code}</h1>
                            <div className="space-y-2">
                                <p className="text-lg"><span className="font-semibold">Discount:</span> {viewCoupon.discount}%</p>
                                <p className="text-lg"><span className="font-semibold">Expires on:</span> {formatDate(viewCoupon.expiryDate)}</p>
                                <p className="text-lg"><span className="font-semibold">Minimum Amount:</span> {formatPrice(viewCoupon.minAmount)}</p>
                                <p className="text-lg"><span className="font-semibold">Maximum Amount:</span> {formatPrice(viewCoupon.maxAmount)}</p>
                                <p className="text-lg"><span className="font-semibold">Status:</span>
                                    {viewCoupon.isActive ?
                                        <Badge className="ml-2 bg-green-500 text-white">Active</Badge> :
                                        <Badge className="ml-2 bg-red-500 text-white">Inactive</Badge>}
                                </p>
                                <p className="text-lg"><span className="font-semibold">Created at:</span> {formatDate(viewCoupon.createdAt)}</p>
                                <p className="text-lg"><span className="font-semibold">Updated at:</span> {formatDate(viewCoupon.updatedAt)}</p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
}

export default CouponsListTable;
