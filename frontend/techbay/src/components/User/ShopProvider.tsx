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
    setActivePage: () => {},
    fetchProducts: () => {},
};


const ShopProviderContext = createContext<ShopProviderState>(initialState);

type ShopProviderProps = {
    children: React.ReactNode;
}

const ShopProvider = ({children}: ShopProviderProps) => {
    const [productsData, setProductData] = useState<ProductListResponse | null>(null);
    const [activePage, setActivePage] = useState<number>(1);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [categories, setCategories] = useState<Category[]>([]);
    const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [checkedBrands, setCheckedBrands] = useState<string[]>([]);

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
        const url = `${USER_PRODUCT_LIST_URL}?page=${activePage}&limit=9&categories=${checkedCategories.join(',')}&brands=${checkedBrands.join(',')}`;
        fetchProducts({
            url,
            method: 'GET'
        }).then(() => {
            setStatus("success");
        }).catch(() => {
            setStatus("error");
        });
    }, [checkedCategories, checkedBrands, activePage]);

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
