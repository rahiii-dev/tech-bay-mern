import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SubHeading from "../../components/User/SubHeading";
import { formatPrice } from "../../utils/appHelpers";
import { useAppSelector } from "../../hooks/useSelector";
import CartList from "../../components/User/CartList";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { USER_ADDRESS_LIST_URL } from "../../utils/urls/userUrls";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Skeleton } from "../../components/ui/skeleton";
import { Addresss } from "../../utils/types/addressTypes";
import { toast } from "../../components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import AddressForm from "../../components/User/AddressForm";

const CheckoutPage = () => {
    const cart = useAppSelector((state) => state.cart.cart)
    const { data: addressesData, loading: addressLoading, fetchData: fetchAddressList } = useAxios<Addresss[]>({
        url: USER_ADDRESS_LIST_URL,
        method: 'GET'
    })

    const [checkoutAddress, setCheckoutAddress] = useState<Addresss | null>(null);
    const [addressList, setAddressList] = useState<Addresss[]>([]);
    const [adddressFormActive, setAadddressFormActive] = useState(false);
    const [adddressListModelActive, setAadddressListModelActive] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (addressesData) {
            setAddressList(addressesData);

            if (!checkoutAddress && addressesData.length > 0) {
                const defaultAddress = addressesData.find((address) => address.isDefault);
                if (defaultAddress) {
                    setCheckoutAddress(defaultAddress);
                }
                else {
                    setCheckoutAddress(addressesData[0]);
                }
            }
        }
    }, [addressesData]);

    const handleAddressModelCLose = () => {
        setAadddressFormActive(false);
    }

    const handleAdddressListModelActive = () => {
        setAadddressListModelActive(false);
    }

    const addresFormSuccess = (data: Addresss) => {
        fetchAddressList();
        handleAddressModelCLose();
        setCheckoutAddress(data)
    }

    const changeCheckoutAddres = (data: Addresss) => {
        setCheckoutAddress(data)
    }

    const handleProceed = () => {
        if (!addressLoading && !checkoutAddress) {
            toast({
                variant: "destructive",
                title: "Delivery Address is required",
                description: 'Please add delivey address',
                className: 'w-auto py-6 px-12 fixed bottom-2 right-2'
            })
            return
        }

        sessionStorage.setItem('payment-page-active', "1");
        navigate('/payment')
    }

    if ((!cart || cart.items.length === 0)) {
        return <Navigate to={'/cart'} />
    }

    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                {cart && cart.items.length > 0 && (
                    <>
                        <SubHeading className="text-left mb-10">Checkout</SubHeading>
                        <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
                            <div className="flex-grow">
                                <div className="mb-4">
                                    <CartList cartItems={cart.items} editable={false} />
                                </div>
                                <div>
                                    <Button onClick={() => navigate('/cart')} variant={"secondary"} className="rounded-full"><ArrowLeft className="me-2" size={20} /> Back to cart</Button>
                                </div>
                            </div>
                            <div className="w-full max-w-[400px] h-max flex flex-col gap-4">
                                <div className={`border px-3 py-2 rounded-xl ${(!addressLoading && !checkoutAddress) && 'border-red-500'}`}>
                                    <h1 className={`text-xl font-medium mb-2 ${(!addressLoading && !checkoutAddress) && 'text-red-500'}`}>Delivery Address</h1>
                                    {addressLoading && (
                                        <>
                                            <div className="mb-5">
                                                <div className="text-gray-400">
                                                    <Skeleton className="h-3 mb-2"></Skeleton>
                                                    <Skeleton className="h-3 w-[80%]"></Skeleton>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {!addressLoading && checkoutAddress ? (
                                        <div className="mb-5">
                                            <div className="text-gray-400">
                                                <div className="font-medium">{checkoutAddress.fullName}</div>
                                                <div>{checkoutAddress.addressLine1}</div>
                                                <div>{checkoutAddress.phone}</div>
                                                <div>
                                                    {checkoutAddress.city + ', ' + checkoutAddress.state + ", " + checkoutAddress.country}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-5">
                                            <div className="text-red-500 font-semibold">
                                                Delivery address is required to proceed.
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-2 flex items-center justify-between">
                                        <Button disabled={addressLoading} onClick={() => setAadddressFormActive(true)} className="rounded-full w-[100px]">Add New</Button>
                                        <Button onClick={() => setAadddressListModelActive(true)} disabled={addressLoading || (!addressLoading && !checkoutAddress)} className="rounded-full w-[100px]">Change</Button>
                                    </div>
                                </div>

                                <div className="border px-3 py-2 rounded-xl">
                                    <h1 className="text-xl font-medium mb-2">Order Summary</h1>

                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Subtotal</p>
                                        <p>{cart.cartTotal.subtotal > 0 ? formatPrice(cart.cartTotal.subtotal) : "-"}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Discount</p>
                                        <p className="text-red-500">{cart.cartTotal.discount > 0 ? cart.cartTotal.discount : '-'}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-center mb-2">
                                        <p className="text-gray-400">Delivery Fee</p>
                                        <p>{cart.orderTotal.deliveryFee > 0 ? formatPrice(cart.orderTotal.deliveryFee) : '-'}</p>
                                    </div>
                                    <div className="font-medium flex justify-between items-centerb border-t py-3">
                                        <p>Total</p>
                                        <p className="font-semibold text-xl">{cart.orderTotal.total > 0 ? formatPrice(cart.orderTotal.total) : '-'}</p>
                                    </div>
                                    <div className="mb-2">
                                        <Button onClick={handleProceed} disabled={(!addressLoading && !checkoutAddress)} className="rounded-full w-full">Proceed to Payment <ArrowRight className="ms-2" size={20} /></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {adddressFormActive && (
                <Dialog open={adddressFormActive} onOpenChange={handleAddressModelCLose}>
                    <DialogContent className="sm:max-w-[500px] h-[80vh] overflow-y-scroll custom-scrollbar">
                        <DialogHeader>
                            <div className="grid gap-2 text-center">
                                <DialogTitle className="text-3xl font-bold">Add Address</DialogTitle>
                                <p className="text-balance text-muted-foreground">
                                    Enter your address details below
                                </p>
                            </div>
                        </DialogHeader>
                        <AddressForm onSuccess={addresFormSuccess} />
                    </DialogContent>
                </Dialog>)
            }

            {adddressListModelActive && (
                <Dialog open={adddressListModelActive} onOpenChange={handleAdddressListModelActive}>
                    <DialogContent className="sm:max-w-[500px] h-[80vh] overflow-y-scroll custom-scrollbar">
                        <DialogHeader>
                            <div className="grid gap-2 text-center">
                                <DialogTitle className="text-3xl font-bold">Select Address</DialogTitle>
                                <p className="text-balance text-muted-foreground">
                                    Select your delivery address
                                </p>
                            </div>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                            {addressList.map(address => (
                                <div key={address._id} onClick={() => changeCheckoutAddres(address)} className={`text-gray-400 border py-2 px-3 rounded-xl cursor-pointer hover:text-blue-500 hover:bg-blue-100 hover:border-2 hover:border-blue-300 ${address._id === checkoutAddress?._id && 'text-blue-500 bg-blue-100 border-2 border-blue-300 cursor-auto'}`}>
                                    <div className="font-medium">
                                        {address.fullName}
                                        {address.isDefault && <span className="ms-2 text-green-500 text-sm bg-green-200 px-2 rounded-full">Default</span>}
                                    </div>
                                    <div>{address.addressLine1}</div>
                                    {address.addressLine2 && (<div>{address.addressLine2}</div>)}
                                    <div>{address.phone}</div>
                                    <div>
                                        {address.city + ', ' + address.state + ", " + address.country}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>)
            }
        </section>
    );
}

export default CheckoutPage;
