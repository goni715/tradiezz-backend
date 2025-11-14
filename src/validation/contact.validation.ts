import z from "zod";
import { fullNameRegex } from "./user.validation";

export const contactValidationSchema = z.object({
    name: z
        .string({
            invalid_type_error: "Name must be string",
            required_error: "Name is required",
        })
        .trim()
        .regex(fullNameRegex, {
            message:
                "Name can only contain letters, spaces, apostrophes, hyphens, and dots.",
        }),
    email: z
        .string({
            invalid_type_error: "email must be string",
            required_error: "email is required",
        })
        .email({
            message: "Invalid email address",
        }),
    subject: z
        .string({
            invalid_type_error: "subject must be string",
            required_error: "subject is required",
        })
        .trim()
        .min(1, "subject is required"),
    message: z
        .string({
            invalid_type_error: "message must be string",
            required_error: "message is required",
        })
        .trim()
        .min(1, "message is required")
});


export const replyContactValidationSchema = z.object({
    replyMessage: z
        .string({
            invalid_type_error: "replyMessage must be string",
            required_error: "replyMessage is required",
        })
        .trim()
        .min(1, "replyMessage is required")
});