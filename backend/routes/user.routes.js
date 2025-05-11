import express from "express";
import { instructorRoute } from "../middleware/accessRoute.js";
import { editProfile, getUserProfile, changePassword, getStudents } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", instructorRoute, getStudents);
router.get("/profile/:id", getUserProfile);
router.patch("/edit", editProfile);
router.patch("/change-password", changePassword);

export default router;