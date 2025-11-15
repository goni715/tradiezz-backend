import CustomError from "../../errors/CustomError";
import { INewPassword } from "../../interfaces/auth.interface";
import UserModel from "../../models/UserModel";
import hashedPassword from "../../utils/hashedPassword";

const ForgotPasswordSetNewPasswordService = async (payload: INewPassword) => {
  const { email, otp, password } = payload;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new CustomError(404, `Couldn't find this email address`);
  }

  //check email is not verified
  if (!user.isVerified) {
    throw new CustomError(403, "Your account is not verified");
  }

  //check user is blocked
  if (user.status === "blocked") {
    throw new CustomError(403, "Your account is blocked !");
  }

  //check otp exist
  const otpExist = await UserModel.findOne({ email, forgotOtp: otp, forgotOtpstatus: 1 });
  if (!otpExist) {
    throw new CustomError(400, "Invalid Verification Code");
  }

  //check otp is expired
  const OtpExpired = await UserModel.findOne({
    email,
    forgotOtp:otp,
    forgotOtpstatus: 1,
    forgotOtpExpires: { $gt: new Date(Date.now()) }
  });


  if (!OtpExpired) {
    throw new CustomError(410, `Expired Verification Code`);
  }

  //update the password
  const hashPass = await hashedPassword(password);//hashedPassword
  const result = await UserModel.updateOne({ email }, { password: hashPass, passwordChangedAt: new Date(), forgotOtp: '000000' })

  return result;
}


export default ForgotPasswordSetNewPasswordService;