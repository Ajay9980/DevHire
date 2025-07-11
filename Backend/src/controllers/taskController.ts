import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import {  Response } from 'express'
import { customRequest } from '../middlewares/userMiddleware' 
const prisma = new PrismaClient()

dotenv.config()

export const createTask = async (req: customRequest, res: Response) => {
   const {title , description , budget } = req.body
    const userId = req.userId
    
    try{

        if(!userId){
            res.status(401).json({
                message : 'user not logged in'
            })
            return;
        }

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })

        if(user?.role === 'CLIENT'){
            await prisma.task.create({
                data : {
                    title , 
                    description ,
                    budget,
                    clientId : userId
                }
            })
        
            res.status(200).json({
                message : 'task posted'
            })

        }else{
            res.status(403).json({
                message : 'you are developer , so you are not allowed to post the task'
            })
        }

    }catch(error){

        console.log(' The Error is:-  ', error)
        res.status(500).json({
            messsage :  error
        })

    }
};

export const getTask = async(req:customRequest , res : Response) => {

     
    try{

            const tasks = await prisma.task.findMany()
        
            res.status(200).json({
                tasks : tasks
            })
        
    }catch(error){
        res.status(500).json({
            message : 'something went wrong:- ' + error
        })
    }
}


export const getTaskById = async(req : customRequest , res : Response)=>{
    const taskId = parseInt(req.params.id)
    try{
        const task = await prisma.task.findUnique({
           where : {id : taskId},
           include : {
            client : true
           }
        })
    
        res.status(200).json({
            task : task
        })
    }catch(error){
        res.status(500).json({
            message : 'something went wrong ' + error
        })
    }


}

export const getMyTasks = async(req : customRequest , res : Response)=>{
    const userId = req.userId
    
    try{
        const task = await prisma.task.findMany({
            where : {
                clientId : userId
            },
            include : {
                client : true
            }
        })
    
        res.status(200).json({
            tasks : task
        })

    }catch(error){
        res.status(500).json({
            messsage : 'something went wrong while get your tasks :- ' + error
        })
    }
}

export const getBidsTasks = async(req : customRequest , res : Response) => {

    const userId = req.userId

    try{
        const tasks = await prisma.bid.findMany({
            where : {
                developerId : userId
            },
            include : {
                task : true
            }
        })
    
        res.status(200).json({
            tasks : tasks
        })

    }catch(error){

        res.status(500).json({
            message : 'someting went wrong while getting BidsTasks :- ' + error
        })
    }
}


export const markComplete = async(req : customRequest , res : Response) => {

    const userId = req.userId
    const taskId = parseInt(req.params.id)

    const task = await prisma.task.findUnique({
        where : {
            id : taskId
        }
    })

    if(task?.clientId !== userId){
        res.status(403).json({
            message : "Unauthorized user!"
        })
        return
    }


    const updatedTask = await prisma.task.update({
        where : { id : taskId},
        data : {status : 'COMPLETED'}
    })

    res.status(200).json({
        message : 'your task has been completed',
        updatedTask : updatedTask
    })
}