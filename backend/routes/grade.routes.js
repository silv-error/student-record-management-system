import express from "express";
import { editStudentGrade, getStudentGrades } from "../controllers/grade.controller.js";
import { instructorRoute, studentRoute } from "../middleware/accessRoute.js";

const router = express.Router();

router.get("/", studentRoute, getStudentGrades);
router.patch("/:courseId/:studentId", instructorRoute, editStudentGrade);

export default router;