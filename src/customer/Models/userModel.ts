import { Schema, model, Document } from "mongoose";
import * as bcrypt from "bcrypt";
const saltRounds = 8;

export interface I_UserDocument extends Document {
    name: string;
    password: string;
   }
   const UserSchema: Schema<I_UserDocument> = new Schema({
    name: { type: String, unique: true },
    password: { type: String },
   });

   UserSchema.pre('save', async function (next) {
    const user = this as I_UserDocument;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, saltRounds);
      console.log("hashed ::",user.password)
    }
    next();
  });

const UserModel = model<I_UserDocument>('User', UserSchema);
export default UserModel;