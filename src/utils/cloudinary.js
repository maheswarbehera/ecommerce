import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import envConfig from "../env.config.js"

cloudinary.config({ 
    cloud_name: envConfig.CLOUDINARY_CLOUD_NAME, 
    api_key: envConfig.CLOUDINARY_API_KEY, 
    api_secret: envConfig.CLOUDINARY_API_SECRET_KEY
  });

const uploadOnCloudinary = async(localFilePath) => {
    try {
       if(!localFilePath) return null;
  
        const response = await cloudinary.uploader.upload(localFilePath, {
            public_id: `ecommerce_${Date.now()}`,
            resource_type: "auto",
        })
        console.log("file uploaded - ", response.url);
        fs.unlinkSync(localFilePath)
        return response
       
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export {uploadOnCloudinary}