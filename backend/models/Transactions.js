import mongoose from 'mongoose';
import { PAYMENT_METHODS } from './Order.js';

const {Schema, model} = mongoose;

const TransactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
  paymentId: { type: String, null: true }
}, {
    timestamps: true
});

const Transaction = model('Transaction', TransactionSchema);

export default Transaction;
