import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.schema.js"

const generateAccessAndRefereshTokens = async(userId) => {
    console.log("user id here:",userId)
    try {
        const user = await User.findById(userId)
        if (!user){
            throw new ApiError(401,"Invalid User")
        }
        console.log("user here:",user)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return {accessToken , refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access tokens")
        
    }
}
const registerUser = asyncHandler(async (req, res, next) => {
    try {
      const { name, email, password} = req.body;

      // Validate required fields
      if ([name, email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, 'All fields are required')
      }
      
  
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Email already exists." });
      }
      
      const user = await User.create({
        name,
        email,
        password
      });
      
      res.status(201).json({ message: "User registered successfully.", user });
    } catch (error) {
      throw new ApiError(500, 'Server Error')
    }
  });


  
  const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!password) {
      throw new ApiError(400, "Password is required");
    }
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
  
    const existedUser = await User.findOne({ email });
  
    if (!existedUser) {
      throw new ApiError(400, "User does not exist");
    }
  
    const isPasswordValid = await existedUser.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid User Credentials");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(existedUser._id);
    const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken");
  
    const options = {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: "none",
      secure: true,
    };
  
    // Set cookies and return user data
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser, // Include user ID in the response
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  });
  
const refreshAccessToken = asyncHandler(async(req, res) => { 
    const incomingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshtoken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshtoken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        
        if(!user){
            throw new ApiError(401, "Invalid RefreshToken")
        }
    
        if(incomingRefreshtoken !== user.refreshToken){
            throw new ApiError(401, "refreshToken is expired or used")
        }
    
        const options = {
            httpOnly: true
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndRefereshTokens(user._id)
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newrefreshToken},
                "Acccess token Refreshed"
    
            )
        )
    } 
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})
export  {registerUser,generateAccessAndRefereshTokens,loginUser}