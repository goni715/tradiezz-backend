import { Document } from "mongoose";


export interface IUser extends Document {
    email: string;
    password: string;
    isVerified: boolean;
    passwordChangedAt?: Date;
    status: "pending" | "active" | "blocked";
    role: "candidate" | "employer" | "admin" | "superAdmin";
    regOtp: string;
    regOtpExpires: Date,
    forgotOtp: string;
    forgotOtpstatus: number;
    forgotOtpExpires: Date,
};