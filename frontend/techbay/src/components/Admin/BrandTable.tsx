import { useState } from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';
import { formatDate } from '../../utils/appHelpers';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import BrandForm from './BrandForm';
import { Brand } from '../../utils/types/brandTypes';

type BrandTableProps = {
    brands: Brand[];
    handleBrandDeleteandRestore: (brandId: string, isDeleted: boolean) => void;
    refetData: () => void;
}

const BrandTable = ({ brands, handleBrandDeleteandRestore, refetData }: BrandTableProps) => {
    const [viewBrand, setViewBrand] = useState<Brand | null>(null);
    const [editBrand, setEditBrand] = useState<Brand | null>(null);

    const handleEditClick = (brand: Brand) => {
        setEditBrand(brand);
    };

    const handleCloseEdit = () => {
        setEditBrand(null);
    };

    const handleViewClick = (brand: Brand) => {
        setViewBrand(brand);
    };

    const handleCloseView = () => {
        setViewBrand(null);
    };

    return (
        <div>
            <Table className="w-full overflow-x-scroll">
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Brand</TableHead>
                        <TableHead className="font-bold">Created</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {brands.map(brand => (
                        <TableRow key={brand._id}>
                            <TableCell>{brand.name}</TableCell>
                            <TableCell>{formatDate(brand.createdAt)}</TableCell>
                            <TableCell>{!brand.isDeleted ? <Badge variant="sucess">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}</TableCell>
                            <TableCell>
                                {brand.isDeleted ? (
                                    <Button className="min-w-[80px]" onClick={() => handleBrandDeleteandRestore(brand._id, brand.isDeleted)}>Restore</Button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Eye size={20} className='cursor-pointer' onClick={() => handleViewClick(brand)} />
                                                </TooltipTrigger>
                                                <TooltipContent side='top'>
                                                    <p>View Brand</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Pencil size={20} className='text-yellow-600 cursor-pointer' onClick={() => handleEditClick(brand)} />
                                                </TooltipTrigger>
                                                <TooltipContent side='top'>
                                                    <p>Edit Brand</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Trash size={20} onClick={() => handleBrandDeleteandRestore(brand._id, brand.isDeleted)} className='text-red-500 cursor-pointer' />
                                                </TooltipTrigger>
                                                <TooltipContent side='top'>
                                                    <p>Delete Brand</p>
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

            {editBrand && (
                <Dialog open={!!editBrand} onOpenChange={handleCloseEdit}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Brand</DialogTitle>
                        </DialogHeader>
                        <BrandForm brand={editBrand} succesFormSubmit={refetData} />
                    </DialogContent>
                </Dialog>
            )}

            {viewBrand && (
                <Dialog open={!!viewBrand} onOpenChange={handleCloseView}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>View Brand</DialogTitle>
                        </DialogHeader>
                        <div>
                            <p><strong>Name:</strong> {viewBrand.name}</p>
                            <p><strong>Description:</strong> {viewBrand.description}</p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default BrandTable;
