import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

export const orderStatusEnum = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const orderProductSchema = new Schema(
  {
    productID: {type: mongoose.Schema.ObjectId, required: true},
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    thumbnail: { type: String, default: null },
    category: {type: String},
    brand: { type: String},
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderedItems: [orderProductSchema],
    orderedAmount: {
      subtotal: { type: Number, required: true },
      deliveryFee: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    status: { type: String, enum: orderStatusEnum, default: "Pending" },
    address: orderAddressSchema,
    paymentMethod: {
      type: String,
      enum: ["debit card", "credit card", "wallet", "cod"],
      required: true,
    },
    orderNumber: { type: String, unique: true },
    deliveryDate: { type: Date, null: true}
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(mongoosePaginate)

const Order = model("Order", orderSchema);

export default Order;
