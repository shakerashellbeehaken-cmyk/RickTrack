import User from "../models/User.js";
import bcrypt from "bcryptjs";  //have to install
import jwt from "jsonwebtoken";
import Token from "../models/Token.js";


export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashed,
    role: role || "user",
  });

  res.json({ message: "User registered" });
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials : email" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials : pass" });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await Token.create({
      userId: user._id,
      token: jwtToken,
    });

    res.json({
  token: jwtToken,
  role: user.role,
  userId: user._id,
});

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.sendStatus(204);

  await Token.findOneAndDelete({ token });

  res.json({ message: "Logged out successfully" });
};


