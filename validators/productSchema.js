import { z } from "zod";
import { positiveNumberSchema } from "./valid";

const positiveNumberFromStringSchema = z
  .string()
  .regex(/^[0-9]+$/, { message: "Must be a positive number" })
  .transform(Number);

const notEmptyStringSchema = z.string().trim().min(1);

const booleanCheckboxSchema = z.string().optional().transform(Boolean);

export const ProductSchema = z.object({
  title: notEmptyStringSchema,
  price: positiveNumberFromStringSchema,
  inStock: positiveNumberFromStringSchema,
  description: notEmptyStringSchema,
  content: notEmptyStringSchema,
  category: notEmptyStringSchema.refine(
    (category) => {
      return !category.includes("all");
    },
    { message: "Select a Category" }
  ),
  onSale: booleanCheckboxSchema,
  images: z.object({ size: z.number().gt(0, { message: "File missing" }) }),
  // .catchall(z.any()),
});

export const ServerProductSchema = z.object({
  title: notEmptyStringSchema,
  price: positiveNumberSchema,
  inStock: positiveNumberSchema,
  description: notEmptyStringSchema,
  content: notEmptyStringSchema,
  category: notEmptyStringSchema,
  onSale: z.boolean(),
});
