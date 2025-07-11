import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request,Response,NextFunction } from 'express'
dotenv.config()

export interface customRequest extends Request {
    userId? : number;
}

export async function userMiddleware(req : customRequest ,res : Response, next : NextFunction){
    const token = req.cookies.token

    if (!token) {
         res.status(401).json({
            message: 'Unauthorized: No token provided'
        })

        return
    }

    try{

        
            const decoded = jwt.verify(token , process.env.JWT_SECRET as string) as JwtPayload
            if(!decoded){
                res.status(401).json({
                    message : 'user not signed in'
                })
                return;
            }
        
            const userId = decoded.userId
            req.userId = userId
            next()
    }catch(error){
        res.status(500).json({
            message : 'something went wrong with the usermiddleware'
        })
    }
}
