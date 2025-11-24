import z from "zod";
import isNotObjectId from "../utils/isNotObjectId";


export const createJobValidationSchema = z.object({
    title: z
        .string({
            invalid_type_error: "title must be string",
            required_error: "title is required",
        })
        .min(1, "title is required")
        .trim(),
    categoryId: z
        .string({
            invalid_type_error: "categoryId must be a string",
            required_error: "categoryId is required!",
        })
        .refine((id) => !isNotObjectId(id), {
            message: "categoryId must be a valid ObjectId",
        })
        .optional(),
})