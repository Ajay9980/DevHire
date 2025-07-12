import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { Request , Response } from 'express'
import { customRequest } from '../middlewares/userMiddleware'
import { uploadOnCloudinary } from '../utils/cloudinary'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

dotenv.config()

export const signup = async (req: Request, res: Response) => {
  const { email, password, name, role  } = req.body;

  try {

    const saltRounds = 10

    const hashedPassword = await bcrypt.hash(password , saltRounds)

    const files = (req.files as {[fieldname : string] : Express.Multer.File[]})?.files
    const filePath = files?.[0].path

     
    console.log(filePath)

    if(!filePath){
      res.status(404).json({
        message : 'file not found'
      })
      return
    }

    const file = await uploadOnCloudinary(filePath)
    console.log(file)


    const user = await prisma.user.create({
      data: {
        email,
        password : hashedPassword,
        name,
        role,
        imgurl : file?.url
      }
    });

    res.status(201).json({
      message: "User Created",
      user: user
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      message: "Something went wrong :- " + error
    });
  }
};


export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    });

    if(!user){
      res.status(404).json({
        message :'user not found'
      })
      return
    }

    const isMatch = await bcrypt.compare(password , user?.password)

    if(!isMatch){
      res.status(403).json({
      message :'invalid password'
      })
      return 
    }
    if (isMatch) {
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).json({
        message: "User signed in successfully"
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong: " + error
    });
  }
};



export const signout = async(req : customRequest , res : Response)=>{


  try{
    res.clearCookie('token',{
      httpOnly : true , 
      sameSite : 'lax',
      secure : false
    })
  
    res.status(200).json({
      message : 'user signed out successfully'
    })

  }catch(error){
    res.status(500).json({
      message : 'something went wrong :-  '+ error
    })
  }
}

export const getUserById = async(req : customRequest , res : Response) => {

  const userId = req.userId
  try{
    const user = await prisma.user.findUnique({
        where  : {
          id : userId
        },
        include : {
          bids : true
        }
    })
  
    res.status(200).json({
      user : user
    })

  }catch(error){
    res.status(500).json({
      message : 'something went wrong while fetching the user, :- ' + error
    })
  }

}


export const uploadUserImg = async(req : customRequest , res : Response)=>{
    
    const userId = req.userId

    const files = (req.files as {[fieldname : string] : Express.Multer.File[]})?.files
    const filePath = files?.[0].path

    if(!filePath){
      res.status(404).json({
        message : 'file path is required'
      })
    }

    const file = await uploadOnCloudinary(filePath)

    if(!file?.url){
      res.status(500).json({
        message : 'uploading the image failed'
      })
      return
    }

    await prisma.user.update({
      where : {id : userId},
      data : {
        imgurl : file?.url
      }
    })

    res.status(200).json({
      message : 'user image uploaded successfully'
    })
}
