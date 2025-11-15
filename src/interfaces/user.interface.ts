import { Document } from "mongoose";

export type TUserRole = "candidate" | "employer" | "admin" | "superAdmin";


export interface IUser extends Document {
    email: string;
    password: string;
    isVerified: boolean;
    passwordChangedAt?: Date;
    status: "pending" | "active" | "blocked";
    role: TUserRole;
    regOtp: string;
    regOtpExpires: Date,
    forgotOtp: string;
    forgotOtpstatus: number;
    forgotOtpExpires: Date,
};


export type TEmployerQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};