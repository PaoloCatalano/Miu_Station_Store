import { z } from "zod";
import checkWord from "validators/clean";

export const positiveNumberSchema = z.number().gte(0);

export const nameSchema = z
  .string()
  .trim()
  .min(3, { message: "Must have at least 3 characters" })
  .max(20, { message: "20 characters maximum" })
  .refine((w) => checkWord(w) === false, {
    message: "Input not accepted",
  });

export const emailSchema = z.string().email();

export const addressSchema = z
  .string()
  .max(100, { message: "100 characters maximum" })
  .optional()
  .refine((w) => checkWord(w) === false, {
    message: "Input not accepted",
  });

export const mobileSchema = z
  .string()
  .max(0, { message: "Empty or 6 to 15 characters" })
  .or(z.string().min(6).max(15))
  .refine((w) => checkWord(w) === false, {
    message: "Input not accepted",
  });

export const avatarSchema = z.string().url().optional();

export const passwordSchema = z
  .string()
  .min(6, { message: "Must contain at least 6 characters" });

export const confirmPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm password did not match.",
    path: ["confirmPassword"],
  });

export const roleSchema = z.enum(["admin", "user"]);

export const cartSchema = z.object({
  _id: z.string(),
  inStock: positiveNumberSchema,
  sold: positiveNumberSchema,
  quantity: z.number().gte(1),
});
