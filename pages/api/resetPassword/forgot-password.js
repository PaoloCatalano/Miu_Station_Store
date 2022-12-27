import bcrypt from "bcrypt";
import Users from "models/userModel";
import sendResetPasswordEmail from "utils/sendResetPasswordEmail";
import { emailSchema } from "validators/valid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await forgotPassword(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ err: "Please insert your email." });
    }

    //parse with zod
    emailSchema.parse(email);

    const user = await Users.findOne({ email });

    if (user) {
      const passwordToken = bcrypt.genSaltSync(20);
      //send email
      const origin = process.env.BASE_URL;

      await sendResetPasswordEmail({
        name: user.name,
        email: user.email,
        token: passwordToken,
        origin,
      });
      const _10Minutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + _10Minutes);

      user.passwordToken = passwordToken;
      user.passwordTokenExpirationDate = passwordTokenExpirationDate;
      await user.save();
    }

    res.status(200).json({
      msg: "Check in your emails and click on the reset password link",
    });
  } catch (error) {
    if (err instanceof ZodError) {
const validationError = fromZodError(err);
return res.status(400).json({ err: validationError.details[0].message });    }
    return res.status(500).json({ err: err.message });
  }
};
