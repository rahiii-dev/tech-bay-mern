import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
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

categorySchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

categorySchema.methods.restore = function () {
  this.isDeleted = false;
  return this.save();
};

const Category = model("Category", categorySchema);

export default Category;
