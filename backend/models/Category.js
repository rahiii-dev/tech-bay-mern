import mongoose from "mongoose";
import { capitalize } from '../utils/helpers/appHelpers.js';
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      set: capitalize
    },
    description: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

categorySchema.methods.restore = function () {
  this.isDeleted = false;
  return this.save();
};

categorySchema.plugin(mongoosePaginate)

const Category = model("Category", categorySchema);

export default Category;
