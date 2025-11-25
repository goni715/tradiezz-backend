import { Document, Types } from "mongoose";


export interface IFavoriteJob extends Document{
    candidateUserId: Types.ObjectId;
    jobId: Types.ObjectId;
}

export type TFavoriteJobQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};