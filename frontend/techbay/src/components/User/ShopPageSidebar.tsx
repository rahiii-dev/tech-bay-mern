import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { useShop } from "./ShopProvider";


const ShopPageSidebar = () => {
    const { categories, checkedCategories, setCheckedCategories, brands, checkedBrands, setCheckedBrands } = useShop();

    const handleCategory = (categoryName: string) => {
        if (checkedCategories.includes(categoryName)) {
            setCheckedCategories(checkedCategories.filter(cat => cat !== categoryName));
        } else {
            setCheckedCategories([...checkedCategories, categoryName]);
        }
    };

    const handleBrands = (brandName: string) => {
        if (checkedBrands.includes(brandName)) {
            setCheckedBrands(checkedBrands.filter(cat => cat !== brandName));
        } else {
            setCheckedBrands([...checkedBrands, brandName]);
        }
    };

    return (
        <div className="min-w-[250px] flex flex-col gap-4">
            <div className="px-3 border rounded-xl">
                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem className="border-b-0" value="item-1">
                        <AccordionTrigger>Categories</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-3">
                                {categories.map(category => (
                                    <div key={category._id} className="flex items-center gap-2">
                                        <Checkbox 
                                            checked={checkedCategories.includes(category.name)} 
                                            onCheckedChange={() => handleCategory(category.name)} />
                                        <h1>{category.name}</h1>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            
            <div className="px-3 border rounded-xl">
                <Accordion type="single" collapsible defaultValue="item-2">
                    <AccordionItem className="border-b-0" value="item-2">
                        <AccordionTrigger>Brands</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-3">
                                {brands.map(brand => (
                                    <div key={brand._id} className="flex items-center gap-2">
                                        <Checkbox checked={checkedBrands.includes(brand.name)} 
                                        onCheckedChange={() => handleBrands(brand.name)} 
                                        />
                                        <h1>{brand.name}</h1>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}

export default ShopPageSidebar;

