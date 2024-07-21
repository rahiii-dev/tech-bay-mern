import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useShop } from "./ShopProvider";

const ShopHeader = () => {
    const {sort, setSort} = useShop();
    return (
        <div className="flex justify-end pb-4">
            <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[120px] h-[35px]">
                    <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="relavence">Relavence</SelectItem>
                    <SelectItem value="new">New Arrivals</SelectItem>
                    <SelectItem value="feautured">Feautured</SelectItem>
                    <SelectItem value="l-h">Price High to Low</SelectItem>
                    <SelectItem value="h-l">Price Low to High</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export default ShopHeader;
