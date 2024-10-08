import mongoose from "mongoose";
import { capitalize } from '../utils/helpers/appHelpers.js';
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

const brandSchema = new Schema(
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

brandSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

brandSchema.methods.restore = function () {
  this.isDeleted = false;
  return this.save();
};

brandSchema.plugin(mongoosePaginate)

const Brand = model("Brand", brandSchema);

export default Brand;