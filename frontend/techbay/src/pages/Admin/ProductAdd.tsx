import ProductForm from "../../components/Admin/ProductForm";
import { Button } from "../../components/ui/button";

const ProductAdd = () => {
    return (
        <div className="w-full flex flex-col gap-2 overflow-x-hidden custom-scrollbar">
            <div className="w-full flex justify-between items-center gap-2">
                <div>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant={"secondary"} className="h-8 gap-1" onClick={() => ''}>
                        Cancel
                    </Button>
                    <Button size="sm" className="h-8 gap-1" onClick={() => ''}>
                        Upload Product
                    </Button>
                </div>
            </div>
            <div className="w-full overflow-x-hidden custom-scrollbar">
                <ProductForm/>
            </div>
        </div>
    );
}

export default ProductAdd;
