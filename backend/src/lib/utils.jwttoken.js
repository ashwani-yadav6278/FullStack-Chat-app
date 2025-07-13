const generateToken = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("🔒 JWT created:", token);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("🍪 Cookie set successfully");
  } catch (error) {
    console.error("❌ Error generating token:", error.message);
  }
};
