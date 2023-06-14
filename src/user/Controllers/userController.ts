import { Request, Response } from 'express';
import {UserService} from '../Services/userServices'
import { CustomRequest } from '../../common/auth';
// import { CustomRequest } from '../middleware/auth';

export class UserController {
    private userService : UserService;
    constructor(){
        this.userService = new UserService();
    }
    
  public  async loginOne(req: Request, res: Response) {
    try {
      console.log("rewquest login boidy ::" , req.body);
      const foundUser = await this.userService.login(req.body);
      res.status(200).send(foundUser);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  public  async registerOne(req: Request, res: Response) {
    try {
      console.log("inside register controller")
      await this.userService.register(req.body);
      res.status(200).send('Inserted successfully');
    } catch (error) {
      return res.status(500).send(error);
    }
  }
 
  public async addTransaction(req: Request, res: Response) {
    try {
      console.log("incoming req :",req.params.userId,req.body)
      const userId  = req.params.userId;
      const transaction = req.body;
      const loggedInUser = (req as CustomRequest).token as { _id: string; isShopkeeper: boolean };

      await this.userService.addTransaction(userId, transaction, loggedInUser);
      res.status(200).send('Transaction added successfully');
    } catch (error) {
      return res.status(500).send("User is not authorised to add transaction");
    }
  }

  public async getTransactionDetails(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const transactions = await this.userService.getTransactionDetails(userId);
      res.status(200).send(transactions);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
