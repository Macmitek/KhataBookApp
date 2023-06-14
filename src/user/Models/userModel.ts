import { Document, Schema, model } from "mongoose";
import * as bcrypt from "bcrypt";
import { ShopkeeperModel } from "../../shopkeeper/Models/ShopKeeperModel";
import { CustomerModel } from "../../customer/Models/CustomerModel";

const saltRounds = 8;

export interface ITransaction {
  type: 'debit' | 'credit';
  amount: number;
  timestamp: Date;
}

export interface IUserDocument extends Document {
  name: string;
  password: string;
  isShopkeeper: boolean;
  shopkeeper?: Schema.Types.ObjectId;
  customer?: Schema.Types.ObjectId;
}
const UserSchema: Schema<IUserDocument> = new Schema({
  name: { type: String, unique: true },
  password: { type: String },
  isShopkeeper: { type: Boolean, default: false },
  shopkeeper: { type: Schema.Types.ObjectId, ref: 'Shopkeeper' },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
});

UserSchema.pre('save', async function (next) {
  const user = this as IUserDocument;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, saltRounds);
    console.log("hashed ::", user.password);
  }
  next();
});
UserSchema.methods.addTransaction = function (transaction: ITransaction) {
  if (this.isShopkeeper) {
    const shopkeeperId = this.shopkeeper;
    ShopkeeperModel.findByIdAndUpdate(shopkeeperId, { $push: { customers: this.customer } }).exec();
    CustomerModel.findByIdAndUpdate(this.customer, { $push: { transactionDetails: transaction } }).exec();
  }
};

UserSchema.methods.getTransactionDetails = function () {
  if (!this.isShopkeeper) {
    return CustomerModel.findById(this.customer).exec();
  }
  return [];
};

export const UserModel = model<IUserDocument>('User', UserSchema);
