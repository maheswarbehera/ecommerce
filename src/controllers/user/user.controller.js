import sharedUtils from "../../utils/index.js";
import sharedModels from "../../models/index.js";

const { User } = sharedModels;
const { ApiSuccessResponse, ApiErrorResponse, asyncHandler, sendMail } = sharedUtils;

const registerUser = asyncHandler(async(req, res, next) => {
  const { username, email, password } = req.body;
  if(!(username && password && email)) return ApiErrorResponse(422, "All fields are required", next);
  
  const existuser = await User.findOne({
    $or: [
      {username: username.toLowerCase()},
      {email: email.toLowerCase()}
    ]
  });

  if(existuser) return ApiErrorResponse( 409, "username already exists", next);
  // const hashedPassword = await bcrypt.hash(password, 8);
  const user = await User.create({
    username: username.toLowerCase(),
    password,
    email: email.toLowerCase()
  })
  
  if (user) return await sendMail.register(user.email, user.username); 

  return ApiSuccessResponse(res, 201, user, "user created successfully");
})

const loginUser = asyncHandler(async(req, res, next) => {
  const { username, password } = req.body;
  if(!(username && password)) return ApiErrorResponse( 422, "Username and password are required", next);
  
  const user = await User.findOne({username: username.toLowerCase()});
  if(!user) return res.status(404).json({status: false, message: "User does not exist."});

  // const isPasswordValid = await bcrypt.compare(password, user.password);
  // if (!isPasswordValid) {
  //     return res.status(400).json({ status: false, message: "Invalid password." });
  // }
  const isPasswordValid = await user.isPasswordCorrect(password); 
  if (!isPasswordValid) return ApiErrorResponse( 401, "Invalid password", next);
  
  // const accessToken = jwt.sign(
  //     { id: user._id,
  //         username: user.username },
  //     process.env.ACCESS_TOKEN_SECRET,
  //     // { expiresIn: '1h' }
  //   );
  const loggedInUser = await User.findById(user._id).select("-password")
  const accessToken = user.generateAccessToken();

  res.header("Authorization", accessToken)
  // .cookie("accessToken", accessToken)
  user.logNum += 1
  user.lastLogin = Date.now()
  await user.save();

  return ApiSuccessResponse(res, 200,{user: loggedInUser, accessToken}, "User Login Successfull");
})

const GetById = asyncHandler( async (req, res, next) => {
  const { id } = req.params;
  if (!id) return ApiErrorResponse(422, "User ID is required", next);
  const user = await User.findById(id);
  if (!user) return ApiErrorResponse(404, "User not found", next);
  return ApiSuccessResponse(res, 200, {user}, "User fetched successfully");   
});
  
const getCurrentUser = asyncHandler( async( req, res, next) => {
  return res.status(200).json({ user: req.user, status: true, message: "Current user fetched successfully"});
});

const logoutUser = asyncHandler (async (req, res, next) => {
  res.setHeader("Authorization", " ").status(200).json({ status: true,message: 'User logged out successfully'});
});

const allUser = asyncHandler(async(req, res, next) => {
  const users = await User.find();
  if(users.length === 0) return ApiErrorResponse(404, "No user found", next);
  return ApiSuccessResponse(res, 200, {users}, "all user fetched successfully"); 
});

const userRole = asyncHandler( async(req, res, next) => {
  const {userId} = req.body;
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
  if(result.length === 0) return ApiErrorResponse(404, "User not found", next);
  return ApiSuccessResponse(res, 200, {result}, "User role fetched successfully");
});

const clearCache = async (req,res) =>{

  
}

export const userController = { registerUser, loginUser, logoutUser, getCurrentUser, GetById, allUser, userRole };
