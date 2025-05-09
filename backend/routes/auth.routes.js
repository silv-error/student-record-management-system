import express from "express";
import { accessRoute } from "../middleware/accessRoute.js";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", accessRoute, getMe);

export default router;