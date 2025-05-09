import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateAccessToken = (userId, res) => {
  const token = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });

  res.cookie("student-record-user", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  });
}

export default generateAccessToken;