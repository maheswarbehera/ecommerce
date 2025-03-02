import mongoose from "mongoose"; 
import { logger } from "../middlewares/index.js";
import envConfig from "../env.config.js";
import os from 'os';

const connectDb = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${envConfig.MONGO_DB_URI}/${envConfig.DB_NAME}`);
        if(connectionInstance.connection.host == 'localhost'){
            logger.warn(`[${os.hostname}] ${envConfig.NODE_ENV} Environment `);
            logger.info(`[${os.hostname}] ⚙️  MongoDB connected local server !! DB HOST: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`);
        }else{
            logger.warn(`${envConfig.NODE_ENV} Environment `);
            logger.info(`[${os.hostname}] ⚙️  MongoDB connected atlas server !! DB HOST: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`); 
        } 

        mongoose.connection.on("disconnected", () => {
            logger.error("❌ MongoDB Disconnected! Reconnecting...");
            connectDb(); // Auto-reconnect
        });
        mongoose.connection.on("error", (err) => {
            logger.error(`🚨 MongoDB Error: ${err.message}`);
        });
    } catch (error) {
        logger.error(`[${os.hostname}] MONGODB connection FAILED ${error.name}`);
        process.exit(1);
        
    }
}

export default connectDb;