/* eslint-disable @typescript-eslint/no-explicit-any */
import { Secret } from "jsonwebtoken";
import config from "../../config";
import { UserRole } from "../../constant/user.constant";
import { IAdmin } from "../../interfaces/admin.interface";
import AdminModel from "../../models/AdminModel";
import createToken, { TExpiresIn } from "../../utils/createToken";
import uploadToCloudinary from "../../utils/uploadToCloudinary";


const UpdateAdminProfileService = async (req: any, adminUserId: string, payload: Partial<IAdmin>) => {
    //if image is available
    if (req.file) {
        payload.profileImg = await uploadToCloudinary(req?.file?.path as string, "admin");
    }

    //update admin
    await AdminModel.updateOne(
        { userId: adminUserId },
        payload
    )

    const admin = await AdminModel.findOne({ userId: adminUserId });
    const accessToken = createToken({ userId: adminUserId, email: admin?.email as string, fullName:admin?.fullName as string, profileImg:admin?.profileImg as string, role: UserRole.admin }, config.jwt_access_secret as Secret, config.jwt_access_expires_in as TExpiresIn);
    
    return {
        accessToken
    };
}

export default UpdateAdminProfileService