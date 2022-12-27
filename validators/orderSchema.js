import { z } from "zod";
// import { addressSchema, mobileSchema } from "./valid";

const orderSchema = z.object({
  total: z.number().gte(0),
  address: z.string().optional(),
  mobile: z.string().optional(),
  cart: z.array(
    z.object({
      _id: z.string(),
      title: z.string(),
      images: z.array(),
      price: z.number().gte(0),
      inStock: z.number().gte(0),
      sold: z.number().gte(0),
      quantity: z.number().gte(1),
    })
  ),
});

export default orderSchema;
