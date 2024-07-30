import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minAmount: {
      type: Number,
      required: true,
    },
    maxAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

couponSchema.methods.softDelete = function () {
  this.isActive = false;
  return this.save();
};

couponSchema.methods.restore = function () {
  this.isActive = true;
  return this.save();
};

couponSchema.plugin(mongoosePaginate)

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
