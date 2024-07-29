import asyncHandler from "express-async-handler";
import Wishlist from "../models/Wishlist.js";
import handleErrorResponse from "../utils/handleErrorResponse.js";

/*  
    Route: GET api/user/wishlist
    Purpose: get user wishlist
*/
export const getWishList = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({user: req.user._id}).populate({
    path: "products",
    select: "name price brand category images thumbnail stock description",
    populate: { path: "brand category", select: "name" },
  });

  if (!wishlist) {
    return handleErrorResponse(res, 404, "Wishlist not found");
  }

  return res.json(wishlist);
});

/*  
    Route: POST api/user/wishlist
    Purpose: add product to user wishlist
*/
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, products: [productId] });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    } else {
      return handleErrorResponse(res, 404, "Product already in wishlist");
    }
  }

  await wishlist.save();
  console.log(wishlist);
  res.status(200).json({ message: "Product added to wishlist", wishlist });
});

/*  
    Route: PUT api/user/wishlist/remove?productId=productId
    Purpose: delet item from wishlist
*/
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.query;

  console.log(productId);

  if (!productId) {
    return handleErrorResponse(res, 404, "productId is required.");
  }

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (wishlist) {
    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== productId
    );

    await wishlist.save();
    res
      .status(200)
      .json({ message: "Product removed from wishlist", wishlist });
  } else {
    return handleErrorResponse(res, 404, "Wishlist not found");
  }
});
