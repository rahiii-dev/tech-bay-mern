export const ACTIVE_PRODUCT_PIPELINE = [
    {
      $lookup: {
        from: "categories",
        foreignField: "_id",
        localField: "category",
        as: "category",
      },
    },
    {$unwind : '$category'},
    {
      $lookup: {
        from: "brands",
        foreignField: "_id",
        localField: "brand",
        as: "brand",
      },
    },
    {$unwind : '$brand'},
    {
      $match: {
        isActive: true,
        "category.isDeleted": false,
        "brand.isDeleted": false,
      },
    },
  ]