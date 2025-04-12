import { useEffect, useState } from "react";
import Logout from "../../components/auth/Logout";
import SubHeading from "../../components/User/SubHeading";
import useAxios from "../../hooks/useAxios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { USER_ADDRESS_DELETE_URL, USER_ADDRESS_LIST_URL, USER_PROFILE_URL, USER_WALLET_URL } from "../../utils/urls/userUrls";
import { Addresss } from "../../utils/types/addressTypes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import AddressForm from "../../components/User/AddressForm";
import { User } from "../../features/auth/authTypes";
import UserUpdateForm from "../../components/User/UserUpdateForm";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";
import { ArrowRight, Plus, Trash } from "lucide-react";
import axios from "../../utils/axios";
import { toast } from "../../components/ui/use-toast";
import { Input } from "../../components/ui/input";
import { Wallet } from "../../utils/types/walletTypes";
import { formatPrice } from "../../utils/appHelpers";

const ProfilePage = () => {
    const { data: profileData, fetchData: fetchProfile } = useAxios<User>({
        url: USER_PROFILE_URL,
        method: 'GET'
    }, false)

    const { data: addressesData, fetchData: fetchAddressList } = useAxios<Addresss[]>({
        url: USER_ADDRESS_LIST_URL,
        method: 'GET'
    }, false);

    const { data: walletData, fetchData: fetchWalletData } = useAxios<Wallet>({
        url: USER_WALLET_URL,
        method: 'GET'
    }, false);

    const [activeSide, setActiveSide] = useState("profile");
    const [adddressFormType, setAadddressFormType] = useState("add");
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
    const [modelActive, setModelActive] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (activeSide === "profile") {
            fetchProfile()
        } else if (activeSide === "address") {
            fetchAddressList();
        } else if (activeSide === "wallet") {
            fetchWalletData();
        }

    }, [activeSide])

    const handlesideActive = (activeSide: string) => {
        setActiveSide(activeSide)
    }

    const handleCloseModel = () => {
        setModelActive(false);
        setSelectedAddress(null)
    }

    const handleAddresFormSuccess = () => {
        fetchAddressList();
        handleCloseModel()
    }

    const handleAddressFormType = (type: string, id: string | null = null) => {
        if (type === "edit") {
            setSelectedAddress(id)
        }
        setAadddressFormType(type);
        setModelActive(true);
    }

    const handleProfileFormSuccess = () => {
        fetchProfile();
        handleCloseModel();
    }

    const handleDeleteAddress = async (event: React.MouseEvent<HTMLDivElement>, addressId: string) => {
        event.stopPropagation();
        try {
            await axios.delete(USER_ADDRESS_DELETE_URL(addressId));
            toast({
                variant: "default",
                title: `Address deleted successfully.`,
                description: "",
                className: "bg-green-500 text-white rounded w-max shadow-lg fixed right-3 bottom-3",
            });
            fetchAddressList();
            handleCloseModel();
        } catch (error) {
            console.error(error);
        }
    }

    const handleWalletHistory = () => {
        navigate('/wallet-history')
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
                        <div onClick={() => handlesideActive("change-pass")} className={`bg-gray-100 ${activeSide === "change-pass" && 'bg-primary text-primary-foreground'} w-full py-3 px-2 font-medium rounded-md cursor-pointer hover:bg-primary hover:text-primary-foreground`}>Change Password</div>
                        <div className="w-full">
                            <Logout className="bg-gray-100 text-primary justify-start w-full py-3 px-2 font-medium rounded-md hover:bg-primary hover:text-primary-foreground">Logout</Logout>
                        </div>
                    </div>

                    <div className="flex-grow bg-primary text-primary-foreground rounded-2xl px-5 py-4">
                        {activeSide === "profile" && (
                            <>
                                <div className="flex justify-between items-center pb-3 border-b border-primary-foreground">
                                    <h1 className="font-medium text-lg">Your Profile</h1>
                                    <div>
                                        <Button onClick={() => handleAddressFormType("add")} variant={"secondary"} size={"sm"}>Edit Profile</Button>
                                    </div>
                                </div>

                                {profileData && (
                                    <div className="mt-3">
                                        <h1 className="text-lg mb-2"><span className="font-medium">Name:</span> {profileData.fullName}</h1>
                                        <h1 className="text-lg mb-2"><span className="font-medium">Email:</span> {profileData.email}</h1>
                                        <h1 className="text-lg mb-2"><span className="font-medium">Phone:</span> {profileData.phone_no}</h1>
                                    </div>
                                )}
                            </>
                        )}
                        {activeSide === "address" && (
                            <>
                                <div className="flex justify-between items-center pb-3 border-b border-primary-foreground">
                                    <h1 className="font-medium text-lg">Your Addresses</h1>
                                    <div>
                                        <Button onClick={() => handleAddressFormType("add")} variant={"secondary"} size={"sm"}>Add New</Button>
                                    </div>
                                </div>
                                {addressesData && addressesData.length === 0 && <h1 className="mt-3 text-center text-lg font-medium">Add a Shipping Address</h1>}
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    {addressesData && addressesData.map(address => (
                                        <div key={address._id} onClick={() => handleAddressFormType("edit", address._id)} className={`relative text-primary-foreground border py-2 px-3 rounded-xl cursor-pointer hover:text-blue-500 hover:bg-blue-100 hover:border-2 hover:border-blue-300`}>
                                            <div className="font-medium">
                                                <span>{address.fullName}</span>
                                                {address.isDefault && <span className="ms-2 text-green-600 text-sm bg-green-200 px-2 rounded-full">Default</span>}
                                            </div>
                                            <div onClick={(event) => handleDeleteAddress(event, address._id)} className="absolute right-0 top-0 z-10 p-2">
                                                <Trash size={20} className="text-red-400" />
                                            </div>
                                            <div>{address.addressLine1}</div>
                                            {address.addressLine2 && (<div>{address.addressLine2}</div>)}
                                            <div>{address.phone}</div>
                                            <div>
                                                {address.city + ', ' + address.state + ", " + address.country}
                                            </div>
                                            {address.addressType && (
                                                <div className="text-gray-400 font-medium text-sm">
                                                    Type: {address.addressType.toLocaleUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>

                        )}
                        {activeSide === "wallet" && (
                            <>
                                <div className="flex justify-between items-center pb-3 border-b border-primary-foreground">
                                    <h1 className="font-medium text-lg">My Wallet</h1>
                                    <h1 className="font-medium text-lg">{walletData && `Balance: ${formatPrice(walletData.balance)}`}</h1>
                                </div>
                                {walletData ? (
                                    <div className="py-3">
                                        <div className="flex gap-4 py-3">
                                            <Input className="text-primary rounded-full max-w-[220px]" placeholder="Enter amouont" />
                                            <Button variant={"secondary"} className="rounded-full flex items-center gap-2"><Plus size={18} /><span>Add Money</span></Button>
                                        </div>

                                        <div className="mt-3">
                                            <Button onClick={handleWalletHistory} variant={"secondary"} className="rounded-full flex items-center gap-2"><span>Wallet History</span><ArrowRight size={18} /></Button>
                                        </div>
                                    </div>
                                ) : (
                                    <h1 className="text-center py-3">No Wallet Found</h1>
                                )}
                            </>
                        )}
                        {activeSide === "change-pass" && (
                            <>
                                <div className="flex justify-between items-center pb-3 border-b border-primary-foreground">
                                    <h1 className="font-medium text-lg">Change Password</h1>
                                </div>
                                <div className="py-3 max-w-[500px] mx-auto">
                                    <ChangePasswordForm />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={modelActive} onOpenChange={handleCloseModel}>
                <DialogContent className="sm:max-w-[500px] h-[80vh] overflow-y-scroll custom-scrollbar">
                    <DialogHeader>
                        {activeSide === "profile" && (
                            <div className="grid gap-2 text-center">
                                <DialogTitle className="text-3xl font-bold">Update Profile</DialogTitle>
                                <p className="text-balance text-muted-foreground">
                                    Upate your profile details below
                                </p>
                            </div>
                        )}
                        {activeSide === "address" && (
                            <div className="grid gap-2 text-center">
                                <DialogTitle className="text-3xl font-bold">{adddressFormType === "edit" ? "Edit Address" : "Add Address"}</DialogTitle>
                                <p className="text-balance text-muted-foreground">
                                    {adddressFormType === "edit" ? "Upate your address details below" : "Enter your address details below"}
                                </p>
                            </div>
                        )}
                    </DialogHeader>
                    {activeSide === "profile" && profileData && (
                        <UserUpdateForm profileDetails={profileData} onSuccess={handleProfileFormSuccess} />
                    )}
                    {activeSide === "address" && (
                        <AddressForm onSuccess={handleAddresFormSuccess} addressId={selectedAddress} />
                    )}

                </DialogContent>
            </Dialog>
        </section>
    );
}

export default ProfilePage;
