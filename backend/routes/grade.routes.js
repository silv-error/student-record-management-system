import express from "express";
import { editStudentGrade } from "../controllers/grade.controller.js";

const router = express.Router();

router.patch("/:courseId/:studentId", editStudentGrade);

export default router;