import {v2 as cloundinary} from 'cloudinary'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

cloundinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

 export const uploadOnCloudinary = async(localFilePath : any) => {

    try{
        if(!localFilePath){
    
            return null
        }
    
        const response = await cloundinary.uploader.upload(localFilePath,{
            resource_type : 'auto',
            access_mode : 'public',  
        })
    
        fs.unlinkSync(localFilePath);
        return response

    }catch(error){

        console.log("something went wrong :- " , error)
        fs.unlinkSync(localFilePath)
    }

}

