import { Product, ProductListResponse } from '../../utils/types/productTypes';
import { Category, CategoryList } from '../../utils/types/categoryTypes';
import { createContext, useContext, useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { USER_PRODUCT_LIST_URL, USER_CATEGORY_LIST_URL } from '../../utils/urls/userUrls';

type ShopProviderState = {
    products: Product[];
    categories: Category[];
    activeCategory: string;
    status: "loading" | "success" | "error";
    setActiveCategory: (category: string) => void;
    fetchProducts: () => void;
    fetchCategories: () => void;
}

const initialState: ShopProviderState = {
    products: [],
    categories: [],
    activeCategory: "all",
    status: "loading",
    setActiveCategory: () => {},
    fetchProducts: () => {},
    fetchCategories: () => {},
}

const ShopProviderContext = createContext<ShopProviderState>(initialState);

type ShopProviderProps = {
    children: React.ReactNode;
}

const ShopProvider = ({children}: ShopProviderProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [activeCategory, setActiveCategory] = useState<string>("all");

    const { data: productData, fetchData: fetchProducts } = useAxios<ProductListResponse>({}, false);

    const { data: categoryData, fetchData: fetchCategories } = useAxios<CategoryList>({
        url: USER_CATEGORY_LIST_URL,
        method: 'GET'
    });

    useEffect(() => {
        setStatus("loading")
        const url = activeCategory === "all" ? USER_PRODUCT_LIST_URL : `${USER_PRODUCT_LIST_URL}?category=${activeCategory}`;
        fetchProducts({
            url,
            method: 'GET'
        }).then((_) => {
            setStatus("success")
        }).catch((_) => {
            setStatus("error")
        })
        
    }, [activeCategory])

    useEffect(() => {
        if(productData){
            setProducts(productData.products)
            setStatus("success")
        }
    }, [productData])

    useEffect(() => {
        if(categoryData){
            setCategories(categoryData.categories)
        }
    }, [categoryData])

    const value: ShopProviderState = {
        products,
        categories,
        status: status,
        activeCategory,
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
