import { ProductListResponse } from '../../utils/types/productTypes';
import { Category, CategoryList } from '../../utils/types/categoryTypes';
import { createContext, useContext, useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { USER_PRODUCT_LIST_URL, USER_CATEGORY_LIST_URL } from '../../utils/urls/userUrls';

type ShopProviderState = {
    productsData: ProductListResponse | null;
    categories: Category[];
    activeCategory: string;
    status: "loading" | "success" | "error";
    setActiveCategory: (category: string) => void;
    setActivePage: (page: number) => void;
    fetchProducts: () => void;
    fetchCategories: () => void;
}

const initialState: ShopProviderState = {
    productsData: null,
    categories: [],
    activeCategory: "all",
    status: "loading",
    setActiveCategory: () => {},
    setActivePage: () => {},
    fetchProducts: () => {},
    fetchCategories: () => {},
}

const ShopProviderContext = createContext<ShopProviderState>(initialState);

type ShopProviderProps = {
    children: React.ReactNode;
}

const ShopProvider = ({children}: ShopProviderProps) => {
    const [productsData, setProductData] = useState<ProductListResponse | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [activePage, setActivePage] = useState<number>(1);

    const { data: productData, fetchData: fetchProducts } = useAxios<ProductListResponse>({}, false);

    const { data: categoryData, fetchData: fetchCategories } = useAxios<CategoryList>({
        url: USER_CATEGORY_LIST_URL,
        method: 'GET'
    });

    useEffect(() => {
        setStatus("loading")
        const url = activeCategory === "all" ? `${USER_PRODUCT_LIST_URL}?page=${activePage}` : `${USER_PRODUCT_LIST_URL}?page=${activePage}&category=${activeCategory}`;
        fetchProducts({
            url,
            method: 'GET'
        }).then((_) => {
            setStatus("success")
        }).catch((_) => {
            setStatus("error")
        })
        
    }, [activeCategory, activePage])

    useEffect(() => {
        if(productData){
            setProductData(productData)
            setStatus("success")
        }
    }, [productData])

    useEffect(() => {
        if(categoryData){
            setCategories(categoryData.categories)
        }
    }, [categoryData])

    const value: ShopProviderState = {
        productsData,
        categories,
        status: status,
        activeCategory,
        setActivePage,
        setActiveCategory,
        fetchProducts,
        fetchCategories,
    }

    return (
        <ShopProviderContext.Provider value={value}>
            {children}
        </ShopProviderContext.Provider>
    );
}

export const useShop = () => {
    const context = useContext(ShopProviderContext);
  
    if (context === undefined) {
      throw new Error("useShop must be used within a ShopProvider");
    }
  
    return context;
}

export default ShopProvider;
