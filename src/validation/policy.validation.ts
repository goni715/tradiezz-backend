import { z } from "zod";
import { PolicyTypeArray } from "../constant/Policy.constant";
import { TPolicyType } from "../interfaces/policy.interface";

export const createPolicyValidationSchema = z.object({
  type: z.string({
    invalid_type_error: "type must be a valid string value.",
  })
    .refine((val) => PolicyTypeArray.includes(val as TPolicyType), {
      message: "type must be one of: 'privacy-policy', 'terms-condition', 'about-us'",
    }).optional(),
  content: z
    .string({
      required_error: "content value is required",
      invalid_type_error: "content must be html value"
    })
    .min(1, { message: "Content must not be empty." })
});


