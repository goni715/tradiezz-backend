import { Document, Types } from "mongoose";


export interface IEmployer extends Document{
    userId: Types.ObjectId;
    fullName: string;
    phone: string;
}