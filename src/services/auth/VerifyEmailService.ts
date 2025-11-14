import CustomError from "../../errors/CustomError";
import { IVerifyOTp } from "../../interfaces/auth.interface";
import UserModel from "../../models/UserModel";

const VerifyEmailService = async (payload: IVerifyOTp) => {
  const { email, otp } = payload;

  const user = await UserModel.findOne({ email: payload.email });

  if (!user) {
    throw new CustomError(404, "Couldn't find this email address");
  }

  //user is alreay verified
  if (user.isVerified) {
    throw new CustomError(409, "This Email is already verified");
  }

  if (user.regOtp !== otp) {
    throw new CustomError(400, "Invalid Otp Code");
  }

  const otpExpired = await UserModel.findOne({
    email,
    regOtp:otp,
    regOtpExpires: { $gt: new Date(Date.now()) },
  });

  if (!otpExpired) {
    throw new CustomError(400, "Expired Otp Code");
  }

  //update the user 
  await UserModel.updateOne(
    { email: user.email }, 
    { isVerified: true, regOtp:"000000", status: "active" }
  )
  
  return null;

}

export default VerifyEmailService