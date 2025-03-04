import jwt from "jsonwebtoken";
import sharedModels from "../models/index.js"; 
import envConfig from "../env.config.js";
import sharedUtils from "../utils/index.js";

const { User } = sharedModels;
const { ApiErrorResponse } = sharedUtils;

const verifyJwt = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return ApiErrorResponse(401, "Authorization header required", next)
      
    const token = authHeader.split(" ")[1];

    // const token = req.header('Authorization')?.split(' ')[1];
    // console.log(token);
    if (!token) return ApiErrorResponse(401, "Access token required", next) 
    const decodedToken = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password"); //find user and remove password from response
    if (!user) return ApiErrorResponse(404, "User not found. Please log in again.", next)
       
    req.user = user;
    next();
    
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    next(error)
  }
};

export default verifyJwt;
