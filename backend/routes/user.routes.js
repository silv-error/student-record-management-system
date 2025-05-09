import express from "express";
import { editProfile, getUserProfile, changePassword } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:id", getUserProfile);
router.patch("/edit", editProfile);
router.patch("/change-password", changePassword);

export default router;