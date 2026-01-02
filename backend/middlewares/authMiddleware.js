import jwt from "jsonwebtoken";
import Token from "../models/Token.js";

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized" });

  const token = auth.split(" ")[1];

  // check token exists in DB
  const tokenExists = await Token.findOne({ token });
  if (!tokenExists)
    return res.status(401).json({ message: "Session expired" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
