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

    this.router.post("/register", this.userController.registerOne.bind(this.userController));
    this.router.post("/login", this.userController.loginOne.bind(this.userController));
    this.router.get("/testing", AuthMiddleware.auth,this.userController.check.bind(this.userController));
    
  }
}
