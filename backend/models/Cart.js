import mongoose from "mongoose";

const { Schema, model } = mongoose;


const cartItemSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    items : [cartItemSchema]
}, {
    timestamps: true
})

const Cart = model('Cart', cartSchema);

export default Cart;