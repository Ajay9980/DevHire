 
import { customRequest } from "../middlewares/userMiddleware";
import { Response } from "express";
import dotenv from 'dotenv'
dotenv.config()
 
export const rewrite = async(req : customRequest , res : Response)=>{

    const {text} = req.body
    if(!text){
        res.status(400).json({
            message : 'Text is Required'
        })
        return
    }


    try{
         
    const prompt = `Rewrite the following freelance proposal to be clear, concise, and professional in just 3-4 lines. Highlight strengths, skills, and the value you offer. Return only the improved, shortened proposal:\n\n"${text}"`;

        const payload = {
            contents : [{
                role : 'user',
                parts : [{text : prompt}]
            }]
        }
    
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
        const response = await fetch(apiUrl , {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(payload)
        })
    
        const result = await response.json();
    
        const rewrittenText = result?.candidates[0].content?.parts?.[0].text
        res.json({ rewrittenText });


    }catch(error){

        res.status(500).json({
            message : 'something went wrong with rewrite method:- ' + error
        })
    }
        
}