import jwt from "jsonwebtoken";
import Users from "models/userModel";

const auth = async (req, res) => {
  const token = req.headers.authorization;
  if (!token)
    return res.status(400).json({ err: "Invalid Authentication. No Token." });

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded)
    return res
      .status(403)
      .json({ err: "Invalid Authentication. Not verified." });

  const user = await Users.findOne({ _id: decoded.id });
  if (!user)
    return res.status(404).json({ err: `User with ${decoded.id} not found.` });

  return { id: user._id, role: user.role, root: user.root };
};

export default auth;
