/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import CustomError from "../../errors/CustomError";
import { IRegisterEmployerPayload } from "../../interfaces/auth.interface";
import UserModel from "../../models/UserModel";
import EmployerModel from "../../models/EmployerModel";
import sendVerificationEmail from "../../utils/email/sendVerificationEmail";



const RegisterEmployerService = async (reqBody: IRegisterEmployerPayload) => {
    const { email, fullName, phone, password } = reqBody;

    //check email
    const existingUser = await UserModel.findOne({ email });

    //User already exists and verified
    if (existingUser && existingUser.isVerified) {
        throw new CustomError(409, "Email is already existed");
    }

    //User exists but not verified → resend verification
    if (existingUser && !existingUser.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        //update existingUser
        await UserModel.updateOne(
            { email }, 
            { regOtp: otp, regOtpExpires: new Date(+new Date() + 600000) },
            { runValidators: true }
        );
        //send verification email
        await sendVerificationEmail(email, otp.toString());

        return {
            message: "Verification email resent. Please check your inbox."
        }
    }


    //transaction & rollback
    const session = await mongoose.startSession();
    
    try {

        session.startTransaction();

        const otp = Math.floor(100000 + Math.random() * 900000);
        //create new user
        const newUser = await UserModel.create(
            [{
                email, 
                password,
                regOtp: otp,
                role: "employer"
            }],
            { session }
        );

        //create new employer
        await EmployerModel.create(
            [
                {
                    userId: newUser[0]?._id,
                    email,
                    fullName,
                    phone
                }
            ],
            { session }
        )

        //send verification email
        await sendVerificationEmail(email, otp.toString());

        //transaction success
        await session.commitTransaction();
        await session.endSession();
        return {
            message: "Please check your email to verify"
        }
    }
    catch (err:any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    } 
}

export default RegisterEmployerService;