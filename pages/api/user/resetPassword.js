import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import connectDB from "utils/connectDB";
import Users from "models/userModel";
import auth from "middleware/auth";
import bcrypt from "bcrypt";
import { passwordSchema } from "validators/valid";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await resetPassword(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await auth(req, res);

    const { password } = req.body;

    //parse with zod
    passwordSchema.parse(password);

    const passwordHash = await bcrypt.hash(password, 12);

    await Users.findOneAndUpdate(
      { _id: result.id },
      { password: passwordHash }
    );

    res.json({ msg: "Update Successful" });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};
