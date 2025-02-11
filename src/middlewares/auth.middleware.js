import jwt from "jsonwebtoken";
import sharedModels from "../models/index.js"; 

const { User } = sharedModels;
const verifyJwt = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ status: false, message: "Authorization header required" });
    }
    const token = authHeader.split(" ")[1];

    // const token = req.header('Authorization')?.split(' ')[1];
    // console.log(token);
    if (!token)
      res.status(401).json({ status: false, message: "access token required" });

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid Access Token!" });
    }

    const user = await User.findById(decodedToken?._id).select("-password"); //find user and remove password from response
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found jwt" });
    }
    req.user = user;
    next();
    
  } catch (error) {
    console.error(error);
    if (error) {
      // Token has expired, return a 401 status code
      return res
        .status(401)
        .json({
          status: false,
          message: `Access token has expired at ${error}`,
        });
    } else {
      // Other errors, return a 500 status code
      console.error(error);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
  }
};

export default verifyJwt;
