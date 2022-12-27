import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  passwordSchema,
  addressSchema,
  mobileSchema,
  // roleSchema
} from "./valid";

const userSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  mobile: mobileSchema,
  // role: roleSchema,
  // root: z.boolean(),
  // avatar: z.string().url(),
  // isVerified: z.boolean(),
  // verificationToken: z.string(),
});

export default userSchema;
