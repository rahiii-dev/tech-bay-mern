import { useEffect } from "react";
import SubHeading from "../../components/User/SubHeading";
import useAxios from "../../hooks/useAxios";
import { Transaction } from "../../utils/types/transactionTypes";
import { USER_WALLET_HISTORY_URL } from "../../utils/urls/userUrls";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { TableCell } from "@mui/material";
import { formatDate, formatPrice } from "../../utils/appHelpers";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";

const WalletHistoryPage = () => {
    const { data: walletHistoryData } = useAxios<Transaction[]>({
        url: USER_WALLET_HISTORY_URL,
        method: 'GET'
    });

    console.log(walletHistoryData);

    const navigate = useNavigate();

    useEffect(() => {
        if (walletHistoryData && walletHistoryData.length === 0) {
            navigate(-1);
        }
    }, [walletHistoryData])


    return (
        <section>
            <div className="container border-t-2 border-gray-100 py-6">
                {(walletHistoryData && walletHistoryData.length > 0) && (
                    <>
                        <div className="flex justify-between items-center">
                            <SubHeading className="text-left mb-10">Wallet History</SubHeading>
                            <div>
                                <Button onClick={() => navigate(-1)} variant={"outline"} size={"sm"} className="gap-2 text-xs rounded-full border-none"><ArrowLeft size="18" /> Go Back</Button>
                            </div>
                        </div>
                        <div>
                            <Table className="w-full overflow-x-scroll">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold">Transaction ID</TableHead>
                                        <TableHead className="font-bold">Date</TableHead>
                                        <TableHead className="font-bold">Type</TableHead>
                                        <TableHead className="font-bold">Description</TableHead>
                                        <TableHead className="font-bold">Order ID</TableHead>
                                        <TableHead className="font-bold">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {walletHistoryData.map(data => (
                                        <TableRow key={data._id}>
                                            <TableCell>#{data.transactionNumber}</TableCell>
                                            <TableCell>{formatDate(data.createdAt)}</TableCell>
                                            <TableCell>{data.type}</TableCell>
                                            <TableCell>{data.description}</TableCell>
                                            <TableCell>{data.order ? <span className="font-medium">#{data.order.orderNumber}</span> : '-'}</TableCell>
                                            <TableCell className={`text-nowrap ${data.type === "CREDIT" ? 'text-green-600' : 'text-red-500'}`}>{data.type === "CREDIT" ? `+ ${formatPrice(data.amount)}` : `- ${formatPrice(data.amount)}`}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}

            </div>
        </section>
    );
}

export default WalletHistoryPage;
