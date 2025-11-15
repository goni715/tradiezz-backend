import { EmployerValidFields } from "../constant/user.constant";
import GetEmployersService from "../services/user/GetEmployersService";
import asyncHandler from "../utils/asyncHandler";
import pickValidFields from "../utils/pickValidFields";


const getEmployers = asyncHandler(async (req, res) => {
    const validatedQuery = pickValidFields(req.query, EmployerValidFields);
    const result = await GetEmployersService(validatedQuery);
    res.status(200).json({
        success: true,
        message: 'Employers are retrieved successfully',
        meta: result.meta,
        data: result.data
    })
})



const UserController = {
    getEmployers
}

export default UserController;