import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
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