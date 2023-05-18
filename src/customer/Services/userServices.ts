import  DocumentDefinition from 'mongoose';
import UserModel,{I_UserDocument} from '../Models/userModel'
import connectDb from "../../common/mongoconfig";
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';

export class UserService {
   public async register(user: any) {
    await connectDb.connect();
    try {
        console.log("inside register inside userService")
        await UserModel.create(user);
      } catch (error) {
        throw error;
      }
  }

   public async login(user: any) {
    await connectDb.connect();
    try {
      console.log("inside login check service")
      const foundUser = await UserModel.findOne({ name: user.name});
      if(!foundUser){
        console.log("inside login check service user not found")
        throw new Error('Name of user not found');
      }
      const isMatch = bcrypt.compareSync(user.password, foundUser.password);
      if(isMatch){

        console.log("Match found of user password !!");

        const token = jwt.sign({ _id: foundUser._id?.toString(), name: foundUser.name },process.env.JWT_SECRET, {
          expiresIn: '2 days',
        });
   
        return { user: {_id: foundUser._id, name: foundUser.name }, token: token };
        // return foundUser
      } 
      else{
        console.log("inside login check service wrong password")
        throw new Error("password is not correct")
      }
    } catch (error) {
      throw error;
    }
  }
}
