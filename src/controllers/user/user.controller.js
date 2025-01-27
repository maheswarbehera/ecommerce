import { User } from "../../models/user/user.model.js";
import mongoose from "mongoose";
import { ApiSuccessResponse } from "../../utils/ApiResponse.js";
import { ApiErrorResponse } from "../../utils/ApiError.js";
import sendMail from "../../utils/email.js";
import { logger } from "../../middlewares/winston.js";

const registerUser = async(req, res, next) => {
    const { username, password } = req.body;
    if(!(username && password)){
        // return res.status(400).json(new ApiError(400, "Username and password are required"));
        return ApiErrorResponse(400, "Username and password are required" , next)
    }
    const existuser = await User.findOne({username: username.toLowerCase()}) 
    if(existuser){
        return ApiErrorResponse( 400, "username already exists" , next)
    }
    // const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
        username: username.toLowerCase(),
        password 
    })
    
    
    const sendTestEmail = async () => {
      try {
        const info = await sendMail({
          from: 'ffmahesh6@gmail.com',
          to: "maheswarbehera439@gmail.com",
          subject: "User Registration Successful",
          text: "You have successfully registered!",
          html: "<b>You have successfully registered!</b>",
        });
        logger.info(`Email sent successfully , ${info.messageId}`);
      } catch (error) {
        logger.error("Failed to send email:", error);
      }
    };
  
    if (user) {
      // await sendTestEmail();
    }
    
    return ApiSuccessResponse(res, 200, user, "user created successfully")
    return ApiSuccessResponse(res, 200, user, "user created successfully")
    // return res.status(200).json( new ApiResponse(200, user, "user created successfully"))
    // res.status(200).json({user, status: true, message: "user created successfully"})
    return ApiSuccessResponse(res, 200, user, "user created successfully") 
    // return res.status(200).json( new ApiResponse(200, user, "user created successfully"))
    // res.status(200).json({user, status: true, message: "user created successfully"})
}

const loginUser = async(req, res, next) => {
    const { username, password } = req.body;
    if(!(username && password)){
      return ApiErrorResponse( 400, "Username and password are required", next)
    }
    const user = await User.findOne({username: username.toLowerCase()});
    if(!user){
        return res.status(404).json({status: false, message: "User does not exist."})
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //     return res.status(400).json({ status: false, message: "Invalid password." });
    // }
    const isPasswordValid = await user.isPasswordCorrect(password);
    // console.log(password, user.password, isPasswordValid)
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
  const {userId} = req.body 

  const result = await User.aggregate([
    {
        $match: { _id: new mongoose.Types.ObjectId(userId) } 
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