import connectDB from "utils/connectDB";
import Users from "models/userModel";
import bcrypt from "bcrypt";
import sendVerificationEmail from "utils/sendVerificationEmail";
import { confirmPasswordSchema } from "validators/valid";
import userSchema from "validators/userSchema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await register(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, cf_password, address, mobile } = req.body;

    //parse with zod
    userSchema.parse({
      name,
      email,
      password,
      address,
      mobile,
    });
    confirmPasswordSchema.parse({
      password,
      confirmPassword: cf_password,
    });

    const user = await Users.findOne({ email });
    if (user)
      return res.status(403).json({ err: "This email already exists." });

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = bcrypt.genSaltSync(20);

    const newUser = new Users({
      name,
      email,
      password: passwordHash,
      address,
      mobile,
      verificationToken,
    });

    await sendVerificationEmail({
      name,
      email,
      verificationToken,
      origin: process.env.BASE_URL,
    });

    await newUser.save();
    res.json({ msg: "Success! Please check your email", newUser });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};
