import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const getCourses = async (req, res) => {
  try {
    const user = req.user;

    const courses = await Course.find({
      $or: [
        { professor: user._id },
        { 'students.student': user._id } // Correctly referencing the nested field
      ]
    }).populate({ path: "students.student", select: "-password"}).lean();

    if(!courses) {
      return res.status(404).json({ success: false, error: "No courses found" });
    }

    res.status(200).json({ success: true, courses})
  } catch (error) {
    console.error(`Error in getCourses: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Course has been deleted successfully" });
  } catch (error) {
    console.error(`Error in deleteCourse: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const getEnrolledStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate({
      path: "students.student", select: "-password"
    }).lean();
    if(!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }
    res.status(200).json(course.students)
  } catch (error) {
    console.error(`Error in getEnrolledStudents: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const createCourse = async (req, res) => {
  try {
    const { code, title, units, room, day, startTime, endTime, status } = req.body;
    
    if(!code || !title || !units || !room || !day || !startTime || !endTime || !status) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const course = new Course({
      code,
      title,
      units,
      room,
      day,
      startTime,
      endTime,
      status,
      professor: req.user._id
    });

    await course.save();
    res.status(201).json({ success: true, message: "Course created successfully", course });
  } catch (error) {
    console.error(`Error in createCourse: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const editCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, title, units, room, day, startTime, endTime, status } = req.body;

    let course = await Course.findById(id);
    if(!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    course.code = code || course.code;
    course.title = title || course.title;
    course.units = units || course.units;
    course.room = room || course.room;
    course.day = day || course.day;
    course.startTime = startTime || course.startTime;
    course.endTime = endTime || course.endTime;
    course.status = status || course.status;

    await course.save();
    res.status(200).json({ success: true, message: "Course updated successfully", course });
  } catch (error) {
    console.error(`Error in editCourse: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const enrollStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    const student = await User.findOne({ email });
    if(!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }
    
    const enrolledStudent = await Course.findOne({_id: id, 'students.student': {
      $eq: student._id
    }});
    
    if(enrolledStudent) {
      return res.status(404).json({ success: false, error: "Student is already enrolled" });
    }
    
    let course = await Course.findByIdAndUpdate(id, { $push: {
      students: { student: student._id },
    }}, { new: true }).populate({ path: "students.student", select: "-password"});
    if(!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Student enrolled successfully", course});
  } catch (error) {
    console.error(`Error in enrollStudent: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const unenrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    const course = await Course.findByIdAndUpdate(courseId, { $pull: {
      students: { student: studentId},
    }}, { new: true });

    res.status(200).json({ success: true, message: "Student has been removed to your course", course});
  } catch (error) {
    console.error(`Error in unenrollStudent: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}