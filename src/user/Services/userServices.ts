import { UserModel, IUserDocument, ITransaction } from '../Models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CustomRequest } from '../../common/auth';
import { ShopkeeperModel } from "../../shopkeeper/Models/ShopKeeperModel";
import { CustomerModel } from "../../customer/Models/CustomerModel";
import { ConnectDb } from '../../common/mongoconfig';

export class UserService {
  private db: ConnectDb;

  constructor() {
    this.db = ConnectDb.getInstance();
  }

  public async register(user: any): Promise<void> {
    try {
      await this.db.connect();
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

  public async login(user: any): Promise<{ user: IUserDocument, token: string }> {
    try {
      await this.db.connect();
      const foundUser = await UserModel.findOne({ name: user.name });

      if (!foundUser) {
        throw new Error('Name of user not found');
      }

      const isMatch = bcrypt.compareSync(user.password, foundUser.password);

      if (isMatch) {
        const token = jwt.sign({
          _id: foundUser._id?.toString(),
          name: foundUser.name,
          isShopkeeper: foundUser.isShopkeeper
        }, process.env.JWT_SECRET, {
          expiresIn: '2 days',
        });

        return { user: foundUser, token: token };
      } else {
        throw new Error("password is not correct");
      }
    } catch (error) {
      throw error;
    }
  }

  public async addTransaction(userId: string, transaction: ITransaction, loggedInUser: { _id: string; isShopkeeper: boolean }): Promise<void> {
    try {
      await this.db.connect();
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (loggedInUser.isShopkeeper) {
        const customer = await CustomerModel.findById(user.customer);

        if (!customer) {
          throw new Error('Customer not found');
        }

        customer.transactionDetails.push(transaction);
        await customer.save();
      } else {
        throw new Error('User is not a shopkeeper');
      }
    } catch (error) {
      throw error;
    }
  }

  public async getTransactionDetails(userId: string): Promise<ITransaction[] | { customer: string; transactions: ITransaction[] }[] |undefined> {
    try {
        await this.db.connect();
        console.log("UserID:", userId);

        // Step 1: Find the user based on the provided user ID
        const user = await UserModel.findById(userId);
        console.log("User:", user);

        if (!user) {
            throw new Error('User not found');
        }

        // Step 2: Check if the user is a shopkeeper
        if (user.isShopkeeper) {
            // console.log("User is a shopkeeper");
            // throw new Error('User is a shopkeeper, cannot retrieve transaction details');
            console.log("inside getalltransactions data");
            await this.db.connect();
      
            // Step 1: Find all customers
            const customers = await CustomerModel.find();
            console.log("all customers : ",customers)
            // Step 2: Iterate over each customer and retrieve their transaction details
            const transactionsPerCustomer: { customer: string; transactions: ITransaction[] }[] = [];
      
            for (const customer of customers) {
                transactionsPerCustomer.push({
                    customer: customer._id.toString(), // Convert ObjectId to string
                    transactions: customer.transactionDetails,
                });
            }
      
            return transactionsPerCustomer;

        } else {
            // Step 3: If the user is a customer, find the corresponding customer
            console.log("User is a customer");
            const customer = await CustomerModel.findById(user.customer);

            console.log("Customer:", customer);

            if (!customer) {
                throw new Error('Customer not found');
            }

            // Step 4: Retrieve transaction details for the customer
            return customer.transactionDetails;
        }
    } catch (error) {
        throw error;
    }
}

}
