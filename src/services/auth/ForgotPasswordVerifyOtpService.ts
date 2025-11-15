import CustomError from "../../errors/CustomError";
import { IVerifyOTp } from "../../interfaces/auth.interface";
import UserModel from "../../models/UserModel";

const ForgotPasswordVerifyOtpService = async (payload: IVerifyOTp) => {
  const { email, otp } = payload;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new CustomError(404, `Couldn't find this email address`);
  }

  //check otp doesn't exist
  const otpExist = await UserModel.findOne({ email, forgotOtp:otp, forgotOtpstatus: 0 });
  if (!otpExist) {
    throw new CustomError(400, "Invalid Verification Code");
  }

  //check otp is expired
  const otpExpired = await UserModel.findOne({
    email,
    forgotOtp: otp,
    forgotOtpstatus: 0,
    forgotOtpExpires: { $gt: new Date(Date.now()) },
  });

  if (!otpExpired) {
    throw new CustomError(410, "Expired Verification Code");
  }


  //update the otp status
  await UserModel.updateOne(
    { email, forgotOtp:otp, forgotOtpstatus: 0 },
    { forgotOtpstatus: 1 },
    { runValidators: true }
  );

  return null;
};

export default ForgotPasswordVerifyOtpService;