import connectDB from "utils/connectDB";
import jwt from "jsonwebtoken";
import { createAccessToken } from "utils/generateToken";
import User from "models/userModel";

connectDB();

export default async (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) return res.status(401).json({ err: "Please login!" });

    const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET);

    if (!result)
      return res
        .status(400)
        .json({ err: "Your token is incorrect or has expired." });

    const user = await User.findById(result.id);
    if (!user) return res.status(404).json({ err: "User does not exist." });

    const access_token = createAccessToken({ id: user._id });
    res.json({
      access_token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        root: user.root,
        address: user.address,
        mobile: user.mobile,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    if (err.message.includes("jwt expired")) {
      return res.status(500).json({ err: "Session Expired. Login again." });
    }
    return res.status(500).json({ err: err.message });
  }
};
