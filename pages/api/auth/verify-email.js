import connectDB from "utils/connectDB";
import Users from "models/userModel";
import { emailSchema } from "validators/valid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await verifyEmail(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { verificationToken, email } = req.body;

    //parse with zod
    emailSchema.parse(email);

    const user = await Users.findOne({ email });

    if (!user) res.status(400).json({ err: `Email ${email} error.` });
    if (user.verificationToken !== verificationToken)
      res.status(401).json({ err: "Verification failed." });
    if (user.isVerified)
      res.status(403).json({ err: "This user is already verified." });

    user.isVerified = true;
    user.verified = Date.now();
    // user.verificationToken = ""; //ONLY one time convalidate

    await user.save();

    res.status(200).json({ msg: "Email verified" });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};
