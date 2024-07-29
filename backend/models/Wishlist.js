import mongoose from 'mongoose';

const { Schema } = mongoose;

const WishlistSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Wishlist', WishlistSchema);
