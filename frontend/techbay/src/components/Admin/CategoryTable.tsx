import { useState } from 'react';
import { Eye, Pencil, Trash } from 'lucide-react';
import { CategoryResponse } from '../../pages/Admin/Category';
import { formatDate } from '../../utils/appHelpers';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import CategoryForm from './CategoryForm';

type CategoryTableProps = {
    categories: CategoryResponse[];
    handleCategoryDeleteandRestore: (categoryId: string, isDeleted: boolean) => void;
    refetData: () => void;
}

const CategoryTable = ({ categories, handleCategoryDeleteandRestore, refetData }: CategoryTableProps) => {
    const [viewCategory, setViewCategory] = useState<CategoryResponse | null>(null);
    const [editCategory, setEditCategory] = useState<CategoryResponse | null>(null);

    const handleEditClick = (category: CategoryResponse) => {
        setEditCategory(category);
    };

    const handleCloseEdit = () => {
        setEditCategory(null);
    };

    const handleViewClick = (category: CategoryResponse) => {
        setViewCategory(category);
    };

    const handleCloseView = () => {
        setViewCategory(null);
    };

    return (
        <div>
            <Table className="w-full overflow-x-scroll">
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold">Category</TableHead>
                        <TableHead className="font-bold">Created</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map(category => (
                        <TableRow key={category._id}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{formatDate(category.createdAt)}</TableCell>
                            <TableCell>{!category.isDeleted ? <Badge variant="sucess">Active</Badge> : <Badge variant="destructive">Inactive</Badge>}</TableCell>
                            <TableCell>
                                {category.isDeleted ? (
                                    <Button className="min-w-[80px]" onClick={() => handleCategoryDeleteandRestore(category._id, category.isDeleted)}>Restore</Button>
                                ) : (
                                    <div className='flex gap-2'>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Eye className='cursor-pointer' onClick={() => handleViewClick(category)} />
                                                </TooltipTrigger>
                                                <TooltipContent side='top'>
                                                    <p>View Category</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Pencil className='text-yellow-600 cursor-pointer' onClick={() => handleEditClick(category)} />
                                                </TooltipTrigger>
                                                <TooltipContent side='top'>
                                                    <p>Edit Category</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Trash onClick={() => handleCategoryDeleteandRestore(category._id, category.isDeleted)} className='text-red-500 cursor-pointer' />
                                                </TooltipTrigger>
                                                <TooltipContent side='top'>
                                                    <p>Delete Category</p>
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

            {editCategory && (
                <Dialog open={!!editCategory} onOpenChange={handleCloseEdit}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                        </DialogHeader>
                        <CategoryForm category={editCategory} succesFormSubmit={refetData} />
                    </DialogContent>
                </Dialog>
            )}

            {viewCategory && (
                <Dialog open={!!viewCategory} onOpenChange={handleCloseView}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Category Details</DialogTitle>
                        </DialogHeader>
                        <div>
                            <h1 className='text-2xl pb-2'>{viewCategory.name}</h1>
                            <p className='text-secondary-foreground text-sm'>{viewCategory.description}</p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

export default CategoryTable;
