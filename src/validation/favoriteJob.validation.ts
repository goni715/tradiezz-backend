import { z } from "zod";
import { Types } from "mongoose";

export const addRemoveFavoriteJobSchema = z.object({
  jobId: z
    .string({
      required_error: "jobId is required!",
    })
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "jobId must be a valid ObjectId",
    }),
});
