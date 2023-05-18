import jwt , { Secret, JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


export interface CustomRequest extends Request {
    token: string | JwtPayload;
  }

  export class AuthMiddleware {
    public static auth = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
  
        if (!token) {
            console.log("error foubnd token is not matched")
          throw new Error();
        }
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        (req as CustomRequest).token = decoded;
  
        next();
      } 
      catch (err) {
         console.log("Please authenticate again")
        res.status(401).send('Please authenticate');
      }
    };
  }