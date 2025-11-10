import LoginAdminService from "../services/auth/LoginAdminService";
import LoginUserService from "../services/auth/LoginUserService"
import asyncHandler from "../utils/asyncHandler";




const loginUser = asyncHandler(async (req, res) => {
    const result = await LoginUserService();
    res.status(200).json({
        success: true,
        message: "Login Success",
        data: result
    })
})


const loginAdmin = asyncHandler(async (req, res) => {
    const result = await LoginAdminService(req.body);
    res.status(200).json({
        success: true,
        message: "Login Success",
        data: result
    })
})




const AuthController = {
    loginUser,
    loginAdmin
}

export default AuthController;