import ShopHeader from "../../components/User/ShopHeader";
import ShopPageGrid from "../../components/User/ShopPageGrid";
import ShopPageSidebar from "../../components/User/ShopPageSidebar";
import ShopProvider from "../../components/User/ShopProvider";


const ShopPage = () => {
    return (
        <ShopProvider>
            <section className="pb-6">
                <div className="container border-t-2 border-b-2 border-gray-100 mb-6 pb-10">
                    <div className="w-full flex gap-4 py-4">
                        <div>
                            <ShopPageSidebar />
                        </div>
                        <div className="flex-grow">
                            <ShopHeader/>
                            <ShopPageGrid />
                        </div>
                    </div>
                </div>
            </section>
        </ShopProvider>
    );
}

export default ShopPage;
