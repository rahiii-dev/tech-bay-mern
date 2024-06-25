import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const userProfile = asyncHandler( async (req, res) => {
     /*  
        Route: GET api/profile
        Purpose: See user Profile
    */
   const user = await User.find({_id : req.user?._id}).select('-password');
   console.log(user);
   console.log(req.user);
   if(user){
       return res.json(user)
   }

   return res.status(404).json({message : 'User not found'})
})