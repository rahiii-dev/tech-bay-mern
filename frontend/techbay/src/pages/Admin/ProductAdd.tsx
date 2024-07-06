import { useRef } from "react";
import ProductForm from "../../components/Admin/ProductForm";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const ProductAdd = () => {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleFormSubmit = () => {
        if (formRef.current) {
            formRef.current.submitForm();
        }
    };
    
    return (
        <div className="w-full flex flex-col gap-2 overflow-x-hidden custom-scrollbar">
            <div className="w-full flex justify-between items-center gap-2">
                <div>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant={"secondary"} className="h-8 gap-1" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button size="sm" className="h-8 gap-1" onClick={handleFormSubmit}>
                        Upload Product
                    </Button>
                </div>
            </div>
            <div className="w-full overflow-x-hidden custom-scrollbar">
                <ProductForm ref={formRef}/>
            </div>
        </div>
    );
}

export default ProductAdd;
