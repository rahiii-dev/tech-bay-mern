import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from 'react';
import useAxios from '../../hooks/useAxios';
import { USER_PRODUCT_LIST_URL, USER_CATEGORY_LIST_URL, USER_BRAND_LIST_URL } from '../../utils/urls/userUrls';
import { ProductListResponse } from '../../utils/types/productTypes';
import { Category } from '../../utils/types/categoryTypes';
import { Brand } from '../../utils/types/brandTypes';

type ShopProviderState = {
    productsData: ProductListResponse | null;
    categories: Category[];
    checkedCategories: string[];
    setCheckedCategories: Dispatch<SetStateAction<string[]>>;
    brands: Brand[];
    checkedBrands: string[];
    setCheckedBrands: Dispatch<SetStateAction<string[]>>;
    status: "loading" | "success" | "error";
    sort: "relavence" | "new" | "feautured" | "l-h" | "h-l";
    setSort: (value: "relavence" | "new" | "feautured" | "l-h" | "h-l") => void;
    setActivePage: (page: number) => void;
    fetchProducts: () => void;
}


const initialState: ShopProviderState = {
    productsData: null,
    categories: [],
    checkedCategories: [],
    setCheckedCategories: () => {},
    brands: [],
    checkedBrands: [], 
    setCheckedBrands: () => {},
    status: "loading",
    sort: "relavence",
    setSort: () => {},
    setActivePage: () => {},
    fetchProducts: () => {},
};


const ShopProviderContext = createContext<ShopProviderState>(initialState);

type ShopProviderProps = {
    children: React.ReactNode;
}

const ShopProvider = ({children}: ShopProviderProps) => {
    const [productsData, setProductData] = useState<ProductListResponse | null>(initialState.productsData);
    const [activePage, setActivePage] = useState<number>(1);
    const [status, setStatus] = useState<"loading" | "success" | "error">(initialState.status);
    const [categories, setCategories] = useState<Category[]>(initialState.categories);
    const [checkedCategories, setCheckedCategories] = useState<string[]>(initialState.checkedCategories);
    const [brands, setBrands] = useState<Brand[]>(initialState.brands);
    const [checkedBrands, setCheckedBrands] = useState<string[]>(initialState.checkedBrands);
    const [sort, setSort] = useState<"relavence" | "new" | "feautured" | "l-h" | "h-l">(initialState.sort);

    const { data: productData, fetchData: fetchProducts } = useAxios<ProductListResponse>({}, false);

    const { data: categoryData} = useAxios<Category[]>({
        url: USER_CATEGORY_LIST_URL,
        method: 'GET'
    });

    const { data: brandsData } = useAxios<Brand[]>({
        url: USER_BRAND_LIST_URL,
        method: 'GET'
    });

    useEffect(() => {
        setStatus("loading");
        const url = `${USER_PRODUCT_LIST_URL}?page=${activePage}&limit=9&categories=${checkedCategories.join(',')}&brands=${checkedBrands.join(',')}&sort=${sort}`;
        fetchProducts({
            url,
            method: 'GET'
        }).then(() => {
            setStatus("success");
        }).catch(() => {
            setStatus("error");
        });
    }, [checkedCategories, checkedBrands, activePage, sort]);

    useEffect(() => {
        if(productData){
            setProductData(productData);
            setStatus("success");
        }
    }, [productData]);

    useEffect(() => {
        if(categoryData){
            setCategories(categoryData);
        }
    }, [categoryData]);

    useEffect(() => {
        if(brandsData){
            setBrands(brandsData);
        }
    }, [brandsData]);

    const value: ShopProviderState = {
        productsData,
        categories,
        status,
        checkedCategories,
        setCheckedCategories,
        brands,
        checkedBrands,
        setCheckedBrands,
        sort,
        setSort, 
        setActivePage,
        fetchProducts,
    };

    return (
        <ShopProviderContext.Provider value={value}>
            {children}
        </ShopProviderContext.Provider>
    );
};


export const useShop = () => {
    const context = useContext(ShopProviderContext);
  
    if (context === undefined) {
      throw new Error("useShop must be used within a ShopProvider");
    }
  
    return context;
}

export default ShopProvider;
