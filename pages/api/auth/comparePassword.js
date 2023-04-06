import connectDB from "utils/connectDB";
import Users from "models/userModel";
import bcrypt from "bcrypt";
import { emailSchema, passwordSchema } from "validators/valid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await comparePassword(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const comparePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    //zod parsing
    emailSchema.parse(email);
    passwordSchema.parse(password);

    const user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ err: "Incorrect user email." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ err: "Incorrect old password." });

    res.json({
      msg: "Password Correct",
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};
