import { User } from "../../models/user/user.model.js";
import {Role } from "../../models/user/role.model.js"
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiResponse, ApiSuccessResponse } from "../../utils/ApiResponse.js";
import { ApiError, ApiErrorResponse } from "../../utils/ApiError.js";

const registerUser = async(req, res, next) => {
    const { username, password } = req.body;
    if(!(username && password)){
        // return res.status(400).json(new ApiError(400, "Username and password are required"));
        return ApiErrorResponse(400, "Username and password are required" , next)
    }
    const existuser = await User.findOne({username})

    if(existuser){
        return ApiErrorResponse( 400, "username already exists" , next)
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
        username: username.toLowerCase(),
        password : hashedPassword
    })
    return ApiSuccessResponse(res, 200, user, "user created successfully")
    // return res.status(200).json( new ApiResponse(200, user, "user created successfully"))
    // res.status(200).json({user, status: true, message: "user created successfully"})
}

const loginUser = async(req, res, next) => {
    const { username, password } = req.body;
    if(!(username && password)){
      return ApiErrorResponse( 400, "Username and password are required", next)
    }
    const user = await User.findOne({username})
    if(!user){
        return res.status(404).json({status: false, message: "User does not exist."})
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //     return res.status(400).json({ status: false, message: "Invalid password." });
    // }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return ApiErrorResponse( 400, "Invalid password", next)
    }

    // const accessToken = jwt.sign(
    //     { id: user._id,
    //         username: user.username },
    //     process.env.ACCESS_TOKEN_SECRET,
    //     // { expiresIn: '1h' }
    //   );
    const accessToken = user.generateAccessToken()


    res.header("Authorization", accessToken)
    // .cookie("accessToken", accessToken)
   
    // .status(200).json({user: user,accessToken, status: true, message: "User Login Successfull"})
    return ApiSuccessResponse(res, 200,{user, accessToken}, "User Login Successfull")
}
const GetById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate id exists in params
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "User ID is required",
        });
      }
  
      // Fetch the user by ID
      const user = await User.findById(id);
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }
  
      // Send success response
      res.status(200).json({
        status: true,
        user,
        message: "User fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching user by ID:", error.message);
  
      // Handle server errors
      res.status(500).json({
        status: false,
        message: "An error occurred while fetching the user",
      });
    }
  };

  
const getCurrentUser = async(req, res) => { 
    return res.status(200).json({ user: req.user, status: true, message: "Current user fetched successfully"})
}

const logoutUser = async (req, res) => {
    res.setHeader("Authorization", " ").status(200).json({ status: true,message: 'User logged out successfully' });
}

const allUser = async(req, res) => {
    const users = await User.find()
    res.status(200).json({users,status: true, message: "all user fetched successfully"})
}

const userRole = async(req, res) => {
  const {userId} = req.body // Replace with the actual user ID

  // // Find roles created by the user
  // const roles = await Role.find({ createdBy: userId }).populate("createdBy", "username"); // Populate only the username field;
  
  // if (roles.length > 0) {
  //     console.log("User  Roles:", roles);
  // } else {
  //     console.log("No roles found for this user.");
  // };


  const result = await User.aggregate([
    {
        $match: { _id: new mongoose.Types.ObjectId(userId) } // Match the user by ID
    },
    {
        $lookup: {
            from: "roles", // Collection to join (Role)
            localField: "_id", // Field from User 
            foreignField: "createdBy", // Field from Role
            as: "role" // Output array field
        }
    },
    {
        $project: {
            username: 1, // Include username
            role: {
                name: 1, // Include role name
                createdAt: 1 // Include role creation date
            },
            _id: 0 // Exclude the _id field
        }
    }
]);
    return res.status(200).json({result, })
}
const clearCache = async (req,res) =>{

  
}

const userController = { registerUser, loginUser, logoutUser, getCurrentUser, GetById, allUser, userRole };
export default userController;