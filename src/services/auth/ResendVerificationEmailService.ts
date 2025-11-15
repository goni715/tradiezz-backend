import CustomError from "../../errors/CustomError";
import UserModel from "../../models/UserModel";
import sendVerificationEmail from "../../utils/email/sendVerificationEmail";


const ResendVerificationEmailService = async (email: string) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new CustomError(404, `Couldn't find this email address`);
    }

    //check if user is already verified
    if (user.isVerified) {
        throw new CustomError(409, "This Email address is already verified");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    //update otp
    await UserModel.updateOne({ email }, { regOtp: otp, regOtpExpires: new Date(+new Date() + 600000) });

    //send verification email
    await sendVerificationEmail(email, otp.toString());
    
    return null;
}

export default ResendVerificationEmailService;