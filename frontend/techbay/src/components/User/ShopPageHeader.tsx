import { setActiveCategory } from "../../features/shop/shopSlice";
import { filterProductsUsingCategory } from "../../features/shop/shopThunk";
import { useAppDispatch } from "../../hooks/useDispatch";
import { useAppSelector } from "../../hooks/useSelector";
import { Button } from "../ui/button";


const ShopPageHeader = () => {
    const categories = useAppSelector((state) => state.shop.categories)
    const activeCategory = useAppSelector((state) => state.shop.activeCategory);
    
    const dispatch = useAppDispatch();
    

    const handleCategory = (category: string) => {
        dispatch(filterProductsUsingCategory(category))
        dispatch(setActiveCategory(category))
    };

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="border-r-2 pr-2">
                <CategoryButton name="All Products" isActive={activeCategory === "all"} onClick={() => handleCategory("all")} />
            </div>
            <div className="flex-grow flex items-center gap-2">
                {categories.map((category) => (
                    <div key={category._id}>
                        <CategoryButton name={category.name} isActive={activeCategory === category._id} onClick={() => handleCategory(category._id)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

interface CategoryButtonProps {
    name: string;
    isActive?: boolean;
    onClick?: () => void;
}

const CategoryButton = ({ name, isActive, onClick }: CategoryButtonProps) => {
    return (
        <Button
            className={`rounded-full bg-transparent text-md font-medium hover:bg-gray-200 ${isActive ? 'text-primary' : 'text-gray-400'}`}
            onClick={onClick}
        >
            {name}
        </Button>
    );
};

export default ShopPageHeader;
