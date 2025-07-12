import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(400).json({ message: "Unauthorized: Invalid Token" });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export default protectRoute;
