import config from "../config";
import UserModel from "../models/UserModel";



const seedSuperAdmin = async () => {

    const superUser = {
        email: config.super_admin_email,
        password: config.super_admin_password,
        role: 'superAdmin',
        regOtp: config.super_admin_reg_otp,
        isVerified: true,
        status: "active"
    }
    //when databse is connected, we will check is there any user who is super admin
    const isSuperAdminExists = await UserModel.findOne({ role: 'superAdmin' });

    //check if there is no superAdmin
    if (!isSuperAdminExists) {
        await UserModel.create(superUser);
        console.log("Super Admin Created");
    }
}


export default seedSuperAdmin;