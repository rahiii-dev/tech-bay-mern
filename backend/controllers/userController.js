import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import { ACTIVE_PRODUCT_PIPELINE } from "../utils/pipelines/product.js";
import { handleProduct } from "./productController.js";
import { generateFileURL } from "../utils/helpers/fileHelper.js";
import { escapeRegex } from "../utils/helpers/appHelpers.js";
import { ProductOffer } from "../models/Offer.js";
import { calculateFinalPrice, calculateOfferDiscount } from "../utils/offerCalculators.js";

const productSortMap = new Map([
  ["relavence", {name: 1}],
  ["new", {createdAt: 1}],
  ["feautured", {isFeatured: true}],
  ["l-h", {price: -1}],
  ["h-l", {price: 1}],
]);

/*  
        Route: GET api/profile
        Purpose: See user Profile
*/
export const userProfile = asyncHandler(async (req, res) => {
  const user = await User.find({ _id: req.user?._id }).select("-password");
  console.log(user);
  console.log(req.user);
  if (user) {
    return res.json(user);
  }

  return res.status(404).json({ message: "User not found" });
});

/*  
    Route: GET api/user/home
    Purpose: send data for user home page
*/
export const userHome = asyncHandler(async (req, res) => {
  const NEWEST_PRODUCT_PIPELINE = [
    ...ACTIVE_PRODUCT_PIPELINE,
    {
      $match : {stock : {$gt : 0}}
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: 4,
    },
  ];

  const TOP_PRODUCT_PIPELINE = [
    ...ACTIVE_PRODUCT_PIPELINE,
    {
      $match : {stock : {$gt : 0}}
    },
    {
      $sort: { createdAt: 1 },
    },
    {
      $limit: 4,
    },
  ];

  const newest_products = await Product.aggregate(NEWEST_PRODUCT_PIPELINE);
  const top_products = await Product.aggregate(TOP_PRODUCT_PIPELINE);

  newest_products.forEach((product) => {
    product.thumbnail = generateFileURL(product.thumbnail);
    product.images = product.images.map((image) => generateFileURL(image));
  });

  top_products.forEach((product) => {
    product.thumbnail = generateFileURL(product.thumbnail);
    product.images = product.images.map((image) => generateFileURL(image));
  });

  return res.json({
    newest_products,
    top_products,
  });
});

/*  
    Route: GET api/user/products
    Purpose: list products for user and filter according to query
*/
export const userProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, categories, brands, sort } = req.query;

  const pipeline = [...ACTIVE_PRODUCT_PIPELINE];

  if (search) {
    const regTerm = escapeRegex(search.trim());
    pipeline.push({
      $match: { name: { $regex: regTerm, $options: "i" } },
    });
  }

  if (categories) {
    const categoryNames = categories.split(',').map(cat => cat.trim());
    pipeline.push({
      $match: {
        "category.name": { $in: categoryNames },
      },
    });
  }

  if (brands) {
    const brandNames = brands.split(',').map(brand => brand.trim());
    pipeline.push({
      $match: {
        "brand.name": { $in: brandNames },
      },
    });
  }

  if(sort && productSortMap.has(sort)){
    if(sort === "feautured"){
      pipeline.push({
        $match: productSortMap.get(sort)
      })
    }else {
      pipeline.push({
        $sort: productSortMap.get(sort)
      })
    }
  }

 pipeline.push(
    {
      $project: {
        name: 1,
        description: 1,
        stock: 1,
        isFeatured: 1,
        price: 1,
        thumbnail: 1,
        "category.name": 1,
      },
    }
  );
  

  const myCustomLabels = {
    totalDocs: "totalProducts",
    docs: "products",
  };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: myCustomLabels,
    lean: true,
  };

  const aggregate = Product.aggregate(pipeline);
  const result = await Product.aggregatePaginate(aggregate, options);

  for (const prod of result.products) {
    const discount = await calculateOfferDiscount(prod._id);
    prod.offerDiscount = discount;
    prod.finalPrice = calculateFinalPrice(prod.price, discount);
  }


  result.products.forEach((product) => {
    product.thumbnail = generateFileURL(product.thumbnail);
  });

  return res.json(result);
});


/*  
    Route: GET api/user/product/:id
    Purpose: get product using product id
*/
export const userGetProductDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id) {
    const product = await Product.findOne({ _id: id });
    
    if (product) {
      let related_products = await Product.find({
        _id: { $ne: product.id },
        category: product.category,
        isActive: true,
      });

      related_products = await Promise.all(related_products.map(async (prod) => {
        const prodObject = prod.toObject();
        prodObject.thumbnail = generateFileURL(prodObject.thumbnail);
        prodObject.images = prodObject.images.map((image) => generateFileURL(image));
      
        const discount = await calculateOfferDiscount(prodObject._id);
        prodObject.offerDiscount = discount;
        prodObject.finalPrice = calculateFinalPrice(prodObject.price, discount);
      
        return prodObject;
      }));

      const highestDiscount = await calculateOfferDiscount(id);
      console.log(highestDiscount);
      const finalPrice = calculateFinalPrice(product.price, highestDiscount);

      const result = {
        product: {
          ...product.toObject(),
          imageUrls: product.imageUrls,
          thumbnailUrl: product.thumbnailUrl,
          offerDiscount: highestDiscount,
          finalPrice: finalPrice,
        },
        related_products,
      };

      return res.json(result);
    }
  }

  return res.json({ product: {}, related_products: [] });
});
/*  
    Route: GET api/user/categories
    Purpose: list categories for user
*/
export const userCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isDeleted: false });
  return res.json(categories);
});

/*  
    Route: GET api/user/brand
    Purpose: list active for user
*/
export const userBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ isDeleted: false });
  return res.json(brands);
});
