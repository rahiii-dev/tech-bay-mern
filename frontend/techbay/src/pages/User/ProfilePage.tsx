import { useEffect, useState } from "react";
import Logout from "../../components/auth/Logout";
import SubHeading from "../../components/User/SubHeading";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { USER_ADDRESS_LIST_URL } from "../../utils/urls/userUrls";
import { Addresss } from "../../utils/types/addressTypes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import AddressForm from "../../components/User/AddressForm";

const ProfilePage = () => {
    const { data: addressesData, fetchData: fetchAddressList } = useAxios<Addresss[]>({
        url: USER_ADDRESS_LIST_URL,
        method: 'GET'
    }, false)
    const [activeSide, setActiveSide] = useState("profile");
    const [adddressFormActive, setAadddressFormActive] = useState(false);
    const [adddressFormType, setAadddressFormType] = useState("add");
    const [selectedAddress, seSelectedAddress] = useState<string | null>(null)

    useEffect(() => {
        if (activeSide === "address") {
            fetchAddressList();
        }
    }, [activeSide])

    const handlesideActive = (activeSide: string) => {
        setActiveSide(activeSide)
    }

    const handleAddresFormSuccess = () => {
        fetchAddressList();
        setAadddressFormActive(false);
    }

    const handleAddressFormType = (type: string, id: string | null = null) => {
        if (type === "edit") {
            seSelectedAddress(id)
        }
        setAadddressFormType(type);
        setAadddressFormActive(true);
    }


    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                <SubHeading className="text-left mb-10">User Profile</SubHeading>
                <div className="flex gap-6 mb-6">
                    <div className="flex flex-col gap-2 w-full max-w-[200px]">
                        <div onClick={() => handlesideActive("profile")} className={`bg-gray-100 ${activeSide === "profile" && 'bg-primary text-primary-foreground'}  shadow-sm w-full py-3 px-2 font-medium rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground`}>Profile</div>
                        <div onClick={() => handlesideActive("address")} className={`bg-gray-100 ${activeSide === "address" && 'bg-primary text-primary-foreground'} w-full py-3 px-2 font-medium rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground`}>Shipping Address</div>
                        <div onClick={() => handlesideActive("wallet")} className={`bg-gray-100 ${activeSide === "wallet" && 'bg-primary text-primary-foreground'} w-full py-3 px-2 font-medium rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground`}>My Wallet</div>
                        <Link to={'/orders'} className="bg-gray-100 w-full py-3 px-2 font-medium rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground">My orders</Link>
                        <div className="w-full">
                            <Logout className="bg-gray-100 text-primary justify-start w-full py-3 px-2 font-medium rounded-md hover:bg-primary hover:text-primary-foreground">Logout</Logout>
                        </div>
                    </div>

                    <div className="flex-grow bg-primary text-primary-foreground rounded-2xl px-5 py-4">
                        {activeSide === "address" && (
                            <>
                                <div className="flex justify-between items-center pb-3 border-b border-primary-foreground">
                                    <h1 className="font-medium text-lg">Your Addresses</h1>
                                    <div>
                                        <Button onClick={() => handleAddressFormType("add")} variant={"secondary"} size={"sm"}>Add New</Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    {addressesData && addressesData.map(address => (
                                        <div key={address._id} onClick={() => handleAddressFormType("edit", address._id)} className={`text-primary-foreground border py-2 px-3 rounded-xl cursor-pointer hover:text-blue-500 hover:bg-blue-100 hover:border-2 hover:border-blue-300`}>
                                            <div className="font-medium">
                                                {address.fullName}
                                                {address.isDefault && <span className="ms-2 text-green-600 text-sm bg-green-200 px-2 rounded-full">Default</span>}
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
                            </>

                        )}
                    </div>
                </div>
            </div>

            <Dialog open={adddressFormActive} onOpenChange={setAadddressFormActive}>
                <DialogContent className="sm:max-w-[500px] h-[80vh] overflow-y-scroll custom-scrollbar">
                    <DialogHeader>
                        <div className="grid gap-2 text-center">
                            <DialogTitle className="text-3xl font-bold">{adddressFormType === "edit" ? "Edit Address" : "Add Address"}</DialogTitle>
                            <p className="text-balance text-muted-foreground">
                                {adddressFormType === "edit" ? "Upate your address details below" : "Enter your address details below"}
                            </p>
                        </div>
                    </DialogHeader>
                    <AddressForm onSuccess={handleAddresFormSuccess} addressId={selectedAddress} />
                </DialogContent>
            </Dialog>)
        </section>
    );
}

export default ProfilePage;
