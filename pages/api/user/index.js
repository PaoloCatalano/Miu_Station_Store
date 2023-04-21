import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import connectDB from "utils/connectDB";
import Users from "models/userModel";
import auth from "middleware/auth";
import {
  nameSchema,
  addressSchema,
  avatarSchema,
  mobileSchema,
} from "validators/valid";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await uploadInfo(req, res);
      break;
    case "GET":
      await getUsers(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

//All users (ONLY admin)
const getUsers = async (req, res) => {
  try {
    const result = await auth(req, res);

    if (result.role !== "admin")
      return res.status(401).json({ err: "Authentication is not valid" });

    const users = await Users.find().select("-password");
    res.json({ users });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const uploadInfo = async (req, res) => {
  try {
    const result = await auth(req, res);

    const { name, address, mobile, avatar } = req.body;

    //parse with zod
    nameSchema.parse(name); //still required
    addressSchema.parse(address);
    mobileSchema.parse(mobile);
    avatarSchema.parse(avatar);

    if (checkWord(name) || checkWord(address) || checkWord(mobile)) {
      return res.status(400).json({
        err: `${checkWord(name) ? name : ""} ${
          checkWord(address) ? address : ""
        }  ${checkWord(mobile) ? mobile : ""}: not accepted.`,
      });
    }

    const newUser = await Users.findOneAndUpdate(
      { _id: result.id },
      { name, address, mobile, avatar }
    );

    res.json({
      msg: "Update Successful",
      user: {
        name,
        address,
        mobile,
        avatar,
        email: newUser.email,
        role: newUser.role,
        root: newUser.root,
        isVerified: newUser.isVerified,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};
