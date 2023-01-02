import bcrypt from "bcrypt";
import Users from "models/userModel";
import { emailSchema, passwordSchema } from "validators/valid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await resetPassword(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      res.status(404).json({ err: "Please provide all values." });
    }

    //parse with zod
    emailSchema.parse(email);
    passwordSchema.parse(password);

    const user = await Users.findOne({ email });

    if (!user) res.status(400).json({ err: `Wrong Email: ${email}.` });

    const currentDate = new Date();

    if (user) {
      if (user.passwordTokenExpirationDate < currentDate) {
        res.status(403).json({
          err: "Session expired (10 minutes time only)",
        });
      }
      if (user.passwordToken !== token)
        res.status(401).json({ err: "Invalid reset password." });

      console.log(
        `password token expired: ${
          user.passwordTokenExpirationDate < currentDate
        }`
      );

      if (
        user.passwordToken === token &&
        user.passwordTokenExpirationDate > currentDate
      ) {
        const passwordHash = await bcrypt.hash(password, 12);

        user.password = passwordHash;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();

        res.status(200).json({
          msg: `Success! Try to login now.`,
        });
      }
    }
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};
