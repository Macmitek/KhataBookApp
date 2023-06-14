import express, { Request, Response } from "express";
import connectDb from "../../common/mongoconfig";
import { UserController } from "../Controllers/userController";
import { AuthMiddleware } from "../../common/auth";

export class userRouter{
  public router: express.Router;
  private userController: UserController;
  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

   private  initializeRoutes(): void {
    console.log("inside userrouter::");

    this.router.post("/user/register", this.userController.registerOne.bind(this.userController));
    this.router.post("/user/login", this.userController.loginOne.bind(this.userController));
    this.router.post("/user/:userId/transactions", AuthMiddleware.auth, this.userController.addTransaction.bind(this.userController));
    this.router.get("/user/:userId/transactions", AuthMiddleware.auth, this.userController.getTransactionDetails.bind(this.userController));
    
  }
}
