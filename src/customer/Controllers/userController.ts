import { Request, Response } from 'express';
import {UserService} from '../Services/userServices'
// import { CustomRequest } from '../middleware/auth';

export class UserController {
    private userService : UserService;
    constructor(){
        this.userService = new UserService();
    }
    
  public  async loginOne(req: Request, res: Response) {
    try {
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
  public  async check(req: Request, res: Response) {
    try {
      console.log("inside  check register controller succes after authenication")
      res.status(200).send('Inserted successfully');
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
