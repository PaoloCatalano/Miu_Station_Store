import connectDB from "utils/connectDB";
import Users from "models/userModel";
import bcrypt from "bcrypt";
import sendVerificationEmail from "utils/sendVerificationEmail";
import { confirmPasswordSchema } from "validators/valid";
import userSchema from "validators/userSchema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import rateLimit from "utils/rate-limit";
import checkWord from "validators/clean";

connectDB();

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

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

    if (checkWord(name) || checkWord(address) || checkWord(mobile)) {
      return res.status(400).json({
        err: `${checkWord(name) ? name : ""} ${
          checkWord(address) ? address : ""
        }  ${checkWord(mobile) ? mobile : ""} not accepted.`,
      });
    }

    const user = await Users.findOne({ email });
    if (user)
      return res.status(403).json({ err: "This email already exists." });

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = bcrypt.genSaltSync(20);

    //rate limit
    try {
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
        address,
        mobile,
        verificationToken,
      });

      await limiter.check(res, 10, "CACHE_TOKEN"); // 10 requests per minute

      await sendVerificationEmail({
        name,
        email,
        verificationToken,
        origin: process.env.BASE_URL,
      });

      await newUser.save();
      res.json({ msg: "Success! Please check your email", newUser });
    } catch {
      res.status(429).json({ err: "Rate limit exceeded" });
    }
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};
