import { Document } from "mongoose";

export type TCategoryStatus = 'visible' | 'hidden';

export interface ICategory extends Document {
    name: string;
    slug: string;
    image: string;
    status: TCategoryStatus
}


export type TCategoryQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: TCategoryStatus
};
