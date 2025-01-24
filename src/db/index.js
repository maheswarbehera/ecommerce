import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../middlewares/winston.js";

dotenv.config({path: './.env'})

const DB_NAME = process.env.DB_NAME;    
const MONGO_URI = process.env.MONGO_DB_URI; 
const connectDb = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
        if(connectionInstance.connection.host == 'localhost'){
            logger.info(`⚙️  MongoDB connected local server !! DB HOST: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`);
        }else{
            logger.info(`⚙️  MongoDB connected atlas server !! DB HOST: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`); 
        } 
    } catch (error) {
        logger.error("MONGODB connection FAILED ", error);
        process.exit(1);
        
    }
}

export default connectDb;