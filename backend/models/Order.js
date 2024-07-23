import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

export const ORDER_STATUS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];

export const PAYMENT_METHODS = ["debit card", "credit card", "wallet", "cod"];

const RETURN_PERIOD_DAYS = 10;

const orderProductSchema = new Schema(
  {
    productID: { type: mongoose.Schema.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    thumbnail: { type: String, default: null },
    category: { type: String },
    brand: { type: String },
    quantity: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    cancelReason: { type: String, default: null },
    returned: { type: Boolean, default: false },
    returnReason: { type: String, default: null },
    returnConfirmed: { type: Boolean, default: false },
    returnConfirmationDate: { type: Date, default: null },
  },
  { 
    _id: false, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

orderProductSchema.virtual('canCancel').get(function () {
  if ((this.ownerDocument().status === 'Pending' || this.ownerDocument().status === 'Processing') && !this.cancelled) {
    return true;
  }
  return false;
});

orderProductSchema.virtual('canReturn').get(function () {
  if (this.ownerDocument().status === 'Delivered' && !this.returned) {
    const currentDate = new Date();
    const deliveryDate = this.ownerDocument().deliveryDate;
    if (deliveryDate && (currentDate - deliveryDate) / (1000 * 60 * 60 * 24) <= RETURN_PERIOD_DAYS) {
      return true;
    }
  }
  return false;
});

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
  { 
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
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
    status: { type: String, enum: ORDER_STATUS, default: "Pending" },
    address: orderAddressSchema,
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
    orderNumber: { type: String, unique: true },
    deliveryDate: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

orderSchema.plugin(mongoosePaginate);

orderSchema.methods.cancelItem = function (productID, reason) {
  const item = this.orderedItems.find(
    (item) => item.productID.toString() === productID.toString()
  );
  if (item) {
    if (item.canCancel) {
      item.cancelled = true;
      item.cancelReason = reason;
      return this.save();
    }
    throw new Error("Item cannot be cancelled");
  }
  throw new Error("Item not found in the order");
};

orderSchema.methods.returnItem = function (productID, reason) {
  const item = this.orderedItems.find(
    (item) => item.productID.toString() === productID.toString()
  );
  if (item) {
    if (item.canReturn) {
      item.returned = true;
      item.returnReason = reason;
      return this.save();
    }
    throw new Error("Item cannot be returned");
  }
  throw new Error("Item not found in the order");
};

orderSchema.methods.confirmReturn = function (productID) {
  const item = this.orderedItems.find(
    (item) => item.productID.toString() === productID.toString()
  );
  if (item && item.returned && !item.returnConfirmed) {
    item.returnConfirmed = true;
    item.returnConfirmationDate = new Date();
    return item;
  }
  throw new Error("Return cannot be confirmed or item not found");
};

const Order = model("Order", orderSchema);

export default Order;
