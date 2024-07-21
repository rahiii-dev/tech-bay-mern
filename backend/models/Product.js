import mongoose from "mongoose";
import { capitalize } from "../utils/helpers/appHelpers.js";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { generateFileURL } from "../utils/helpers/fileHelper.js";

const { Schema, model } = mongoose;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, set: capitalize },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String, required: true }],
    thumbnail: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    isFeatured: {type: Boolean, default: false},
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ProductSchema.methods.softDelete = function () {
  this.isActive = false;
  return this.save();
};

ProductSchema.methods.restore = function () {
  this.isActive = true;
  return this.save();
};

ProductSchema.virtual('imageUrls').get(function() {
  return this.images.map((img) => generateFileURL(img));
});

ProductSchema.virtual('thumbnailUrl').get(function() {
  return generateFileURL(this.thumbnail)
});

ProductSchema.plugin(mongoosePaginate)
ProductSchema.plugin(aggregatePaginate)

export default model("Product", ProductSchema);
