import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    

    console.log("✅ Cookie set successfully");
    return token;
  } catch (err) {
    console.error("❌ Error in generateToken:", err.message);
  }
};

export default generateToken;
