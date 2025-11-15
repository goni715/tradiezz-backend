import CustomError from "../../errors/CustomError";
import UserModel from "../../models/UserModel";

const ChangeStatusService = async (userId: string, status: 'active' | 'blocked') => {

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new CustomError(404, "userId not found");
    }

    //check user is not verified
    if (!user.isVerified) {
        throw new CustomError(403, "This user account is not verified");
    }

    await UserModel.updateOne(
        { _id: userId },
        { status }
    );

    return {
        message: `User has been ${status === "active" ? "activated" : "blocked"} successfully.`
    };
}

export default ChangeStatusService;
