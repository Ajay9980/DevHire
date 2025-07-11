import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import {  Response } from 'express'
import { customRequest } from '../middlewares/userMiddleware'
import { uploadOnCloudinary } from '../utils/cloudinary'
 
 
const prisma = new PrismaClient()

dotenv.config()


export const uploadTaskFile = async(req : customRequest , res : Response) =>{
    
        const taskId = parseInt(req.params.id)
        const developerId = req.userId
    
        if (!developerId) {
            res.status(401).json({ message: 'Unauthorized. Developer ID missing.' });
            return;
        }
        const bid = await prisma.bid.findFirst({
            where : {
                developerId : developerId,
                taskId : taskId,
                status : 'ACCEPTED'
            }
        })
    
        if(!bid){
            res.status(403).json({
                message  : 'you are not allowed to upload for this task'
            })
            return;
        }
    
        // Safely extract the uploaded files array from req.files (since we're using multer.fields)
        // Then get the path of the first uploaded file (assuming 'files' is the field name)
        const files = (req.files as { [fieldname: string]: Express.Multer.File[] })?.files;
        const filePath = files?.[0]?.path;
    
    
        if(!filePath){
            res.status(400).json({
                message : 'Select the files'
            })
            return;
        }
    
        const file = await uploadOnCloudinary(filePath)
    
        if (!file?.url) {
             res.status(400).json({
            message: "File upload failed",
            });
            return
        }
    
        const submission = await prisma.taskSubmission.create({
            data : {
                taskId : taskId,
                developerId : developerId,
                fileUrl : file?.url
            }
        })
    
        await prisma.task.update({
            where : {id : taskId},
            data : {
                status : 'SUBMITTED'
            }
        })
    
    
        res.status(200).json({
            message : 'Task Submitted',
            submittedTask : submission
        })
    
}


export const getFileUrl = async (req : customRequest , res : Response)=>{

    const taskId = parseInt(req.params.id)

    try{
        const file = await prisma.taskSubmission.findFirst({
            where : {
                taskId : taskId
            }
        })
        if(!file){
            res.status(404).json({
                message : 'file  not found'
            })
        }
    
        res.status(200).json({
            file : file
        })

    }catch(error){
        message : 'someting went wrong with getting file url:- ' + error
    }
    

}