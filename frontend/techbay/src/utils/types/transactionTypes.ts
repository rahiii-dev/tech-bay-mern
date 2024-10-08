import { Order } from "./orderTypes";

export type TransactionType = 'CREDIT' | 'DEBIT';
export type PaymentMethod = "debit card"| "credit card"| "wallet"| "cod";

export interface Transaction {
  _id: string;
  user: string; 
  type: TransactionType;
  amount: number;
  description: string;
  transactionNumber: string;
  order: Order;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}
