import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import {  Response } from 'express'
import { customRequest } from '../middlewares/userMiddleware' 
const prisma = new PrismaClient()

dotenv.config()



export const createBid = async(req : customRequest , res : Response) => {

     const {amount , proposal} = req.body
    const taskId = parseInt(req.params.id)
    const userId = req.userId

    try{
        if(!userId){
            res.status(201).json({
                message : 'user not logged in'
            })
            return;
        }

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })
    
        if(user?.role === 'DEVELOPER'){
            const bid = await prisma.bid.create({
                data : {
                    amount ,
                    proposal,
                    taskId,
                    developerId : userId

                }
            })
        
            res.status(200).json({
                message : 'you bid has been posted to client',
                bid : bid
            })
    
        }else{
            res.status(201).json({
                messsage :'Only developers can post the bids !'
            })
        }
    }catch(error){
        res.status(500).json({
            message :'something went wrong :- ' + error
        })
    }
}


export const acceptBid = async(req : customRequest , res : Response) => {
    
    const taskId = parseInt(req.params.id)
    const {bidId} = req.body
    const userId = req.userId

    try{
        
    // getting the task
    const task = await prisma.task.findUnique({
        where : {
            id : taskId
        }
    })
    if(!task){
        res.status(404).json({
            message : 'invalid Id , Task Not Found'
        })
        return
    }
    // checking if the task belongs to client
    if(task.clientId === userId){

         await prisma.bid.update({
            where : {id : bidId},
            data : {status : 'ACCEPTED'} //accepting the bid
         })


         await prisma.bid.updateMany({
            where : {
                taskId : taskId ,
                id : {not : bidId}
                },
                data : {
                    status : 'REJECTED' // rejecting  all other bid
                }
         })


         res.status(200).json({
            message : 'Bid Accepted'
         })
    }else{
        res.status(403).json({
            message : 'Unauthorized Client !'
        })
    }
}catch(error){
    res.status(500).json({
        message : 'something  went wrong'
    })
}

}



export const getBids = async (req : customRequest , res : Response) => {
    const taskId = parseInt(req.params.id)
    const userId = req.userId


    try{

        const user = await prisma.user.findUnique({
            where : {id : userId},
        })
    
        if(user?.role === 'CLIENT'){
    
            const bids = await prisma.bid.findMany({
                where : {taskId : taskId},
                include : {
                    developer :  true
                }
            })
    
            if(!bids){
                res.status(200).json({
                    message : 'no one posted the bid yet!'
                })
                return
            }
    
            res.status(200).json({
                bids : bids
            })
          
        }else{
            res.status(403).json({
                message : 'Unauthorized ! , only task host can see the bids'
            })
        }
    }catch(error){
        res.status(500).json({
            message : 'something went wrong with getting the bids :-' + error
        })
    }

}


export const getBidsByTaskId = async(req : customRequest , res : Response)=>{

    const taskId = parseInt(req.params.id)

    try{
        const bids = await prisma.bid.findMany({
            where : {
                taskId : taskId,
                status : 'ACCEPTED'
            },
            include : {
                task : true
            }
        })
        if(bids.length === 0){
            res.status(200).json({
                message : 'you did not accepted any bid yet'
            })
            return
        }
    
        res.status(200).json({
            bids : bids
        })
    }catch(error){
        res.status(500).json({
            message : 'something went wrong :- ' + error
        })
    }



}

