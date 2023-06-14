import { Document, Schema, model } from "mongoose";

export interface IShopkeeperDocument extends Document {
    user: Schema.Types.ObjectId;
    customers: Schema.Types.ObjectId[];
  }
  
  const ShopkeeperSchema: Schema<IShopkeeperDocument> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    customers: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
  });
  
  export const ShopkeeperModel = model<IShopkeeperDocument>('Shopkeeper', ShopkeeperSchema);
  