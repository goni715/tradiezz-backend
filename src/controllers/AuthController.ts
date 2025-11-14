import config from "../config";
import LoginAdminService from "../services/auth/LoginAdminService";
import LoginUserService from "../services/auth/LoginUserService"
import RegisterEmployerService from "../services/auth/RegisterEmployerService";
import asyncHandler from "../utils/asyncHandler";



const registerEmployer = asyncHandler(async (req, res) => {
    const result = await RegisterEmployerService(req.body);
    res.status(201).json({
        success: true,
        message: result.message,
        data: null
    })
})


const loginUser = asyncHandler(async (req, res) => {
    const result = await LoginUserService();
    res.status(200).json({
        success: true,
        message: "Login Success",
        data: result
    })
})


const loginAdmin = asyncHandler(async (req, res) => {
    const { message, accessToken, refreshToken } = await LoginAdminService(req.body);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, 
        secure: config.node_env === "production", 
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        sameSite: "strict", // Prevents CSRF attacks
    });

    res.status(200).json({
        success: true,
        message: message || "Login Success",
        data: {
            accessToken
        }
    })
})




const AuthController = {
    registerEmployer,
    loginUser,
    loginAdmin
}

export default AuthController;