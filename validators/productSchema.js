import { z } from "zod";
import { nameSchema } from "./valid";

const productSchema = z.object({
  title: z.string().trim().min(1),
  price: z.number().nonnegative(),
  inStock: z.number().nonnegative(),
  description: z.string(),
  content: z.string(),
  category: nameSchema,
  onSale: z.boolean(),
  images: z.array(z.object({ url: z.string().url() })),
});

export default productSchema;
