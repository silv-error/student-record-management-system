import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const editStudentGrade = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const { grade } = req.body;

    if(grade > 100 || grade < 0) {
      return res.status(400).json({ success: false, error: "Invalid grade" });
    }
    const student = await User.findById(studentId).lean();
    if(!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $set: { 'students.$[elem].grade': grade } }, 
      { arrayFilters: [{ 'elem.student': studentId }], new: true } 
    ).populate({ path: "students.student", select: "-password"});
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Student grade updated successfully", course });
  } catch (error) {
    console.error(`Error in editStudentGrade: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export const getStudentGrades = async (req, res) => {
  try {
    const user = req.user;
    let course = await Course.find({ students: { $elemMatch: { student: user._id } }}).populate({
      path: "students.student", 
      select: "-password" 
    }).populate({ path: "professor", select: "-password"}).lean();
    if(!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    const courses = course.map(course => {
      const filteredStudents = course.students.filter(student => 
        student.student && student.student._id.toString() === user._id.toString()
      );
      course.students = filteredStudents;
      return course;
  });

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error(`Error in getStudentGrade: ${error.message}`);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}