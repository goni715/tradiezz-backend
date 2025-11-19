import z from "zod";
import { fullNameRegex } from "./user.validation";
import isNotObjectId from "../utils/isNotObjectId";

export const registerCandidateValidationSchema = z.object({
    fullName: z
        .string({
            invalid_type_error: "fullName must be string",
            required_error: "fullName is required",
        })
        .trim()
        .regex(fullNameRegex, {
            message:
                "Full Name can only contain letters, spaces, apostrophes, hyphens, and dots.",
        }),
    email: z
        .string({
            invalid_type_error: "email must be string",
            required_error: "email is required",
        })
        .email({
            message: "Invalid email address",
        }),
    phone: z
        .string({
            invalid_type_error: "phone must be string",
            required_error: "phone is required",
        })
        .trim()
        .min(1, "phone is required")
        .regex(/^\+?\d+$/, {
            message: "Phone number can contain only numbers and +",
        }),
    password: z
        .string({
            invalid_type_error: "Password must be string",
            required_error: "Password is required",
        })
        .trim()
        .min(6, "Password minimum 6 characters long")
        .max(60, "Password maximum 60 characters long"),
    subCategoryId: z
        .string({
            invalid_type_error: "subCategoryId must be a string",
            required_error: "subCategoryId is required!",
        })
        .refine((id) => !isNotObjectId(id), {
            message: "subCategoryId must be a valid ObjectId",
        }),
    workRate: z
        .string({
            invalid_type_error: "workRate must be a valid string value.",
            required_error: "workRate value is required"
        })
        .trim()
        .min(1, 'workRate value is required')
        .refine((val) => ['per_hour', 'per_day', 'per_job'].includes(val), {
            message: "workRate must be one of: 'per_hour', 'per_day' 'per_job'",
        }),
    workType: z
        .string({
            invalid_type_error: "workType must be a valid string value.",
            required_error: "workType value is required"
        })
        .trim()
        .min(1, "workType value is required")
        .refine((val) => ['full_time', 'part_time', 'gig', 'evenings_weekends'].includes(val), {
            message: "workType must be one of: 'full_time', 'part_time', 'gig', 'evenings_weekends'",
        }),
    availableDate: z
        .string({
            required_error: "availableDate is required",
            invalid_type_error: "availableDate must be string value",
        })
        .trim()
        .min(1, { message: "availableDate is required" })
        .superRefine((date, ctx) => {
            const formatRegex = /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

            // 1️⃣ Validate format first
            if (!formatRegex.test(date)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Invalid Date format, expected 'YYYY-MM-DD'",
                });
                return; // stop further checks
            }

            // 2️⃣ Parse date and check future
            const inputDate = new Date(date + "T00:00:00"); // consistent local date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);

            if (inputDate < today) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Available date must be today or a future date",
                });
            }
        }),
    employmentType: z
        .string({
            invalid_type_error: "employmentType must be a valid string value.",
            required_error: "employmentType value is required"
        })
        .refine((val) => ['self_employed', 'seeking_employed', 'both'].includes(val), {
            message: "employmentType must be one of: 'self_employed', 'seeking_employed', 'both'",
        }),
    latitude: z
        .number({
            invalid_type_error: "latitude must be number value",
            required_error: "latitude value is required"
        })
        .finite()
        .min(-90, { message: "latitude must be >= -90" })
        .max(90, { message: "latitude must be <= 90" }),
    longitude: z
        .number({
            invalid_type_error: "longitude must be number value",
            required_error: "longitude value is required"
        })
        .finite()
        .min(-180, { message: "longitude must be >= -180" })
        .max(180, { message: "longitude must be <= 180" }),
    address: z
        .string({
            invalid_type_error: "Address must be string",
            required_error: "address is required",
        })
        .trim(),
    skills: z
        .array(
            z.string({
                required_error: "skill is required",
                invalid_type_error: "skill must be string",
            }), {
            required_error: "skills must be an array of strings",
            invalid_type_error: "skills must be an array of strings",
        }
        )
        .min(1, "You must add at least one skill !")
        .superRefine((arr, ctx) => {
            if (arr && arr?.length > 0) {
                const duplicates = arr.filter((item, index) => arr.indexOf(item) !== index);
                if (duplicates.length > 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Skills must not contain duplicate values",
                    });
                }
            }
        }),
    experience: z
        .string({
            invalid_type_error: "experience must be a valid string value.",
            required_error: "experience value is required"
        })
        .refine((val) => ['entry', 'mid', 'senior', 'expert'].includes(val), {
            message: "experience must be one of: 'entry', 'mid', 'senior', 'expert'",
        }),
})