import connectDB from "utils/connectDB";
import Users from "models/userModel";
import auth from "middleware/auth";
import { roleSchema } from "validators/valid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await updateRole(req, res);
      break;
    case "DELETE":
      await deleteUser(req, res);
      break;
    default:
      return res.status(405).json({ err: `${req.method} method not allowed.` });
  }
};

const updateRole = async (req, res) => {
  try {
    const result = await auth(req, res);

    if (result.role !== "admin" || !result.root)
      return res.status(401).json({ err: "Authentication is not valid" });

    const { id } = req.query;
    const { role } = req.body;

    //parse with zod
    roleSchema.parse(role);

    await Users.findOneAndUpdate({ _id: id }, { role });
    res.json({ msg: "Update Successful!" });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ err: validationError.details[0].message });
    }
    return res.status(500).json({ err: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await auth(req, res);

    if (result.role !== "admin" || !result.root)
      return res.status(401).json({ err: "Authentication is not valid" });

    const { id } = req.query;

    await Users.findByIdAndDelete(id);
    res.json({ msg: "User deleted." });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
