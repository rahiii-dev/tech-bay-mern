import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import ProductCard, { ProductCardSkeleton } from "../../components/User/ProductCard";
import { HERO_IMG } from "../../utils/userContants";
import Slider from "react-slick";
import { useAppSelector } from "../../hooks/useSelector";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useDispatch";
import { loadPage } from "../../features/home/homeThunk";

const HomePage = () => {
    const { new_products, top_products, status } = useAppSelector((state) => state.home);

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (status === 'idle') {
            dispatch(loadPage());
        }

    }, [status]);

    const brandSliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 3,
        arrows: false,
    };

    return (
        <>
            <section>
                <div className="container flex flex-col-reverse sm:flex-row items-center">
                    <div className="w-full max-w-[400px] text-center sm:text-left">
                        <h1 className="text-3xl lg:text-6xl font-bold mb-2 lg:mb-5">Best Of Headphones</h1>
                        <p className="mb-4">Browse through our diverse range of meticulously crafted gadget, designed to bring out your individuality and cater to your sense of style.</p>
                        <Link to={'/shop'}>
                            <Button size={"lg"} className="rounded-full">Shop Now</Button>
                        </Link>
                    </div>
                    <div className="flex flex-grow justify-center items-center">
                        <img className="w-[200px] sm:w-full sm:max-w-[400px] h-auto" src={HERO_IMG} alt="hero img" />
                    </div>
                </div>
                <div className="mt-8 py-4 bg-black">
                    <div className="container">
                        <Slider {...brandSliderSettings}>
                            <div className="h-[100px]">
                                <img className="h-full w-auto" src="/user/brands/img-1.png" alt="brand-img" />
                            </div>
                            <div className="h-[100px]">
                                <img className="h-full" src="/user/brands/img-2.png" alt="brand-img" />
                            </div>
                            <div className="h-[100px]">
                                <img className="h-full" src="/user/brands/img-3.png" alt="brand-img" />
                            </div>
                            <div className="h-[100px]">
                                <img className="h-full" src="/user/brands/img-4.png" alt="brand-img" />
                            </div>
                            <div className="h-[100px]">
                                <img className="h-full" src="/user/brands/img-5.png" alt="brand-img" />
                            </div>
                        </Slider>
                    </div>
                </div>
            </section>

            <section>
                <div className="container py-20">
                    <div>
                        <h1 className="text-5xl text-center font-extrabold uppercase mb-16">New Arrivals</h1>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {status === "loading" ? (
                                <>
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                </>
                            )
                                :
                                <>
                                    {new_products.map(product => (
                                        <ProductCard product={product} />
                                    ))}
                                </>
                            }
                        </div>

                        <div className="text-center mt-3">
                            <Link to={'/shop'}>
                                <Button variant={"outline"} size={"lg"} className="rounded-full">View All</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="container py-20">
                    <div className="pb-16">
                        <h1 className="text-5xl text-center font-extrabold uppercase mb-16">Top Selling</h1>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {status === "loading" ? (
                                <>
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                    <ProductCardSkeleton />
                                </>
                            )
                                :
                                <>
                                    {top_products.map(product => (
                                        <ProductCard product={product} />
                                    ))}
                                </>
                            }
                        </div>

                        <div className="text-center mt-3">
                            <Link to={'/shop'}>
                                <Button variant={"outline"} size={"lg"} className="rounded-full">View All</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-16">
                <div className="container bg-gray-200 rounded-2xl py-10 px-8">
                    <h1 className="text-5xl text-center font-extrabold uppercase mb-16">Browse Categories</h1>
                    <div className="flex gap-4 mb-4">
                        <Link to={'/shop'} className="w-full max-w-[300px] h-[250px] hover:scale-[1.05] transition-all duration-300">
                            <div className="relative w-full h-full p-4 bg-primary-foreground rounded-2xl overflow-hidden">
                                <h1 className="text-xl font-bold uppercase">Laptops</h1>
                                <img className="absolute right-[-20%]" src="/user/category/laptop.png" alt="laptop" />
                            </div>
                        </Link>
                        <Link to={'/shop'} className="w-full flex-grow h-[250px] hover:scale-[1.05] transition-all duration-300">
                            <div className="relative w-full h-full p-4 bg-primary-foreground rounded-2xl overflow-hidden">
                                <h1 className="text-xl font-bold uppercase">Headphones</h1>
                                <img className="absolute top-[-50%] right-0" src="/user/category/headphone.png" alt="laptop" />
                            </div>
                        </Link>
                    </div>
                    <div className="flex gap-4">
                        <Link to={'/shop'} className="w-full flex-grow h-[250px] hover:scale-[1.05] transition-all duration-300">
                            <div className="relative w-full h-full p-4 bg-primary-foreground rounded-2xl overflow-hidden">
                                <h1 className="text-xl font-bold uppercase">SmartPhones</h1>
                                <img className="absolute top-[-30%] right-[-20%]" src="/user/category/smartphone.png" alt="laptop" />
                            </div>
                        </Link>
                        <Link to={'/shop'} className="w-full max-w-[300px] h-[250px] hover:scale-[1.05] transition-all duration-300">
                            <div className="relative w-full h-full p-4 bg-primary-foreground rounded-2xl overflow-hidden">
                                <h1 className="text-xl font-bold uppercase">Speakers</h1>
                                <img className="absolute top-0" src="/user/category/speaker.png" alt="laptop" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HomePage;
