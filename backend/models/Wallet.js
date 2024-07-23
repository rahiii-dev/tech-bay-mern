import mongoose from "mongoose";

const {Schema, model} = mongoose

const walletSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Wallet = model("Wallet", walletSchema);

export default Wallet;
