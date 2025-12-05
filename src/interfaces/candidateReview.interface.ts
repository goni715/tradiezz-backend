import { Document, Types } from "mongoose";

export interface ICandidateReview extends Document{
    jobId: Types.ObjectId;
    candidateUserId: Types.ObjectId;
    employerUserId: Types.ObjectId;
    star: number;
    comment: string;
    isHidden: boolean;
}