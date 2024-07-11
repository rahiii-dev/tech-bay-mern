import ShopPageGrid from "../../components/User/ShopPageGrid";
import ShopPageHeader from "../../components/User/ShopPageHeader";
import ShopProvider from "../../components/User/ShopProvider";


const ShopPage = () => {
    return (
        <ShopProvider>
            <section className="pb-6">
                <div className="container border-t-2 border-b-2 border-gray-100 mb-6 pb-10">
                    <div className="py-4">
                        <ShopPageHeader />
                    </div>
                    <div>
                        <ShopPageGrid />
                    </div>
                </div>
            </section>
        </ShopProvider>
    );
}

export default ShopPage;
