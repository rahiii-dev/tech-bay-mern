import asyncHandler from "express-async-handler";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transactions.js";

/*  
    Route: GET api/user/wallet
    Purpose: get user wallet
    Access: Private
*/
export const getUserWallet = asyncHandler(async (req, res) => {
    const wallet = await Wallet.findOne({user: req.user._id});
    return res.json(wallet);
}); 

/*  
    Route: GET api/user/wallet/history
    Purpose: get user wallet history
    Access: Private
*/
export const getUserWalletHistory = asyncHandler(async (req, res) => {
    const walletHistory = await Transaction.find({user: req.user._id, paymentMethod: 'wallet'}).sort({createdAt: -1}).populate({
        path: 'order',
        select: 'orderNumber'
    });
    return res.json(walletHistory);
}); 