// auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
    token: string | jwt.JwtPayload;
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
                throw new Error('Authentication token is missing');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET) as { _id: string; name: string; isShopkeeper: boolean };
            (req as CustomRequest).token = decoded;

            next();
        } catch (err) {
            res.status(401).send('Please authenticate');
        }
    };
}
