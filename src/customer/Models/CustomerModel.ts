import { Document, Schema, model } from "mongoose";

export interface ICustomerDocument extends Document {
    user: Schema.Types.ObjectId;
    transactionDetails: {
      type: 'debit' | 'credit';
      amount: number;
      timestamp: Date;
    }[];
  }
  
  const CustomerSchema: Schema<ICustomerDocument> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    transactionDetails: [{
      type: {
        type: String,
        enum: ['debit', 'credit'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
  });
  
  export const CustomerModel = model<ICustomerDocument>('Customer', CustomerSchema);