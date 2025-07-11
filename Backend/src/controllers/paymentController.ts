import { PrismaClient } from "@prisma/client";
import { customRequest } from "../middlewares/userMiddleware";
import { Response } from "express";
import Razorpay from "razorpay";
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient

const razorpay = new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET
})

export const createPaymentOrder = async(req : customRequest , res : Response)=>{

 
    const taskId = parseInt(req.body.taskId)
    const bidId = parseInt(req.body.bidId)

    try{

        const bid = await prisma.bid.findUnique({
            where : {id : bidId},
            include : {task : true}
        })
    
        if(!bid){
            res.status(404).json({
                message : 'bid not Found '
            })
            return
        }
    
        const amount = bid?.amount * 100
        const developerId = bid?.developerId
        const order = await razorpay.orders.create({
            amount,
            currency : 'INR',
            receipt : `receipt_${taskId}_${bidId}`
        })
    
    
        await prisma.payment.create({
            data : {
                taskId : taskId ,
                bidId : bidId,
                developerId : developerId,
                amount : bid.amount,
                razorpayOrderId : order.id,
                status : 'CREATED'
            }
        })
    
        res.status(200).json({
            order : order,

        })

    }catch(error){

        res.status(500).json({
            message : 'something went wrong with creating payment :- ' + error
        })
    }


}



export const verifyPayment = async(req : customRequest , res : Response)=>{

    const {
        razorpay_order_id ,
        razorpay_payment_id,
        razorpay_signature
    } = req.body

    try{


        const hmac = crypto
        .createHmac('sha256',process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
    
    
    
        if(hmac !== razorpay_signature) {
    
            res.status(400).json({ success : false , message : 'invalid signature'})
            return
        }
    
        const payment = await prisma.payment.findFirst({
            where : {razorpayOrderId : razorpay_order_id}
        })

          if (!payment) {
          res.status(404).json({ message: 'Payment not found' });
          return
        }   
    
        await prisma.payment.update({
            where : {id : payment?.id},
            data : {
                razorpayPaymentId : razorpay_payment_id,
                razorpaySignature : razorpay_signature,
                status : 'PAID'
            }
        })
        await prisma.task.update({
            where : {id : payment?.taskId},
            data : { status : 'IN_PROGRESS'}
        })
    
        res.status(200).json({
            success : true , message : 'payment  verified and accepted'
        })
    }catch(error){
        
        res.status(500).json({
            message : 'something went wrong with verifying the payment:- ' + error
        })
    }


}


export const getUserPayment = async(req : customRequest , res : Response)=>{

    const developerId = req.userId

    try{
        const total = await prisma.payment.aggregate({
            _sum : {
                amount : true
            },
            where : {
                developerId : developerId,
                status : 'PAID'
            }
        })

        if(total._sum.amount === null){
            res.status(200).json({
                earnings : 0,
            })
            return
        }
    
        res.status(200).json({
            earnings : total._sum.amount, 
        })

    }catch(error){
        res.status(200).json({
            message : 'someting went wrong  with getting user payment :- ' + error
        })
    }
}