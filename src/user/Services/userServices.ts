import connectDb from "../../common/mongoconfig";
import { UserModel, IUserDocument, ITransaction } from '../Models/userModel'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CustomRequest } from '../../common/auth';
import { ShopkeeperModel } from "../../shopkeeper/Models/ShopKeeperModel";
import { CustomerModel } from "../../customer/Models/CustomerModel";

export class UserService {
  public async register(user: any) {
    await connectDb.connect();
    try {
      const createdUser = await UserModel.create(user);

      if (createdUser.isShopkeeper) {
        const shopkeeper = await ShopkeeperModel.create({ user: createdUser._id });
        createdUser.shopkeeper = shopkeeper._id;
      } else {
        const customer = await CustomerModel.create({ user: createdUser._id });
        createdUser.customer = customer._id;
      }

      await createdUser.save();
    } catch (error) {
      throw error;
    }
  }
   public async login(user: any) {
    await connectDb.connect();
    try {
      console.log("inside login check service",user)
      const foundUser = await UserModel.findOne({ name: user.name});
      if(!foundUser){
        console.log("inside login check service user not found")
        throw new Error('Name of user not found');
      }
      const isMatch = bcrypt.compareSync(user.password, foundUser.password);
      if(isMatch){

        console.log("Match found of user password !!");

        const token = jwt.sign({ _id: foundUser._id?.toString(), 
                                  name: foundUser.name,
                                  isShopkeeper: foundUser.isShopkeeper},process.env.JWT_SECRET, {
          expiresIn: '2 days',
        });
   
        return { user: {_id: foundUser._id, name: foundUser.name , isShopkeeper: foundUser.isShopkeeper}, token: token };
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
  
  public async addTransaction(userId: string, transaction: ITransaction, loggedInUser: { _id: string; isShopkeeper: boolean }) {
    await connectDb.connect();
    try {
      const user = await UserModel.findById(userId);
      console.log("userid id :",userId,user)

      if (!user) {
        console.log("user not found")
        throw new Error('User not found');
      }
      if ( loggedInUser.isShopkeeper) {
        const customer = await CustomerModel.findById(user.customer);
        if (!customer) {
          console.log("customer not found")
          throw new Error('Customer not found');
        }
        customer.transactionDetails.push(transaction);
        await customer.save();
      } else {
        console.log("user is not a shopkeeper")
        throw new Error('User is not a shopkeeper');
      }
    } catch (error) {
      throw error;
    }
  }

  public async getTransactionDetails(userId: string): Promise<ITransaction[] | undefined> {
    await connectDb.connect();
    try {
     
      const user = await UserModel.findById(userId);
      if (!user) {
       
        throw new Error('User not found');
      }
      if (user.isShopkeeper) {
        const customer = await CustomerModel.findById(user.customer);
        if (!customer) {
          throw new Error('Customer not found');
        }
        return customer.transactionDetails;
      } else {
        throw new Error('User is not a shopkeeper');
      }
    } catch (error) {
      throw error;
    }
  }
}
