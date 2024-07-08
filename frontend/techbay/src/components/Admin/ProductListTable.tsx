import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Rating } from '@mui/material';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { SERVER_URL } from "../../utils/constants";
import { Product } from "../../features/product/productTypes";
import { useAppDispatch } from "../../hooks/useDispatch";
import { deleteProduct, restoreProduct } from "../../features/product/productThunk";
import { Button } from "../ui/button";

type ProductListTableProps = {
    products: Product[]
}

const ProductListTable = ({ products }: ProductListTableProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleEdit = (productId: string) => {
        navigate('/admin/product/edit', { state: { productId } })
    }

    const handleDeleteProduct = (id: string) => {
        dispatch(deleteProduct(id))
    }

    const handleRestoreProduct = (id: string) => {
        dispatch(restoreProduct(id))
    }

    return (
        <Table className="w-full overflow-x-scroll">
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold">Product</TableHead>
                    <TableHead className="font-bold">QTY</TableHead>
                    <TableHead className="font-bold">Price</TableHead>
                    <TableHead className="font-bold">Rating</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map(product => (
                    <TableRow key={product._id}>
                        <TableCell>
                            <div className="flex gap-3 items-center overflow-hidden">
                                <div className="w-[50px] h-[50px] overflow-hidden rounded-sm shadow-lg">
                                    <img src={`${SERVER_URL}${product.thumbnail}`} className="w-full h-full object-cover object-center" alt="product-image" />
                                </div>
                                <div>
                                    <h1>{product.name}</h1>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell><span className={`${product.stock < 10 && 'text-destructive font-bold'}`}>{product.stock}</span></TableCell>
                        <TableCell>₹ {product.price}</TableCell>
                        <TableCell>
                            <Rating name="read-only" value={product.rating} size="small" readOnly />
                        </TableCell>
                        <TableCell>
                            <Badge variant={`${product.isActive ? 'sucess' : 'destructive'}`}>{product.isActive ? 'Active' : 'Inactive'}</Badge>
                        </TableCell>
                        <TableCell>
                            {!product.isActive ? (
                                <Button className="min-w-[80px]" onClick={() => handleRestoreProduct(product._id)}>Restore</Button>
                            ) : (
                                <div className="flex gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Pencil size={20} className='text-yellow-600 cursor-pointer' onClick={() => handleEdit(product._id)} />
                                        </TooltipTrigger>
                                        <TooltipContent side='top'>
                                            <p>Edit Product</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Trash size={20} onClick={() => handleDeleteProduct(product._id)} className='text-red-500 cursor-pointer' />
                                        </TooltipTrigger>
                                        <TooltipContent side='top'>
                                            <p>Delete Product</p>
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
    );
}

export default ProductListTable;

