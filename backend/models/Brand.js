import mongoose from "mongoose";

const { Schema, model } = mongoose;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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

const Brand = model("Brand", brandSchema);

export default Brand;