import { Rating } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { USER_ADD_TO_WISHLIST_URL, USER_GET_SINGLE_PRODUCT } from '../../utils/urls/userUrls';
import useAxios from '../../hooks/useAxios';
import ProductCard, { ProductCardSkeleton } from '../../components/User/ProductCard';
import { SERVER_URL } from '../../utils/constants';
import { formatPrice } from '../../utils/appHelpers';
import { ProductDetail } from '../../utils/types/productTypes';
import { useAppDispatch } from '../../hooks/useDispatch';
import { addItemToCart } from '../../features/cart/cartThunk';
import axios from '../../utils/axios';
import { getBackendError, isBackendError } from '../../utils/types/backendResponseTypes';
import { toast } from '../../components/ui/use-toast';


const ProductDetails = () => {
    const { data, loading, error, fetchData } = useAxios<ProductDetail>({}, false);
    const [seletedImage, setSeletedImage] = useState("");

    const { productId } = useParams();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (productId) {
            fetchData({
                url: USER_GET_SINGLE_PRODUCT(productId),
                method: 'GET'
            })
        }
    }, [productId]);

    useEffect(() => {
        if (data) {
            setSeletedImage(data.product.imageUrls[0])
        }

    }, [data]);

    const ProductSliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        vertical: false,
        verticalSwiping: false,
    };

    const ProductSliderSettingsVertical = {
        ...ProductSliderSettings,
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 2,
        vertical: true,
        verticalSwiping: true,
    }

    const handleImageSelection = (img: string) => {
        setSeletedImage(img)
    }

    const handleAddToCart = (id: string, quantity: number) => {
        dispatch(addItemToCart({ productId: id, quantity: quantity }))
        navigate('/cart')
    }

    const handleAddToWishList = async (productId: string) => {
        try {
            await axios.post(USER_ADD_TO_WISHLIST_URL, { productId });
            navigate('/wishlist')
        } catch (error) {
            if (isBackendError(error)) {
                const err = getBackendError(error)
                if (err.type === "Error") {
                    toast({
                        variant: "destructive",
                        title: err.message,
                        className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
                    })
                }
                navigate('/wishlist')
            }
        }
    }

    return (
        <>
            <section className="pb-6">
                {!loading && !error && data && (
                    <div className="container border-t-2 border-gray-100 mb-6 pb-10 md:grid md:grid-cols-2 gap-5 overflow-hidden">

                        <div className='md:flex md:flex-row md:h-[500px] gap-4 overflow-hidden md:py-5'>
                            <div className='md:hidden'>
                                <Slider {...ProductSliderSettings}>
                                    {data.product.imageUrls.map((img, index) => (
                                        <div key={index} className='rounded-2xl overflow-hidden'>
                                            <div className='max-w-[400px] mx-auto'>
                                                <img src={`${SERVER_URL}${img}`} alt="product image" />
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>

                            <div className='hidden md:block w-[150px] h-full overflow-hidden'>
                                <div className='w-full h-full'>
                                    <Slider {...ProductSliderSettingsVertical}>
                                        {data.product.imageUrls.map((img, index) => (
                                            <div key={index} onClick={() => handleImageSelection(img)} className='w-full aspect-square shadow-lg rounded-2xl overflow-hidden'>
                                                <img className='cursor-pointer mx-auto h-full w-full object-contain filter brightness-95 bg-primary-foreground mix-blend-multiply' src={`${SERVER_URL}${img}`} alt="product image" />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>

                            <div className='hidden md:block min-h-full flex-grow aspect-square shadow-lg rounded-2xl overflow-hidden'>
                                <img className='mx-auto h-full w-full object-cover filter brightness-95 bg-primary-foreground mix-blend-multiply' src={`${SERVER_URL}${seletedImage}`} alt="product image" />
                            </div>
                        </div>

                        <div className='md:py-5'>
                            <h1 className='text-4xl font-bold mb-2'>{data.product.name}</h1>
                            <div className='flex items-center gap-2 mb-2'>
                                <Rating name="read-only" value={3} readOnly />
                                <span className='font-medium text-[12px] text-gray-400'>3/2</span>
                                {data.product.stock === 0
                                    ? (<span className="bg-red-200 text-red-800 px-3 text-[12px] font-medium rounded-full">out-of stock</span>)
                                    : (<span className="bg-green-200 text-green-800 px-3 text-[12px] font-medium rounded-full">In stock</span>)}
                                {data.product.offerDiscount && (
                                    <span className="bg-red-200 text-red-800 px-3 font-medium rounded-full">-{data.product.offerDiscount}%</span>
                                )}
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h2 className='font-semibold text-gray-500 text-3xl mb-2'>{data.product.offerDiscount ? formatPrice(data.product.finalPrice) : formatPrice(data.product.price)}</h2>
                                {data.product.offerDiscount && (<p className="font-medium line-through text-xl text-gray-400">{formatPrice(data.product.price)}</p>)}
                            </div>
                            <p className='text-sm text-gray-400 mb-8 min-h-[100px]'>{data.product.description}</p>
                            <div className='flex items-center gap-5'>
                                <Button onClick={() => handleAddToCart(data.product._id, 1)} disabled={(!data.product.isActive || data.product.stock === 0)} className='rounded-full w-full max-w-[200px]'>Add to Cart</Button>
                                <Button onClick={() => handleAddToWishList(data.product._id)} disabled={!data.product.isActive} variant={"secondary"} className='rounded-full bg-gray-200 w-full max-w-[200px]'>Add to WishList</Button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
            <section>
                <div className="container">
                    <div className="pb-16">
                        {data && data.related_products.length > 0 && <h1 className="text-3xl text-center font-extrabold uppercase mb-16">You Might Also Like</h1>}
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {loading ? (
                                <>
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                </>
                            )
                                :
                                <>
                                    {data && data.related_products.map(product => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

const NextArrow = ({ onClick }: any) => {

    return (
        <button onClick={onClick}
            className='bg-gray-100 text-gray-300 shadow-sm md:top-[-10px] md:right-[45%] md:-rotate-90 rounded-full hover:scale-[1.05] transition-[transform] duration-300 absolute top-[50%] right-0 z-10'>
            <ChevronRight size={30} />
        </button>
    );
};

const PrevArrow = ({ onClick }: any) => {
    return (
        <button onClick={onClick} className='bg-gray-100 text-gray-300 shadow-sm absolute top-[50%] left-0 z-10 md:left-[40%] md:top-[80%] md:-rotate-90 rounded-full hover:scale-[1.05] transition-[transform] duration-300'>
            <ChevronLeft size={30} />
        </button>
    );
};

export default ProductDetails;
