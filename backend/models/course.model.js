import mongoose from "mongoose";

// todo: add semester data
const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  units: {
    type: Number,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  yearLevel: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      grade: {
        type: Number,
        default: null,
      },
    }
  ],
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;