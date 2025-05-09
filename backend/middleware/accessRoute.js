import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const accessRoute = async (req, res, next) => {
  try {
    const token = req.cookies["student-record-user"];
    if(!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided "});
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`Error in accessRoute function: ${error.message}`);
    process.exit(1);
  }
}

export const studentRoute = async (req, res, next) => {
  if(req.user && req.user.role === "Student") {
    next();
  } else {
    console.error(`Error in studentRoute`);
    res.status(401).json({ success: false, error: "Forbidden: Student access is required" });
  }
}

export const instructorRoute = async (req, res, next) => {
  if(req.user && req.user.role === "Instructor") {
    next();
  } else {
    console.error(`Error in instructorRoute`);
    res.status(401).json({ success: false, error: "Forbidden: Instructor access is required" });
  }
}
